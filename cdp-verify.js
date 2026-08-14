const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// Configuration
const BASE_URL = 'http://localhost:3000';
const LOCALES = ['en', 'ar'];
const THEMES = ['dark', 'light'];
const VIEWPORTS = [
  { name: 'mobile-375', width: 375, height: 667 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-430', width: 430, height: 932 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'tablet-1024', width: 1024, height: 768 },
  { name: 'desktop-1440', width: 1440, height: 900 },
];

const PROFILE_BASE = path.join(__dirname, '.cdp-profiles');

// Ensure profile directories exist
if (!fs.existsSync(PROFILE_BASE)) {
  fs.mkdirSync(PROFILE_BASE, { recursive: true });
}

// Start Chrome with CDP
async function startChrome() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--remote-debugging-port=9222',
    `--user-data-dir=${PROFILE_BASE}`,
    '--remote-allow-origins=*'
  ];

  console.log('Starting Chrome with CDP...');
  const { spawn } = require('child_process');
  const child = spawn(chromePath, args, {
    detached: true,
    stdio: 'ignore'
  });
  child.unref();

  // Wait for Chrome to start
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Get the websocket debugger URL
  const response = await fetch('http://localhost:9222/json/version');
  const data = await response.json();
  return data.webSocketDebuggerUrl;
}

async function sendCDPCommand(ws, method, params = {}) {
  const id = Date.now() + Math.random();
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('CDP timeout')), 15000);
    const handler = (data) => {
      const msg = JSON.parse(data);
      if (msg.id === id) {
        clearTimeout(timeout);
        ws.off('message', handler);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    };
    ws.on('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function runVerification(browserWsUrl, viewport, locale, theme) {
  const ws = new WebSocket(browserWsUrl);

  await new Promise((resolve, reject) => {
    ws.on('open', resolve);
    ws.on('error', reject);
    setTimeout(() => reject(new Error('WS connection timeout')), 5000);
  });

  try {
    // Create target
    const target = await sendCDPCommand(ws, 'Target.createTarget', {
      url: `${BASE_URL}/${locale}`,
      width: viewport.width,
      height: viewport.height
    });

    // Connect to target
    const targetWs = new WebSocket(`ws://localhost:9222/devtools/page/${target.targetId}`);
    await new Promise((resolve, reject) => {
      targetWs.on('open', resolve);
      targetWs.on('error', reject);
      setTimeout(() => reject(new Error('Target WS timeout')), 5000);
    });

    // Enable domains
    await sendCDPCommand(targetWs, 'Page.enable');
    await sendCDPCommand(targetWs, 'Runtime.enable');
    await sendCDPCommand(targetWs, 'CSS.enable');
    await sendCDPCommand(targetWs, 'Log.enable');
    await sendCDPCommand(targetWs, 'Network.enable');

    // Set viewport
    await sendCDPCommand(targetWs, 'Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.width < 768
    });

    // Set theme via CSS media query override
    await sendCDPCommand(targetWs, 'Emulation.setCSSMediaType', { mediaType: theme });

    // Reload to apply theme
    await sendCDPCommand(targetWs, 'Page.reload');

    // Wait for load
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Collect console errors
    const logs = [];
    const logHandler = (data) => {
      const msg = JSON.parse(data);
      if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
        logs.push(msg.params.entry.text);
      }
    };
    targetWs.on('message', logHandler);

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check for console errors
    const hasErrors = logs.length > 0;

    // Check document dir attribute
    const docResult = await sendCDPCommand(targetWs, 'Runtime.evaluate', {
      expression: `document.documentElement.getAttribute('dir')`,
      returnByValue: true
    });
    const dir = docResult?.result?.value;

    // Check Technologies section exists
    const techResult = await sendCDPCommand(targetWs, 'Runtime.evaluate', {
      expression: `document.querySelector('.technologies-section') !== null`,
      returnByValue: true
    });
    const hasTechSection = techResult?.result?.value;

    // Check tech categories count
    const catResult = await sendCDPCommand(targetWs, 'Runtime.evaluate', {
      expression: `document.querySelectorAll('.tech-category').length`,
      returnByValue: true
    });
    const categoryCount = catResult?.result?.value;

    // Check tech items count
    const itemsResult = await sendCDPCommand(targetWs, 'Runtime.evaluate', {
      expression: `document.querySelectorAll('.tech-item').length`,
      returnByValue: true
    });
    const itemsCount = itemsResult?.result?.value;

    // Check for horizontal overflow
    const overflowResult = await sendCDPCommand(targetWs, 'Runtime.evaluate', {
      expression: `document.documentElement.scrollWidth > document.documentElement.clientWidth`,
      returnByValue: true
    });
    const hasHorizontalOverflow = overflowResult?.result?.value;

    // Check grid columns for technologies-grid
    const gridResult = await sendCDPCommand(targetWs, 'Runtime.evaluate', {
      expression: `getComputedStyle(document.querySelector('.technologies-grid')).gridTemplateColumns`,
      returnByValue: true
    });
    const gridColumns = gridResult?.result?.value;

    // Check intro grid columns
    const introResult = await sendCDPCommand(targetWs, 'Runtime.evaluate', {
      expression: `getComputedStyle(document.querySelector('.technologies-intro')).gridTemplateColumns`,
      returnByValue: true
    });
    const introColumns = introResult?.result?.value;

    // Check theme background
    const themeResult = await sendCDPCommand(targetWs, 'Runtime.evaluate', {
      expression: `getComputedStyle(document.querySelector('.technologies-section')).backgroundColor`,
      returnByValue: true
    });
    const bgColor = themeResult?.result?.value;

    // Check if categories have correct icons
    const iconsResult = await sendCDPCommand(targetWs, 'Runtime.evaluate', {
      expression: `
        Array.from(document.querySelectorAll('.tech-category-icon svg')).map(el => el.outerHTML.includes('lucide'))
      `,
      returnByValue: true
    });
    const hasLucideIcons = iconsResult?.result?.value;

    targetWs.close();

    // RTL check for Arabic
    const expectedDir = locale === 'ar' ? 'rtl' : 'ltr';
    const dirCorrect = dir === expectedDir;

    // Grid column expectations based on viewport
    let expectedGridCols = '1'; // mobile default
    if (viewport.name.startsWith('tablet')) expectedGridCols = '3';
    if (viewport.name.startsWith('desktop')) expectedGridCols = '7';

    const gridCorrect = gridColumns && gridColumns.split(' ').length >= parseInt(expectedGridCols);

    return {
      viewport: viewport.name,
      locale,
      theme,
      dir,
      dirCorrect,
      hasTechSection,
      categoryCount,
      itemsCount,
      hasHorizontalOverflow,
      gridColumns,
      gridCorrect,
      introColumns,
      bgColor,
      hasLucideIcons,
      consoleErrors: logs,
      passed: hasTechSection &&
              categoryCount === 7 &&
              itemsCount === 42 &&
              !hasHorizontalOverflow &&
              dirCorrect &&
              gridCorrect &&
              !hasErrors
    };

  } catch (error) {
    return {
      viewport: viewport.name,
      locale,
      theme,
      error: error.message,
      passed: false
    };
  } finally {
    ws.close();
  }
}

