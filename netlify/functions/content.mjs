import { getStore } from '@netlify/blobs';

const DEFAULT_CONTENT = {
  contact: {
    eyebrow: 'Connect With the Team',
    heading: 'Connect With Ishha Farha Quraishy Team',
    copy: 'For collaborations, appearances, speaking engagements and partnerships, connect with the team directly.',
    instagram: 'https://www.instagram.com/ishhafarhaquraishy/',
    linkedin: 'https://www.linkedin.com/in/amb-dr-isha-farha-quraishy-56224519/',
    email: 'hello@ishafarhaquraishy.com'
  },
  youtube: {
    channel: 'https://www.youtube.com/@TheIshaCode',
    videos: [
      { id: 'HwALWtCwBak', title: 'Is The Reality Deceiving Us?', tag: 'Chapter 1' },
      { id: 'P-CR5aj566Y', title: 'Who Really Owns the Future?', tag: 'Chapter 2' },
      { id: 'GBYBPloMPLg', title: 'The 16-Year-Old Building AI in India', tag: 'The Isha Code' }
    ]
  },
  instagram: {
    profile: 'https://www.instagram.com/ishhafarhaquraishy/',
    posts: [
      { url: 'https://www.instagram.com/p/CxdhK5ivS5u/', label: 'Beyond the Crown' },
      { url: 'https://www.instagram.com/p/CnZccbwubDy/', label: 'On the Journey' },
      { url: 'https://www.instagram.com/reel/DaBYQz-tGmg/', label: 'Latest Reel' },
      { url: 'https://www.instagram.com/reel/DaGsOgdtZ2w/', label: 'In Motion' }
    ]
  },
  blogs: [
    { category: 'Biography', title: 'The Story of an Extraordinary Life', excerpt: 'The Prolific Woman: The Ishha Experience documents a remarkable journey across AI, diplomacy, global leadership and peace.', image: '/images/linkedin-blog-1.jpg', url: 'https://www.linkedin.com/feed/update/urn:li:activity:7494866125818585088/' },
    { category: 'Legacy', title: 'A Glimpse Into a Two-Year Journey', excerpt: 'An exclusive birthday edition exploring the discipline, artistry, resilience and humanitarian purpose behind the Ishha experience.', image: '/images/linkedin-blog-2.jpg', url: 'https://www.linkedin.com/feed/update/urn:li:activity:7444707798413721600/' },
    { category: 'Global Visionary', title: 'The First Definitive Account of a Global Visionary', excerpt: 'A portrait of a bridge-builder connecting AI innovation and international diplomacy with empathy, education and social impact.', image: '/images/linkedin-blog-3.jpg', url: 'https://www.linkedin.com/feed/update/urn:li:activity:7437068264381247488/' },
    { category: 'Leadership', title: 'A Powerful New Chapter in Technology Leadership', excerpt: 'Celebrating a new journey shaping Cloud Infrastructure, Data and AI for the public sector across the Middle East and Africa.', image: '/images/linkedin-blog-4.jpg', url: 'https://www.linkedin.com/feed/update/urn:li:activity:7455981449754693632/' }
  ]
};

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
});

function clean(value) {
  if (Array.isArray(value)) return value.slice(0, 12).map(clean);
  if (value && typeof value === 'object') {
    const out = {};
    Object.keys(value).slice(0, 60).forEach((key) => { out[key] = clean(value[key]); });
    return out;
  }
  return typeof value === 'string' ? value.trim().slice(0, 1200) : value;
}

export default async (request) => {
  const store = getStore({ name: 'ifq-content', consistency: 'strong' });
  const saved = await store.get('website', { type: 'json' });
  if (request.method === 'GET') return json(saved || DEFAULT_CONTENT);
  if (request.method !== 'PUT') return json({ error: 'Method not allowed' }, 405);

  const pass = Netlify.env.get('ADMIN_PASS');
  if (!pass) return json({ error: 'ADMIN_PASS is not configured' }, 503);
  if (request.headers.get('x-admin-key') !== pass) return json({ error: 'Unauthorized' }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
  const content = clean(body.content || body);
  content.updatedAt = new Date().toISOString();
  await store.setJSON('website', content);
  return json({ ok: true, content });
};

export const config = { path: '/api/content' };
