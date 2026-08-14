// Headless Chrome CDP probe using Node's built-in global WebSocket.
// Reads computed grid-template-columns (.process-timeline, .projects-grid,
// .projects-intro, .technologies-grid) and scrollWidth/clientWidth at 6 viewports × 2 locales × 2 themes.

import { spawn } from 'node:child_process';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9223;
const BASE = 'http://localhost:3000';
const LOCALES = [
  { path: '/en', expectDir: 'ltr' },
  { path: '/ar', expectDir: 'rtl' },
];
const VIEWPORTS = [
  { w: 375, label: '375' },
  { w: 390, label: '390' },
  { w: 430, label: '430' },
  { w: 768, label: '768' },
  { w: 1024, label: '1024' },
  { w: 1440, label: '1440' },
];
const THEMES = ['light', 'dark'];
const SELECTORS = ['.process-timeline', '.projects-grid', '.projects-intro', '.technologies-grid'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function launch() {
  const userDir = `D:\\Job\\ceo_bussiness\\.cdp-profile`;
  const proc = spawn(CHROME, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${userDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--hide-scrollbars',
  ], { stdio: 'ignore', windowsHide: true });
  return proc;
}

async function waitForEndpoint() {
  for (let i = 0; i < 80; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (r.ok) return await r.json();
    } catch {}
    await sleep(200);
  }
  throw new Error('chrome endpoint never came up');
}

function makeCdp(ws) {
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id) {
      const p = pending.get(msg.id);
      if (p) { pending.delete(msg.id); p.resolve(msg); }
    }
  });
  return {
    send(method, params = {}) {
      const i = ++id;
      return new Promise((resolve, reject) => {
        pending.set(i, { resolve, reject });
        ws.send(JSON.stringify({ id: i, method, params }));
      });
    },
  };
}

async function evalJs(cdp, expression) {
  const r = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (r.result?.exceptionDetails) return { __error: JSON.stringify(r.result.exceptionDetails).slice(0, 160) };
  return r.result?.value;
}

async function main() {
  const proc = launch();
  try {
    await waitForEndpoint();
    // create a fresh tab to BASE/en
    const tab = await (await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(BASE + '/en')}`)).json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.addEventListener('open', res, { once: true }); ws.addEventListener('error', rej, { once: true }); });
    const cdp = makeCdp(ws);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    const measure = async (path, vw, theme) => {
      // set viewport
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: vw, height: 760, mobile: true, deviceScaleFactor: 1,
        screenOrientation: { type: 'portraitPrimary' },
      });
      // pre-set theme in localStorage by navigating once, setting, then real navigation
      await cdp.send('Page.navigate', { url: `${BASE}${path}` });
      await sleep(1200);
      await evalJs(cdp, `try{localStorage.setItem('theme',${JSON.stringify(theme)});}catch(e){}`);
      await cdp.send('Page.navigate', { url: `${BASE}${path}` });
      await sleep(2600);

      return await evalJs(cdp, `(() => {
        const root = document.documentElement;
        const sel = ${JSON.stringify(SELECTORS)};
        const out = {};
        for (const s of sel) { const el=document.querySelector(s); out[s]=el?getComputedStyle(el).gridTemplateColumns:'NOT_FOUND'; }
        out.sw=root.scrollWidth; out.cw=root.clientWidth;
        out.bsw=document.body.scrollWidth;
        out.dir=root.getAttribute('dir'); out.lang=root.getAttribute('lang');
        out.theme=root.getAttribute('data-theme')||root.className||'(none)';
        out.ptCard=document.querySelector('.process-timeline')?.firstElementChild?.getBoundingClientRect().width||0;
        out.pgCard=document.querySelector('.projects-grid')?.firstElementChild?.getBoundingClientRect().width||0;
        out.tgCard=document.querySelector('.technologies-grid')?.firstElementChild?.getBoundingClientRect().width||0;
        return out;
      })()`);
    };

    console.log('=== CDP RESULTS (process | projects | intro | technologies | card widths | overflow) ===');
    const rows = [];
    for (const { path, expectDir } of LOCALES) {
      for (const vp of VIEWPORTS) {
        for (const theme of THEMES) {
          const r = await measure(path, vp.w, theme);
          if (!r || r.__error) {
            console.log(`${path} ${vp.label}w ${theme}: ERROR ${r && r.__error}`);
            continue;
          }
          const overflow = r.sw > r.cw + 1 ? `OVERFLOW(sw=${r.sw}>cw=${r.cw})` : 'no-overflow';
          const dirOk = r.dir === expectDir ? '' : ` DIR-MISMATCH(got ${r.dir})`;
          const row = `${path} ${vp.label}w ${theme} dir=${r.dir} theme=${r.theme} | process=[${r['.process-timeline']}] projects=[${r['.projects-grid']}] intro=[${r['.projects-intro']}] tech=[${r['.technologies-grid']}] ptCard=${Math.round(r.ptCard)} pgCard=${Math.round(r.pgCard)} tgCard=${Math.round(r.tgCard)} ${overflow}${dirOk}`;
          rows.push(row);
          console.log(row);
        }
      }
    }
    ws.close();
    try { await fetch(`http://127.0.0.1:${PORT}/json/close/${tab.id}`); } catch {}
  } finally {
    proc.kill();
  }
}

main().catch((e) => { console.error('FAIL', e?.stack || e); process.exit(1); });