async function main() {
  console.log('Starting CDP verification across all combinations...\n');

  // Start Chrome and get browser WebSocket URL
  const browserWsUrl = await startChrome();
  console.log('Chrome started, debugger URL:', browserWsUrl);

  const results = [];

  for (const viewport of VIEWPORTS) {
    for (const locale of LOCALES) {
      for (const theme of THEMES) {
        const combo = `${viewport.name}/${locale}/${theme}`;
        console.log(`Testing: ${combo}...`);

        const result = await runVerification(browserWsUrl, viewport, locale, theme);
        results.push(result);

        const status = result.passed ? '✅ PASS' : '❌ FAIL';
        console.log(`  ${status}`);
        if (!result.passed) {
          console.log(`  Details:`, JSON.stringify(result, null, 2));
        }
      }
    }
  }

  // Summary
  console.log('\n═══════════════════════════════════════════');
  console.log('VERIFICATION SUMMARY');
  console.log('═══════════════════════════════════════════');

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}\n`);

  // Group by viewport
  for (const viewport of VIEWPORTS) {
    const viewportResults = results.filter(r => r.viewport === viewport.name);
    const vpPassed = viewportResults.filter(r => r.passed).length;
    console.log(`${viewport.name}: ${vpPassed}/${viewportResults.length} passed`);
  }

  // Save detailed results
  fs.writeFileSync(
    path.join(__dirname, 'cdp-results.json'),
    JSON.stringify(results, null, 2)
  );

  console.log('\nDetailed results saved to cdp-results.json');

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});