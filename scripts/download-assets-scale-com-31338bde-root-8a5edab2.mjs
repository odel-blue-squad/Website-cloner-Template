// Asset downloader for scale.com / (root). Namespaced: public/sites/<site-key>/<page-key>/
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const SK = 'scale-com-31338bde', PK = 'root-8a5edab2';
const BASE = `public/sites/${SK}/${PK}`;
const SANITY = 'https://cdn.sanity.io/images/50zba0eo/production/';
const SANITY_F = 'https://cdn.sanity.io/files/50zba0eo/production/';

// [localName, url]
const TEXTURES = [
  ['perlin256.png', 'https://scale.com/static/assets/textures/perlin256.png'],
  ['numbers.png',   'https://scale.com/static/assets/textures/numbers.png'],
  ['logo.png',      'https://scale.com/static/assets/textures/logo.png'],
];
const VIDEOS = [
  ['packed.mp4',        'https://scale.com/static/assets/videos/Packed.mp4'],
  ['quote-bg.mp4',      SANITY_F + '97c3da76fd2ebdb89834e10e0aed5f090a2754e1.mp4'],
  ['cta-bg.mp4',        SANITY_F + 'f431eed439caa66dbb64280b91c889e837da570e.mp4'],
];
const q = (id, w) => `${SANITY}${id}?w=${w}&auto=format`;
const INDUSTRY = [
  ['industry-research.png',      q('dce109335aaf854e1fb7fd72a0a7f6fbe22a3c8b-2048x2048.png', 1920)],
  ['industry-medicine.png',      q('71323426218d44ec6da84c37a9353b1803f94442-3456x1938.png', 1920)],
  ['industry-decisions.png',     q('ec34b53bd712599cd7ac0939f43cd81c403828e1-3456x1940.png', 1920)],
  ['industry-energy.jpg',        q('b92ad898cd22476f626aaa9c74fc804239df59d6-3000x2000.jpg', 1920)],
  ['industry-impact.jpg',        q('8262cd6e2eda0fbfef6867f4187e37944145f7d4-8000x6000.jpg', 1920)],
  ['industry-sovereignty.jpg',   q('10a5e344562b660346f2e4bf5bf8d981b4359069-4000x3000.jpg', 1920)],
  ['industry-robots.jpg',        q('45cd55071ff0c3695cb450373a0caaa475482389-2560x1920.jpg', 1920)],
  ['industry-capabilities.jpg',  q('bba83e379f800d12bacfad7b987fd198ccd3eb6a-2100x1406.jpg', 1920)],
  ['industry-supply-chains.jpg', q('9ce2032d7c26489bfaf6f10c282b5a98f8b15dcd-8256x5504.jpg', 1920)],
  ['industry-consequences.jpg',  q('3a12777d25f73f8e4130cf298c17cd523a7bc04d-4000x6016.jpg', 1920)],
  ['industry-driving.png',       q('aad561cb0bd7d84eb964be48fb72460fb8254275-4191x3353.png', 1920)],
  ['industry-logistics.jpg',     q('db122a5622689a52b093e828389db1485abba93e-6676x4453.jpg', 1920)],
];
const LOGOS = [
  ['logo-cdao.png',            q('06ddf973b41faadcb9183c561c6eb38f6677feca-400x400.png', 192)],
  ['logo-meta.png',            q('47555b2111665c2b76f8d1b22758e44be9390377-100x110.png', 192)],
  ['logo-mayo-clinic.png',     q('7279005b3cf528a530f5ea380948b8ca599c916f-728x800.png', 192)],
  ['logo-time.png',            q('94a4ee6faa4ea4ad3ebab5079a4a99a491e89059-100x110.png', 192)],
  ['logo-howard-hughes.png',   q('aa36b3b2ad67828137a2478f177c0e4f7a1a0707-100x110.png', 192)],
  ['logo-physical-intel.png',  q('ecc8b0f73a081fdc8b51e6ad53bca433722b1c3e-100x100.svg', 192)],
  ['logo-universal-robots.png',q('0cca4bd9ecbd0c5d14f16b6712e4204213eb003c-1280x1276.png', 192)],
  ['logo-cais.png',            q('d5d60dee7d334a01238dff8be08e733a846136a9-100x110.png', 192)],
  ['logo-bp.png',              q('97b56ffc0a6705de3b3bf5fefb89355801170fd8-2095x1740.png', 192)],
  ['logo-cengage.png',         q('bb4a5afa6c49ba2fcf20f4b0bcd4833056fa8dae-728x800.png', 192)],
  ['logo-shore-capital.png',   q('29998d0f22b7a6d67d8143cb863cee78d1ae26b8-728x800.png', 192)],
  ['hero-logo-1.png',          'https://cdn.sanity.io/images/50zba0eo/production/8ee4b8bc14e6ce4d1d8190ffb61f326e4657153f-59x64.svg?w=272&fm=png'],
  ['hero-logo-2.png',          q('e417ebdb6525c9e23dd8f1ae5b10c26bfa78fc40-728x800.png', 272)],
  ['hero-logo-3.png',          q('8e61456fc0334f161081b09832bc8f73f76cfd20-728x800.png', 272)],
  ['hero-logo-4.png',          q('c47da44df5fdfa654b9c02be759434e29b8c5051-728x800.png', 272)],
];
const BLOG = [
  ['blog-mayo-clinic.png',   q('7dba1e09ebf0ec7d950e98a9d0acd105d5e321eb-1200x675.png', 1600)],
  ['blog-morgan-stanley.png', q('33a48d23f2ed66d00a6f49019e1cb1c26601fb82-4096x3072.png', 1200)],
  ['blog-ai-policy.jpg',      q('268567baa8c9467df5d292ad90cbe3e56c6c62d6-8660x5773.jpg', 1200)],
  ['blog-bae-systems.jpg',    q('4cee6be6909bbc63ee839b6b7f50661894b2aaee-6222x4148.jpg', 1200)],
  ['blog-swe-bench.png',      q('c3a797461b69aa37f9bd6948f149a5bab1951674-4096x2731.png', 1200)],
  ['blog-mcit-qatar.jpg',     q('9be9b005ec39c35a9324fb9d7e5bc0d4d29b429e-5774x3849.jpg', 1200)],
  ['blog-physical-ai.png',    q('12210b271665290145b311ff1ceace24d079d06b-3456x1942.png', 1200)],
  ['hero-fallback.jpg',       'https://scale.com/images/home-fallback-small.jpg'],
];

