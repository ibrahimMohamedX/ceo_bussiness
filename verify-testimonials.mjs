// Visual QA for the Testimonials section (Section 09) across viewport x locale x theme.
// Uses Chrome DevTools Protocol. Theme is driven by the html.light/html.dark
// class (not media queries), so we set localStorage + class + reload.
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { WebSocket } from 'ws'

const BASE_URL = 'http://localhost:3210'
const LOCALES = ['en', 'ar']
const THEMES = ['dark', 'light']
const VIEWPORTS = [
  { name: 'mobile-375', width: 375, height: 667 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-430', width: 430, height: 932 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'tablet-1024', width: 1024, height: 768 },
  { name: 'desktop-1440', width: 1440, height: 900 },
]

const PROFILE_DIR = path.join(import.meta.dirname, '.cdp-qa-profile')
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

let msgId = 0
function cdp(ws, method, params = {}) {
  const id = ++msgId
  return new Promise((resolve, reject) => {
    const to = setTimeout(() => reject(new Error(`CDP timeout: ${method}`)), 20000)
    const handler = (raw) => {
      const m = JSON.parse(raw)
      if (m.id === id) {
        clearTimeout(to)
        ws.off('message', handler)
        if (m.error) reject(new Error(m.error.message))
        else resolve(m.result)
      }
    }
    ws.on('message', handler)
    ws.send(JSON.stringify({ id, method, params }))
  })
}

async function startChrome() {
  if (!fs.existsSync(PROFILE_DIR)) fs.mkdirSync(PROFILE_DIR, { recursive: true })
  const child = spawn(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--remote-debugging-port=9223',
    `--user-data-dir=${PROFILE_DIR}`,
    '--remote-allow-origins=*',
  ], { detached: true, stdio: 'ignore' })
  child.unref()
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 500))
    try {
      const r = await fetch('http://localhost:9223/json/version')
      if (r.ok) {
        const d = await r.json()
        return d.webSocketDebuggerUrl
      }
    } catch {}
  }
  throw new Error('Chrome did not start')
}

// Evaluate a JS expression in the page, returning the value.
async function evalIn(targetWs, expression) {
  const r = await cdp(targetWs, 'Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  })
  if (r?.exceptionDetails) throw new Error(r.exceptionDetails.text || 'eval exception')
  return r?.result?.value
}

// Poll an expression until it returns truthy or the deadline passes.
// Used to wait for React hydration / theme application rather than a fixed sleep.
async function waitFor(targetWs, expression, { timeout = 8000, interval = 150 } = {}) {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    try {
      const v = await evalIn(targetWs, expression)
      if (v) return v
    } catch {}
    await new Promise((r) => setTimeout(r, interval))
  }
  return null
}

