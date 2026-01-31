// Netlify Function: get-scores.js
// Returns recent submissions from the Google Apps Script Web App (GOOGLE_SCRIPT_URL).
// Small in-memory cache to limit Apps Script requests.

const CACHE_TTL = 3000; // milliseconds
let cache = { ts: 0, data: null };

exports.handler = async function (event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const now = Date.now();
    if (cache.data && (now - cache.ts) < CACHE_TTL) {
      return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cache.data) };
    }

    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
    if (!GOOGLE_SCRIPT_URL) {
      return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Missing GOOGLE_SCRIPT_URL' }) };
    }

    // Request latest rows. The Apps Script should accept action=getLatest and optional limit.
    const url = `${GOOGLE_SCRIPT_URL}?action=getLatest&limit=200`;
    const res = await fetch(url);
    if (!res.ok) {
      const txt = await res.text().catch(()=> '');
      throw new Error(`Apps Script returned ${res.status} ${txt}`);
    }
    const json = await res.json();

    cache = { ts: Date.now(), data: json };

    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(json) };
  } catch (err) {
    console.error('get-scores error:', err);
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: err.message }) };
  }
};
