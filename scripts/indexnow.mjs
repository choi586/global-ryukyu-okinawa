// Tells Naver and Bing (IndexNow) that the site's pages changed. Run after a deploy:
//   node scripts/indexnow.mjs            → submits every URL in the live sitemap
//   node scripts/indexnow.mjs /news/abc  → submits only the given paths
// Google does not use IndexNow; use Search Console for Google.
const host = 'okinawa.khu.ac.kr';
const key = '0daa9607d2e5b6f7eacc6c9e98de87fd'; // must match public/<key>.txt
const endpoints = ['https://searchadvisor.naver.com/indexnow', 'https://api.indexnow.org/indexnow'];

async function sitemapUrls() {
  const index = await (await fetch(`https://${host}/sitemap.xml`)).text();
  const maps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const urls = [];
  for (const map of maps) {
    const xml = await (await fetch(map)).text();
    urls.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  }
  return urls;
}

const args = process.argv.slice(2);
const urlList = args.length ? args.map((p) => `https://${host}${p.startsWith('/') ? p : '/' + p}`) : await sitemapUrls();
const body = JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList });
for (const endpoint of endpoints) {
  const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body });
  console.log(`${endpoint}: ${res.status} ${res.statusText} (${urlList.length} URLs)`);
}