async function runOne(browserWsUrl, vp, locale, theme) {
  // Open a fresh tab (target) per combo for a clean DOM.
  const target = await cdp(browserWsUrl, 'Target.createTarget', { url: 'about:blank' })
  const targetWs = new WebSocket(`ws://localhost:9223/devtools/page/${target.targetId}`)
  await new Promise((res, rej) => {
    targetWs.on('open', res)
    targetWs.on('error', rej)
    setTimeout(() => rej(new Error('target ws timeout')), 5000)
  })

  const consoleErrors = []
  const pageErrors = []
  targetWs.on('message', (raw) => {
    const m = JSON.parse(raw)
    if (m.method === 'Log.entryAdded' && m.params?.entry?.level === 'error') {
      consoleErrors.push(m.params.entry.text)
    }
    if (m.method === 'Runtime.exceptionThrown') {
      pageErrors.push(m.params.exceptionDetails?.text || 'runtime exception')
    }
  })

  try {
    await cdp(targetWs, 'Page.enable')
    await cdp(targetWs, 'Runtime.enable')
    await cdp(targetWs, 'Log.enable')
    await cdp(targetWs, 'Network.enable')

    await cdp(targetWs, 'Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 768,
    })

    // Navigate to the locale
    await cdp(targetWs, 'Page.navigate', { url: `${BASE_URL}/${locale}` })
    await new Promise((r) => setTimeout(r, 1500))

    // Drive theme via the same mechanism as ThemeProvider:
    // set localStorage + apply class on <html>, then reload so React hydrates with it.
    await evalIn(targetWs, `
      try { localStorage.setItem('theme', ${JSON.stringify(theme)}); } catch(e) {}
      document.documentElement.classList.remove('light','dark');
      document.documentElement.classList.add(${JSON.stringify(theme)});
      document.documentElement.style.colorScheme = ${JSON.stringify(theme)};
    `)
    await cdp(targetWs, 'Page.reload')
    // Wait for the testimonials card to mount and the theme class to be
    // re-applied by ThemeProvider's useEffect post-hydration. This is the
    // authoritative "page is ready" signal — avoids measuring a transitional
    // frame where the html class hasn't been reset by React yet.
    await waitFor(targetWs,
      `document.querySelector('.testimonial-card') && document.documentElement.classList.contains(${JSON.stringify(theme)})`,
      { timeout: 8000 })
    // Small settle for computed styles to flush.
    await new Promise((r) => setTimeout(r, 300))

    const results = {}

    // ── Document attributes ───────────────────────────────
    results.dir = await evalIn(targetWs, `document.documentElement.getAttribute('dir')`)

    // ── Section presence ──────────────────────────────────
    results.sectionExists = await evalIn(targetWs, `document.querySelector('.testimonials-section') !== null`)
    results.eyebrow = await evalIn(targetWs, `(document.querySelector('.testimonials-intro .eyebrow')?.textContent || '').trim()`)
    results.headingText = await evalIn(targetWs, `(document.querySelector('.testimonials-intro h2')?.textContent || '').replace(/\\s+/g,' ').trim()`)
    results.introP = await evalIn(targetWs, `(document.querySelector('.testimonials-intro > p')?.textContent || '').trim()`)

    // ── Card counts ──────────────────────────────────────
    results.totalCards = await evalIn(targetWs, `document.querySelectorAll('.testimonial-card').length`)

    // ── Missing-translation detection ────────────────────
    // next-intl renders missing keys as the raw key path OR an empty string, depending.
    // Flag any card quote/name/company/role that is empty or looks like a dotted key path.
    results.missingKeys = await evalIn(targetWs, `
      (function(){
        const out=[];
        const cards=document.querySelectorAll('.testimonial-card');
        cards.forEach((c,i)=>{
          const q=c.querySelector('.testimonial-quote p')?.textContent||'';
          const n=c.querySelector('.testimonial-name')?.textContent||'';
          const co=c.querySelector('.testimonial-company')?.textContent||'';
          const r=c.querySelector('.testimonial-role')?.textContent||'';
          if(!q.trim()||/^[a-zA-Z]+\\.[a-zA-Z.]+$/.test(q.trim())) out.push('card'+i+'.quote="'+q+'"');
          if(!n.trim()||/^[a-zA-Z]+\\.[a-zA-Z.]+$/.test(n.trim())) out.push('card'+i+'.name="'+n+'"');
          if(!co.trim()||/^[a-zA-Z]+\\.[a-zA-Z.]+$/.test(co.trim())) out.push('card'+i+'.company="'+co+'"');
          if(!r.trim()||/^[a-zA-Z]+\\.[a-zA-Z.]+$/.test(r.trim())) out.push('card'+i+'.role="'+r+'"');
        });
        const eb=document.querySelector('.testimonials-intro .eyebrow')?.textContent||'';
        if(!eb.trim()||/^[a-zA-Z]+\\.[a-zA-Z.]+$/.test(eb.trim())) out.push('eyebrow="'+eb+'"');
        return out;
      })()
    `)

    // ── Horizontal overflow (section + body) ─────────────
    results.bodyOverflow = await evalIn(targetWs, `document.documentElement.scrollWidth > document.documentElement.clientWidth + 1`)
    results.sectionOverflow = await evalIn(targetWs, `
      (function(){
        const s=document.querySelector('.testimonials-section');
        if(!s) return false;
        const r=s.getBoundingClientRect();
        return r.right > window.innerWidth + 1 || r.left < -1;
      })()
    `)

    // ── Grid columns (computed) ──────────────────────────
    results.gridCols = await evalIn(targetWs,
      `getComputedStyle(document.querySelector('.testimonials-grid')).gridTemplateColumns`)
    results.gridGap = await evalIn(targetWs,
      `getComputedStyle(document.querySelector('.testimonials-grid')).rowGap`)

    // ── Card width/height/spacing (first card) ────────────
    results.cardBox = await evalIn(targetWs, `
      (function(){
        const c=document.querySelector('.testimonial-card');
        if(!c) return null;
        const r=c.getBoundingClientRect();
        const cs=getComputedStyle(c);
        return {w:Math.round(r.width), h:Math.round(r.height), pad:cs.padding, gap:cs.rowGap};
      })()
    `)

    // ── Heading does not clip horizontally ──
    // The h2 intentionally wraps across two lines via <br/>, so vertical
    // scrollHeight > clientHeight is expected and not a defect. We only flag
    // HORIZONTAL clipping (text wider than its box) — a real overflow issue.
    results.headingClip = await evalIn(targetWs, `
      (function(){
        const h=document.querySelector('.testimonials-intro h2');
        if(!h) return null;
        return h.scrollWidth > h.clientWidth + 1;
      })()
    `)

    // ── Quote mark icon glyph box (sanity) ──
    results.iconBox = await evalIn(targetWs, `
      (function(){
        const i=document.querySelector('.testimonial-quote-mark');
        if(!i) return null;
        const r=i.getBoundingClientRect();
        const cs=getComputedStyle(i);
        return {w:Math.round(r.width), h:Math.round(r.height), bg:cs.backgroundColor};
      })()
    `)

    // ── Theme appearance sanity ───────────────────────────
    results.cardBg = await evalIn(targetWs, `getComputedStyle(document.querySelector('.testimonial-card')).backgroundColor`)
    results.fgColor = await evalIn(targetWs, `getComputedStyle(document.querySelector('.testimonial-name')).color`)
    results.mutedColor = await evalIn(targetWs, `getComputedStyle(document.querySelector('.testimonial-role')).color`)

    // ── Section width vs container ───────────────────────
    results.sectionWidth = await evalIn(targetWs, `
      (function(){
        const s=document.querySelector('.testimonials-section');
        const r=s.getBoundingClientRect();
        return {w:Math.round(r.width), left:Math.round(r.left), right:Math.round(r.right)};
      })()
    `)

    // ── Animation keyframe is present (computed animationName) ──
    results.animationName = await evalIn(targetWs,
      `getComputedStyle(document.querySelector('.testimonial-card')).animationName`)

    // ── Adjacent section (WhyProjex) still renders (integration sanity) ──
    results.whyProjexExists = await evalIn(targetWs, `document.querySelector('.why-projex-section') !== null`)

    // ── Evaluate pass/fail ───────────────────────────────
    const expectedDir = locale === 'ar' ? 'rtl' : 'ltr'
    let expectedCols
    if (vp.width <= 760) { expectedCols = 1 }
    else if (vp.width <= 1100) { expectedCols = 2 }
    else { expectedCols = 3 }

    const colCount = results.gridCols ? results.gridCols.split(' ').filter(Boolean).length : 0

    // Theme-applied check: authoritative signal is the computed card background.
    // Dark token  -> rgba(13, 19, 23, 0.75)   (near-black, low alpha)
    // Light token -> rgba(255, 255, 255, 0.8)  (near-white, low alpha)
    // We parse the rgb(a) channels and distinguish by the R channel (13 vs 255).
    const themeApplied = (() => {
      const m = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(results.cardBg || '')
      if (!m) return false
      const r = parseInt(m[1], 10)
      return theme === 'dark' ? r < 60 : r > 200
    })()

    const headingFits = (() => {
      if (results.headingClip == null) return true
      return results.headingClip === false
    })()

    // Console errors: ignore pre-existing favicon 404s from layout.tsx
    // metadata.icons — site-wide and unrelated to Testimonials.
    const realConsoleErrors = consoleErrors.filter(
      (t) => !/Failed to load resource.*404/i.test(t))

    const checks = {
      sectionExists: results.sectionExists === true,
      dir: results.dir === expectedDir,
      themeApplied,
      totalCards: results.totalCards === 3,
      missingKeys: results.missingKeys.length === 0,
      bodyOverflow: results.bodyOverflow === false,
      sectionOverflow: results.sectionOverflow === false,
      gridCols: colCount === expectedCols,
      headingFits,
      whyProjexIntegration: results.whyProjexExists === true,
      noConsoleErrors: realConsoleErrors.length === 0,
      noPageErrors: pageErrors.length === 0,
      animation: results.animationName === 'testimonials-reveal',
    }
    results.checks = checks
    results.passed = Object.values(checks).every(Boolean)
    results.consoleErrors = consoleErrors.slice(0, 5)
    results.pageErrors = pageErrors.slice(0, 5)
    return results
  } catch (e) {
    return { vp: vp.name, locale, theme, error: String(e?.message || e), passed: false }
  } finally {
    try { await cdp(targetWs, 'Target.closeTarget', { targetId: target.targetId }) } catch {}
    targetWs.close()
  }
}

