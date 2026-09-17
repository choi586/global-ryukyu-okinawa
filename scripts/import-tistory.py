"""Import the institute's public Tistory archive. Originals stay in .data/tistory.

Requires beautifulsoup4 and Pillow. Run without --apply to collect/review first.
Network targets come only from the supplied blog and Kakao's media CDN.
"""
import argparse
import concurrent.futures
import io
import json
import re
import sqlite3
import subprocess
import uuid
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse
from bs4 import BeautifulSoup
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / '.data'
ARCHIVE = DATA / 'tistory'
ARCHIVE.mkdir(parents=True, exist_ok=True)
BASE = 'https://ryukyuokinawa2.tistory.com'

def fetch(url):
    host = urlparse(url).hostname or ''
    if not (host == 'ryukyuokinawa2.tistory.com' or host.endswith('.kakaocdn.net') or host.endswith('.daumcdn.net')):
        raise ValueError('Unexpected media host: ' + host)
    return subprocess.run(['curl', '--fail', '--silent', '--show-error', '--location', '--max-time', '60', '--retry', '2', url], check=True, capture_output=True).stdout

def collect(url):
    number = url.rsplit('/', 1)[1]
    saved = ARCHIVE / (number + '.html')
    if not saved.exists():
        saved.write_bytes(fetch(url))
    soup = BeautifulSoup(saved.read_text(), 'html.parser')
    article = soup.select_one('.tt_article_useless_p_margin')
    if article is None:
        raise ValueError('Missing article: ' + url)
    title = soup.select_one('.post-cover h1').get_text(' ', strip=True)
    category = soup.select_one('.post-cover .category').get_text(' ', strip=True)
    date = soup.select_one('meta[property="article:published_time"]')['content']
    images = []
    for img in article.select('img'):
        figure = img.find_parent('figure')
        caption = figure.select_one('figcaption') if figure else None
        src = img.get('data-original') or img.get('src')
        if src and not any(i['url'] == src for i in images):
            images.append({'url': src, 'alt': caption.get_text(' ', strip=True) if caption else img.get('alt') or f'{title} — 이미지 {len(images)+1}'})
    files = []
    for link in article.select('figure.fileblock a[href]'):
        name = link.select_one('.filename')
        files.append({'url': link['href'], 'name': name.get_text(' ', strip=True) if name else link.get_text(' ', strip=True)})
    for element in article.select('script, style, figure.imageblock, figure.imageslideblock, figure.fileblock, figure[data-ke-type="opengraph"]'):
        element.decompose()
    for br in article.select('br'):
        br.replace_with('\n')
    for block in article.select('p, div, h1, h2, h3, li, tr'):
        block.insert_before('\n')
        block.insert_after('\n')
    body = re.sub(r'\n[ \t]*\n+', '\n\n', article.get_text().replace('\xa0', ' ')).strip()
    section = 'publications' if ('출판' in category or 'Japanological' in category or category == '연재') else 'activities'
    if '언론 보도' in title or '공지' in category or number == '35':
        section = 'news'
    if number in ('20', '31'):
        section = 'activities'
    dates = re.findall(r'(?<!\d)(20\d{2}|\d{2})[.]\s*(\d{1,2})[.]\s*(\d{1,2})', title)
    event_date = None
    if dates:
        y, m, d = dates[-1]
        event_date = f'{int(y) + (2000 if len(y) == 2 else 0):04d}-{int(m):02d}-{int(d):02d}'
        datetime.fromisoformat(event_date)
    return {'eventDate': event_date, 'sourceId': number, 'sourceUrl': url, 'sourceCategory': category, 'title': title, 'body': body,
            'publishedAt': date, 'category': section, 'images': images, 'files': files}

