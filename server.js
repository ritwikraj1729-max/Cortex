// Cortex — local persistence server
// Serves the built app from ./dist and syncs app state to cortex-data.json
// Run: node server.js  (or double-click start.bat)

import http from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3007;
const DATA_FILE = path.join(__dirname, 'cortex-data.json');
const DIST = path.join(__dirname, 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // ---------- Data API ----------
  if (url.pathname === '/api/data') {
    if (req.method === 'GET') {
      try {
        const raw = await readFile(DATA_FILE, 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(raw);
      } catch {
        // No save file yet — client falls back to bundled sample data
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end('null');
      }
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', async () => {
        try {
          JSON.parse(body); // validate before touching disk
          await writeFile(DATA_FILE, body, 'utf8');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end('{"ok":true}');
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end('{"ok":false}');
        }
      });
      return;
    }
  }

  // ---------- Static files ----------
  let filePath = path.join(DIST, url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname));
  if (!filePath.startsWith(DIST)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  if (!existsSync(filePath)) filePath = path.join(DIST, 'index.html');

  try {
    const data = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cortex — build required</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;800&family=Sora:wght@600;800&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    padding: 32px;
    background: radial-gradient(circle at 85% -10%, rgba(99,102,241,.18), transparent 45%), #090a0f;
    color: #e5e7eb; font-family: 'Manrope', system-ui, sans-serif;
  }
  .card {
    width: 100%; max-width: 620px; padding: 40px;
    border: 1px solid rgba(255,255,255,.08); border-radius: 26px;
    background: linear-gradient(180deg, rgba(23,26,40,.95), rgba(13,15,24,.95));
    box-shadow: 0 30px 90px rgba(0,0,0,.55);
  }
  .mark {
    display: inline-flex; align-items: center; justify-content: center;
    width: 52px; height: 52px; border-radius: 16px;
    background: linear-gradient(150deg, #6366f1, #a855f7);
    box-shadow: 0 12px 30px rgba(99,102,241,.4);
    font-family: 'Sora', sans-serif; font-weight: 800; font-size: 26px; color: #fff;
  }
  h1 { font-family: 'Sora', sans-serif; font-size: 27px; margin: 22px 0 10px; letter-spacing: -.02em; }
  p.lead { color: #94a3b8; line-height: 1.65; margin: 0 0 8px; font-size: 15px; }
  .path {
    display: block; margin: 18px 0 26px; padding: 14px 16px;
    border: 1px solid rgba(255,255,255,.08); border-radius: 14px;
    background: rgba(0,0,0,.35); color: #a5b4fc;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13.5px;
    overflow-x: auto; white-space: pre;
  }
  .cmd { color: #6ee7b7; }
  h2 {
    font-family: 'Sora', sans-serif; font-size: 12px; text-transform: uppercase;
    letter-spacing: .18em; color: #64748b; margin: 26px 0 12px;
  }
  ol { margin: 0; padding-left: 20px; color: #cbd5e1; line-height: 1.85; font-size: 14.5px; }
  ol b { color: #fff; }
  code {
    padding: 2px 7px; border-radius: 6px; background: rgba(99,102,241,.14);
    color: #a5b4fc; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px;
  }
  .tip {
    margin-top: 26px; padding: 16px 18px; border-radius: 14px;
    border: 1px solid rgba(99,102,241,.22); background: rgba(99,102,241,.08);
    color: #c7d2fe; font-size: 13.5px; line-height: 1.65;
  }
  .tip b { color: #fff; }
</style>
</head>
<body>
  <div class="card">
    <div class="mark">C</div>
    <h1>Cortex isn&rsquo;t built yet</h1>
    <p class="lead">The server is running correctly &mdash; it just has no compiled app to serve. The <b>dist</b> folder is generated by a build step, so it isn&rsquo;t included when the project is downloaded or zipped.</p>

    <span class="path"><span class="cmd">npm run build</span>
<span style="color:#64748b"># or, to install dependencies first:</span>
<span class="cmd">npm install</span> &amp;&amp; <span class="cmd">npm run build</span></span>

    <h2>Three ways to fix it</h2>
    <ol>
      <li><b>Easiest:</b> double-click <code>start.bat</code> &mdash; it installs dependencies, builds the app and opens Cortex for you.</li>
      <li><b>Automatic:</b> run <code>npm run build</code> in this folder, then refresh this page.</li>
      <li><b>Full setup:</b> run <code>npm install</code> first if the build says it can&rsquo;t find <code>vite</code> &mdash; that just means dependencies aren&rsquo;t downloaded yet.</li>
    </ol>

    <div class="tip">
      <b>Good to know.</b> After the build succeeds, Cortex is served from <b>dist/index.html</b> at
      <b>http://localhost:3007</b>, and your data is stored in <b>cortex-data.json</b> next to <code>server.js</code>.
      If you edit any files under <code>src/</code>, re-run the build to see the changes.
    </div>
  </div>
</body>
</html>`);
  }
});

server.listen(PORT, () => {
  console.log('');
  console.log('  ◆ Cortex is running');
  console.log('  → Open:  http://localhost:%d', PORT);
  console.log('  → Data:  %s', DATA_FILE);
  console.log('');
  console.log('  Press Ctrl+C to stop.');
});