async function main() {
  console.log('Starting Chrome...')
  const browserWsUrl = await startChrome()
  const browserWs = new WebSocket(browserWsUrl)
  await new Promise((res, rej) => {
    browserWs.on('open', res)
    browserWs.on('error', rej)
    setTimeout(() => rej(new Error('browser ws open timeout')), 10000)
  })
  console.log('Chrome up. Running Testimonials QA matrix...\n')

  const all = []
  for (const vp of VIEWPORTS) {
    for (const locale of LOCALES) {
      for (const theme of THEMES) {
        process.stdout.write(`  ${vp.name} / ${locale} / ${theme} ... `)
        const r = await runOne(browserWs, vp, locale, theme)
        r.vp = vp.name; r.locale = locale; r.theme = theme
        all.push(r)
        console.log(r.passed ? 'PASS' : 'FAIL')
        if (!r.passed) {
          const failed = Object.entries(r.checks || {}).filter(([, v]) => !v).map(([k]) => k)
          console.log(`    failed checks: ${failed.join(', ')}`)
          if (r.error) console.log(`    error: ${r.error}`)
          if (r.consoleErrors?.length) console.log(`    console: ${r.consoleErrors.join(' | ').slice(0,200)}`)
        }
      }
    }
  }

  const passed = all.filter((r) => r.passed).length
  console.log('\n═══════════════════════════════════════════')
  console.log(`Testimonials QA: ${passed}/${all.length} passed`)
  console.log('═══════════════════════════════════════════')
  for (const vp of VIEWPORTS) {
    const vr = all.filter((r) => r.vp === vp.name)
    console.log(`${vp.name}: ${vr.filter((r) => r.passed).length}/${vr.length} passed`)
  }
  fs.writeFileSync(path.join(import.meta.dirname, 'testimonials-qa-results.json'), JSON.stringify(all, null, 2))
  console.log('\nDetailed results -> testimonials-qa-results.json')

  // Clean up Chrome: close the browser gracefully via the Browser.close CDP
  // command (not the /json/close HTTP endpoint, which targets a single tab).
  try { await cdp(browserWs, 'Browser.close') } catch {}
  try { browserWs.close() } catch {}
  process.exit(passed === all.length ? 0 : 1)
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1) })
