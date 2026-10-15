import {test,expect} from '@playwright/test';
import {randomUUID} from 'node:crypto';
const origin='http://localhost:3100';
test('greetings upload privacy validation and ordering',async({page,browser})=>{
 const guest=await browser.newContext({baseURL:origin});
 const write=(config:unknown,extra:Record<string,any>={})=>page.request.put('/api/greetings',{headers:{Origin:origin},multipart:{config:JSON.stringify(config),...extra}});
 expect((await guest.request.put('/api/greetings',{headers:{Origin:origin},multipart:{config:'{}'}})).status()).toBe(403);
 expect((await guest.request.get('/api/greetings?admin=1')).status()).toBe(403);
 expect((await page.request.post('/api/auth/login',{headers:{Origin:origin},data:{username:'test-admin',password:'test-only-password'}})).status()).toBe(200);
 expect((await page.request.put('/api/greetings',{headers:{Origin:'https://evil.invalid'},multipart:{config:'{}'}})).status()).toBe(403);
 const id=randomUUID(),video=randomUUID();const initial={revision:0,items:[{id,name:'테스트 축사',affiliation:'테스트 기관',kind:'pdf',youtube:'',published:false}]};
 expect((await write(initial,{['document-'+id]:{name:'bad.pdf',mimeType:'application/pdf',buffer:Buffer.from('not PDF')}})).status()).toBe(400);
 expect((await write(initial,{['document-'+id]:{name:'large.pdf',mimeType:'application/pdf',buffer:Buffer.concat([Buffer.from('%PDF-'),Buffer.alloc(3*1024*1024)])}})).status()).toBe(400);
 let r=await write(initial,{['document-'+id]:{name:'test.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4\n%%EOF')}});expect(r.status()).toBe(200);let data=await r.json();const file=data.items[0].document.id;
 expect((await (await guest.request.get('/api/greetings')).json()).items).toHaveLength(0);
 expect((await guest.request.get('/api/greetings/'+file)).status()).toBe(404);expect((await page.request.get('/api/greetings/'+file)).status()).toBe(200);
 expect((await write(initial)).status()).toBe(409);data.items[0].published=true;
 data.items.unshift({id:video,name:'영상 축사',affiliation:'기관',published:true,kind:'youtube',youtube:'https://evil.invalid/watch?v=abcdefghijk'});
 expect((await write(data)).status()).toBe(400);data.items[0].youtube='https://youtu.be/abcdefghijk';r=await write(data);expect(r.status()).toBe(200);data=await r.json();
 expect((await (await guest.request.get('/api/greetings')).json()).items.map((i:any)=>i.id)).toEqual([video,id]);
 expect((await guest.request.get('/api/greetings/'+file+'?download=1')).headers()['content-disposition']).toContain('attachment');
 await page.goto('/launch');await expect(page.locator('.greeting-card')).toHaveCount(2);expect(await page.locator('iframe').count()).toBe(0);
 for(const width of [1440,390]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();}
 await page.goto('/admin/greetings');await expect(page.getByRole('heading',{name:'출범식 축사 관리'})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 data.banner={project:'테스트 사업',title:'테스트 출범식',date:'2026. 10. 16. (금) 16:00',venue:'테스트 장소',href:'https://invalid.example'};
 expect((await write(data)).status()).toBe(400);
 data.banner.href='/launch';r=await write(data);expect(r.status()).toBe(200);data=await r.json();
 await page.goto('/');await expect(page.locator('.launch-banner h2')).toHaveText('테스트 출범식');
 await expect(page.locator('.launch-banner-button')).toHaveAttribute('href','/launch');
 for(const width of [1440,390]){await page.setViewportSize({width,height:950});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();await page.locator('.launch-banner').screenshot({path:'.data/launch-upload/banner-preview-'+width+'.png'});}
 expect((await write({...data,items:[]})).status()).toBe(200);expect((await page.request.get('/api/greetings/'+file)).status()).toBe(404);await guest.close();
});