const JOBS = [
  ...TEXTURES.map(([n,u]) => [`${BASE}/textures/${n}`, u]),
  ...VIDEOS.map(([n,u])   => [`${BASE}/videos/${n}`,   u]),
  ...INDUSTRY.map(([n,u]) => [`${BASE}/images/${n}`,   u]),
  ...LOGOS.map(([n,u])    => [`${BASE}/images/${n}`,   u]),
  ...BLOG.map(([n,u])     => [`${BASE}/images/${n}`,   u]),
];

async function fetchOne([dest, url]) {
  if (existsSync(dest)) return { dest, status: 'cached' };
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://scale.com/' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 100) throw new Error(`too small (${buf.length}b)`);
      await writeFile(dest, buf);
      return { dest, status: 'ok', bytes: buf.length };
    } catch (err) {
      if (attempt === 3) return { dest, status: 'FAILED', error: String(err.message) };
      await new Promise(r => setTimeout(r, 400 * attempt));
    }
  }
}

for (const d of ['textures', 'videos', 'images']) await mkdir(`${BASE}/${d}`, { recursive: true });

const results = [];
for (let i = 0; i < JOBS.length; i += 4) {
  const batch = await Promise.all(JOBS.slice(i, i + 4).map(fetchOne));
  batch.forEach(r => {
    const tag = r.status === 'FAILED' ? 'FAIL' : r.status === 'cached' ? 'skip' : ' ok ';
    console.log(`[${tag}] ${r.dest}${r.bytes ? ` (${(r.bytes/1024).toFixed(0)}kb)` : ''}${r.error ? ` — ${r.error}` : ''}`);
  });
  results.push(...batch);
}
const failed = results.filter(r => r.status === 'FAILED');
console.log(`\n${results.length} assets · ${results.filter(r=>r.status==='ok').length} downloaded · ${failed.length} failed`);
if (failed.length) { console.log('FAILED:'); failed.forEach(f => console.log(' ', f.dest, f.error)); }
