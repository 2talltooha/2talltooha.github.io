// Generates the signal shapes drawn on the site. They are synthetic, not recordings.
//
//   node tools/make-trace.mjs
//
// Prints three SVG path strings. Paste them into index.html if you change the numbers:
//   HERO   -> <path id="trace-path" d="...">      (hero figure)
//   BURST  -> <path id="burst-path" d="...">      (section dividers)
// The same HERO path is reused in tools/og-image.html.

const round = (n) => Number(n.toFixed(1));

/* ---------- Hero: a breathing trace with one pause ---------- */
const W = 1200;            // viewBox width
const SECONDS = 60;        // time shown
const PX_PER_S = W / SECONDS;
const PERIOD = 4;          // seconds per breath = 15 breaths per minute
const BASE = 96;           // y at the end of an exhale (the trough)
const HEIGHT = 52;         // height of a normal breath in viewBox units
const INHALE = 0.42;       // share of each breath spent inhaling
const HANDLE = 0.3642;     // Bezier handle length that makes a half-wave look like a sine
const PAUSE = [32, 44];    // seconds: breathing stops at the end of an exhale

// Height of each breath relative to normal. Small variation before the pause,
// deeper recovery breaths after it.
const before = [1.0, 0.96, 1.04, 0.98, 1.03, 0.95, 1.0, 0.97];
const after = [1.6, 1.3, 1.12, 1.0];

function heroPath() {
  const parts = [`M0 ${BASE}`];
  const breath = (t0, scale) => {
    const x0 = t0 * PX_PER_S;
    const xp = (t0 + PERIOD * INHALE) * PX_PER_S;
    const x1 = (t0 + PERIOD) * PX_PER_S;
    const yp = BASE - HEIGHT * scale;
    const wi = xp - x0;
    const we = x1 - xp;
    parts.push(
      `C${round(x0 + HANDLE * wi)} ${BASE} ${round(xp - HANDLE * wi)} ${round(yp)} ${round(xp)} ${round(yp)}`,
      `C${round(xp + HANDLE * we)} ${round(yp)} ${round(x1 - HANDLE * we)} ${BASE} ${round(x1)} ${BASE}`,
    );
  };
  before.forEach((scale, i) => breath(i * PERIOD, scale));
  parts.push(`H${PAUSE[1] * PX_PER_S}`);
  after.forEach((scale, i) => breath(PAUSE[1] + i * PERIOD, scale));
  return parts.join('');
}

/* ---------- Section divider: a short tremor-like burst ---------- */
function burstPath() {
  const mid = 12.5;        // sits on a whole pixel row so it lines up with the CSS rule
  const start = 20;
  const humps = 20;
  const width = 4;
  const parts = [`M0 ${mid}H${start}`];
  for (let i = 0; i < humps; i++) {
    const x0 = start + i * width;
    const xm = x0 + width / 2;
    const envelope = 9 * Math.exp(-(((xm - 60) / 18) ** 2));
    const direction = i % 2 === 0 ? -1 : 1;
    // A quadratic curve peaks at half its control-point offset, hence the factor 2.
    parts.push(`Q${round(xm)} ${round(mid + direction * envelope * 2)} ${round(x0 + width)} ${mid}`);
  }
  parts.push('H120');
  return parts.join('');
}

console.log('HERO   viewBox="0 0 1200 120"');
console.log(heroPath());
console.log('');
console.log(`PAUSE  left ${round((PAUSE[0] / SECONDS) * 100)}%  width ${round(((PAUSE[1] - PAUSE[0]) / SECONDS) * 100)}%  (${PAUSE[1] - PAUSE[0]} s)`);
console.log(`SCALE  10 s = ${round((10 / SECONDS) * 100)}% of the width`);
console.log('');
console.log('BURST  viewBox="0 0 120 24"');
console.log(burstPath());