def optimize(item):
    attachments = []
    stats = {'originalBytes': 0, 'webBytes': 0}
    for index, media in enumerate(item['images']):
        identity = str(uuid.uuid5(uuid.NAMESPACE_URL, item['sourceUrl'] + '/image/' + str(index)))
        original = ARCHIVE / (identity + '.original')
        if not original.exists():
            original.write_bytes(fetch(media['url']))
        raw = original.read_bytes()
        with Image.open(io.BytesIO(raw)) as source:
            image = ImageOps.exif_transpose(source)
            image.thumbnail((1920, 1920), Image.Resampling.LANCZOS)
            image = image.convert('RGBA' if 'A' in image.getbands() else 'RGB')
            output = io.BytesIO()
            image.save(output, 'WEBP', quality=88, method=6)
            encoded = output.getvalue()
            # Never replace a small source by a larger conversion.
            mime = Image.MIME.get(source.format, '')
            if len(raw) < len(encoded) and mime in ('image/jpeg', 'image/png', 'image/webp') and source.size == image.size and not source.getexif():
                encoded, mime = raw, mime
            else:
                mime = 'image/webp'
            ext = {'image/webp':'webp','image/jpeg':'jpg','image/png':'png'}[mime]
            meta = {'id': identity, 'name': f'tistory-{item["sourceId"]}-{index+1}.{ext}', 'type': mime,
                    'size': len(encoded), 'alt': media['alt'][:300], 'width': image.width, 'height': image.height}
            (ARCHIVE / identity).write_bytes(encoded)
            # Separate smaller image for cards; it remains access-controlled with its parent post.
            image.thumbnail((640,640), Image.Resampling.LANCZOS)
            thumb = io.BytesIO()
            image.save(thumb, 'WEBP', quality=80, method=6)
            thumb_id = str(uuid.uuid5(uuid.NAMESPACE_URL, identity + '/thumbnail'))
            (ARCHIVE / thumb_id).write_bytes(thumb.getvalue())
            meta['thumbnail'] = {'id': thumb_id, 'size': len(thumb.getvalue()), 'width': image.width, 'height': image.height}
            stats['originalBytes'] += len(raw)
            stats['webBytes'] += len(encoded)
            attachments.append(meta)
    for index, media in enumerate(item['files']):
        identity = str(uuid.uuid5(uuid.NAMESPACE_URL, item['sourceUrl'] + '/file/' + str(index)))
        target = ARCHIVE / identity
        if not target.exists():
            target.write_bytes(fetch(media['url']))
        raw = target.read_bytes()
        if not raw.startswith(b'%PDF-'):
            raise ValueError('Unexpected attachment format: ' + item['sourceUrl'])
        attachments.append({'id': identity, 'name': media['name'] or f'tistory-{item["sourceId"]}.pdf', 'type': 'application/pdf', 'size': len(raw), 'alt': ''})
    return attachments, stats

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--apply', action='store_true')
    parser.add_argument('--media', action='store_true')
    args = parser.parse_args()
    sitemap = fetch(BASE + '/sitemap.xml').decode()
    urls = list(dict.fromkeys(re.findall(r'https://ryukyuokinawa2\.tistory\.com/\d+(?=<)', sitemap)))
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        items = list(pool.map(collect, urls))
    (ARCHIVE / 'inventory.json').write_text(json.dumps(items, ensure_ascii=False, indent=2))
    for item in items:
        print(f'{item["sourceId"]}: {item["sourceCategory"]} → {item["category"]} | {len(item["images"])} images, {len(item["files"])} files | {item["title"]}', flush=True)
    if not (args.media or args.apply):
        return
    prepared = []
    for item in items:
        # The introduction already exists on the homepage; the consortium notice was imported from CCS.
        if item['sourceId'] == '1':
            continue
        cached = next((old for old in json.loads((ARCHIVE / 'prepared.json').read_text()) if old['sourceId'] == item['sourceId']), None) if (ARCHIVE / 'prepared.json').exists() else None
        attachments, stats = (cached['attachments'], cached['imageStats']) if cached else optimize(item)
        item['attachments'], item['imageStats'] = attachments, stats
        prepared.append(item)
        print('Prepared', item['sourceId'], len(attachments), stats, flush=True)
    (ARCHIVE / 'prepared.json').write_text(json.dumps(prepared, ensure_ascii=False, indent=2))
    if not args.apply:
        return
    database = sqlite3.connect(DATA / 'institute.sqlite')
    backup = sqlite3.connect(ARCHIVE / ('before-import-' + datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%f') + '.sqlite'))
    database.backup(backup)
    backup.close()
    uploads = DATA / 'uploads'
    uploads.mkdir(exist_ok=True)
    now = datetime.now(timezone.utc).isoformat()
    with database:
        for item in prepared:
            identity = str(uuid.uuid5(uuid.NAMESPACE_URL, item['sourceUrl']))
            if item['sourceId'] == '35':
                existing = next((json.loads(row[0]) for row in database.execute("SELECT data FROM records WHERE namespace='notices'") if json.loads(row[0])['title'] == item['title']), None)
                if existing:
                    for attachment in item['attachments']:
                        if not any(a['id'] == attachment['id'] for a in existing['attachments']):
                            for key in [attachment['id'], attachment['thumbnail']['id']]:
                                (uploads / key).write_bytes((ARCHIVE / key).read_bytes())
                            existing['attachments'].append(attachment)
                    existing.update(category='news', sourceUrl=item['sourceUrl'], sourceCategory=item['sourceCategory'])
                    database.execute('UPDATE records SET data=? WHERE namespace=? AND id=?', (json.dumps(existing, ensure_ascii=False), 'notices', existing['id']))
                    print('Merged duplicate:', item['sourceId'])
                    continue
            if database.execute('SELECT 1 FROM records WHERE namespace=? AND id=?', ('notices', identity)).fetchone():
                print('Already imported, preserving edits:', item['sourceId'])
                continue
            for file in item['attachments']:
                for key in [file['id']] + ([file['thumbnail']['id']] if file.get('thumbnail') else []):
                    (uploads / key).write_bytes((ARCHIVE / key).read_bytes())
            record = {k: item[k] for k in ['title','body','category','publishedAt','attachments','sourceUrl','sourceCategory','eventDate']}
            record.update(id=identity, slug='tistory-' + item['sourceId'], status='published', pinned=False, createdAt=now, updatedAt=now)
            database.execute('INSERT INTO records VALUES (?,?,?)', ('notices', identity, json.dumps(record, ensure_ascii=False)))
    print('Import complete:', len(prepared))

if __name__ == '__main__':
    main()
