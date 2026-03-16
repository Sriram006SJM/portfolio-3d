# Game Launcher Portfolio — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a single `index.html` game launcher–style portfolio with 6 cinematic scroll-locked sections, each with a unique entrance animation.

**Architecture:** Pure HTML/CSS/JS single file hosted on GitHub Pages. A scroll-lock engine intercepts wheel/touch events, locks the page, plays a section exit + entrance animation, then unlocks. Each section has its own entrance function. No build step, no dependencies except Google Fonts and Font Awesome via CDN.

**Tech Stack:** Vanilla HTML5, CSS3 (custom properties, keyframes, grid, flexbox), Vanilla JS (IntersectionObserver-free, manual scroll engine), Google Fonts (Inter), Font Awesome 6 CDN.

---

## Project location

All work happens in one file: `~/Desktop/portfolio-3d/index.html`

The existing Vite/React files in `src/` are left untouched (or can be ignored). We only create/replace `index.html` at the repo root.

Deploy command: `cd ~/Desktop/portfolio-3d && git add index.html && git commit -m "..." && npm run deploy`

The `predeploy`/`deploy` scripts already exist in `package.json` from the previous setup (`gh-pages -d dist`). But since we're now using a plain `index.html` at the root (not a Vite build), we need to deploy differently. Instead of `npm run deploy` (which deploys `dist/`), we push `index.html` directly to the `gh-pages` branch.

**Deployment for this plan:**
```bash
cd ~/Desktop/portfolio-3d
git add index.html
git commit -m "feat: ..."
# Push to gh-pages branch directly:
git checkout gh-pages 2>/dev/null || git checkout --orphan gh-pages
cp index.html /tmp/portfolio-index.html
git rm -rf . --quiet
cp /tmp/portfolio-index.html index.html
git add index.html
git commit -m "deploy: game portfolio"
git push origin gh-pages --force
git checkout main
```

**Simpler deploy (after Task 1 sets this up):** just run `bash ~/Desktop/portfolio-3d/deploy.sh`

---

## Task 1: Repo cleanup + deploy script

**Files:**
- Create: `~/Desktop/portfolio-3d/index.html` (empty scaffold)
- Create: `~/Desktop/portfolio-3d/deploy.sh`

**Step 1: Create deploy.sh**

```bash
#!/bin/bash
set -e
cd ~/Desktop/portfolio-3d
git add index.html
git commit -m "deploy: update game portfolio" || echo "nothing to commit"
git push origin main

# Copy to gh-pages
TMPFILE=$(mktemp)
cp index.html "$TMPFILE"
git checkout gh-pages 2>/dev/null || git checkout --orphan gh-pages
git rm -rf . --quiet 2>/dev/null || true
cp "$TMPFILE" index.html
git add index.html
git commit -m "deploy: game portfolio $(date '+%Y-%m-%d %H:%M')"
git push origin gh-pages --force
git checkout main
echo "Deployed to https://sriram006sjm.github.io/portfolio-3d/"
```

**Step 2: Make it executable**
```bash
chmod +x ~/Desktop/portfolio-3d/deploy.sh
```

**Step 3: Create the initial index.html scaffold**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sriram Ganeshalingam</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>
  <div id="hud-counter">01 / 06</div>
  <div id="scanline-overlay"></div>
  <main id="sections">
    <section id="s0" class="section active">HERO</section>
    <section id="s1" class="section">SKILLS</section>
    <section id="s2" class="section">EXPERIENCE</section>
    <section id="s3" class="section">PROJECTS</section>
    <section id="s4" class="section">EDUCATION</section>
    <section id="s5" class="section">CONTACT</section>
  </main>
</body>
</html>
```

**Step 4: Commit**
```bash
cd ~/Desktop/portfolio-3d
git add index.html deploy.sh
git commit -m "feat: scaffold game portfolio + deploy script"
git push origin main
```

---

## Task 2: Global CSS — theme, layout, HUD, scanlines

**Files:**
- Modify: `~/Desktop/portfolio-3d/index.html` — add `<style>` block in `<head>`

**Add this complete CSS inside `<style>` tags in `<head>` (replace the empty head styles):**

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --teal: #00d4ff;
  --gold: #f0c040;
  --bg: #0a0f1e;
  --bg2: #0d1426;
  --text: #ffffff;
  --muted: #8892b0;
  --border: rgba(0,212,255,0.2);
  --font: 'Inter', sans-serif;
}

html, body {
  height: 100%;
  overflow: hidden;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
}

/* Scanline overlay */
#scanline-overlay {
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0,0,0,0.03) 2px,
    rgba(0,0,0,0.03) 4px
  );
  pointer-events: none;
  z-index: 9999;
}

/* HUD counter */
#hud-counter {
  position: fixed;
  top: 24px;
  right: 32px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--teal);
  z-index: 1000;
  font-family: var(--font);
  opacity: 0.8;
}

/* Section base */
.section {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  opacity: 0;
  pointer-events: none;
  transition: none;
  overflow: hidden;
}
.section.active {
  opacity: 1;
  pointer-events: all;
}

/* Transition flash overlay */
#flash {
  position: fixed;
  inset: 0;
  background: var(--teal);
  opacity: 0;
  pointer-events: none;
  z-index: 500;
}

/* Scroll hint */
#scroll-hint {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  color: var(--muted);
  z-index: 100;
  animation: hint-pulse 2s ease-in-out infinite;
}
@keyframes hint-pulse {
  0%, 100% { opacity: 0.4; transform: translateX(-50%) translateY(0); }
  50% { opacity: 1; transform: translateX(-50%) translateY(-4px); }
}

/* Section title style */
.sec-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--teal);
  margin-bottom: 12px;
  opacity: 0;
}
.sec-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 40px;
  opacity: 0;
}
.sec-title span { color: var(--teal); }

/* Utility */
.gold { color: var(--gold); }
.teal { color: var(--teal); }
.muted { color: var(--muted); }
```

**Step: Verify** — open `index.html` in browser. Should see dark background, "01 / 06" in top right, "HERO" text faintly visible.

**Step: Commit**
```bash
git add index.html && git commit -m "feat: add global CSS theme, HUD, scanlines"
```

---

## Task 3: Scroll-lock engine (JS)

**Files:**
- Modify: `~/Desktop/portfolio-3d/index.html` — add `<script>` before `</body>`

**Add this JS (this is the core engine — everything else plugs into it):**

```js
const TOTAL = 6;
let current = 0;
let locked = false;

// Add flash div
const flash = document.createElement('div');
flash.id = 'flash';
document.body.appendChild(flash);

// Add scroll hint
const hint = document.createElement('div');
hint.id = 'scroll-hint';
hint.innerHTML = '▼ SCROLL';
document.body.appendChild(hint);

function getSection(i) {
  return document.getElementById('s' + i);
}

function updateHUD() {
  document.getElementById('hud-counter').textContent =
    String(current + 1).padStart(2,'0') + ' / ' + String(TOTAL).padStart(2,'0');
}

function flashScreen(cb) {
  flash.style.transition = 'opacity 0.12s ease';
  flash.style.opacity = '0.15';
  setTimeout(() => {
    flash.style.opacity = '0';
    setTimeout(cb, 120);
  }, 120);
}

function goTo(next) {
  if (locked || next < 0 || next >= TOTAL || next === current) return;
  locked = true;

  const prev = current;
  current = next;
  updateHUD();

  // Hide scroll hint on first move
  hint.style.opacity = '0';

  flashScreen(() => {
    // Hide previous
    const prevEl = getSection(prev);
    prevEl.classList.remove('active');
    prevEl.style.opacity = '0';

    // Show next
    const nextEl = getSection(next);
    nextEl.style.opacity = '1';
    nextEl.classList.add('active');

    // Run entrance animation
    runEntrance(next, () => {
      locked = false;
    });
  });
}

// Wheel handler
let wheelAccum = 0;
window.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (locked) return;
  wheelAccum += e.deltaY;
  if (wheelAccum > 60) { wheelAccum = 0; goTo(current + 1); }
  else if (wheelAccum < -60) { wheelAccum = 0; goTo(current - 1); }
}, { passive: false });

// Touch handler
let touchY = 0;
window.addEventListener('touchstart', (e) => { touchY = e.touches[0].clientY; }, { passive: true });
window.addEventListener('touchend', (e) => {
  if (locked) return;
  const dy = touchY - e.changedTouches[0].clientY;
  if (dy > 40) goTo(current + 1);
  else if (dy < -40) goTo(current - 1);
}, { passive: true });

// Keyboard
window.addEventListener('keydown', (e) => {
  if (locked) return;
  if (e.key === 'ArrowDown' || e.key === 'PageDown') goTo(current + 1);
  if (e.key === 'ArrowUp' || e.key === 'PageUp') goTo(current - 1);
});

// Entrance dispatcher — each section implements its own
function runEntrance(idx, done) {
  const fns = [
    entranceHero,
    entranceSkills,
    entranceExperience,
    entranceProjects,
    entranceEducation,
    entranceContact,
  ];
  if (fns[idx]) fns[idx](done);
  else done();
}

// Placeholder stubs — replaced in later tasks
function entranceHero(done) { done(); }
function entranceSkills(done) { done(); }
function entranceExperience(done) { done(); }
function entranceProjects(done) { done(); }
function entranceEducation(done) { done(); }
function entranceContact(done) { done(); }

// Boot: run hero entrance immediately
getSection(0).style.opacity = '1';
getSection(0).classList.add('active');
updateHUD();
setTimeout(() => entranceHero(() => {}), 300);
```

**Step: Verify** — open in browser, scroll down/up, should flash and switch between empty sections with HUD updating.

**Step: Commit**
```bash
git add index.html && git commit -m "feat: add scroll-lock engine with flash transition"
```

---

## Task 4: Hero section — scramble + typewriter + badges + CTAs

**Files:**
- Modify: `~/Desktop/portfolio-3d/index.html`

**Step 1: Replace `<section id="s0">` with:**

```html
<section id="s0" class="section">
  <div class="hero-inner">
    <p class="hero-greeting sec-label">👋 Incoming Player</p>
    <h1 class="hero-name">Sriram Ganeshalingam</h1>
    <p class="hero-sub">
      <span id="hero-typewriter"></span><span class="cursor">█</span>
    </p>
    <div class="hero-badges">
      <span class="badge">MS @ UTD</span>
      <span class="badge">GPA 3.92</span>
      <span class="badge gold-badge">Dean's Excellence Scholar</span>
    </div>
    <div class="hero-ctas">
      <a href="https://www.linkedin.com/in/sriram-ganeshalingam" target="_blank" class="btn btn-primary">
        <i class="fab fa-linkedin"></i> LinkedIn
      </a>
      <a href="mailto:sriram.ganeshalingam@utdallas.edu" class="btn btn-outline">
        <i class="fas fa-envelope"></i> Email
      </a>
      <a href="../portfolio/" class="btn btn-outline">
        <i class="fas fa-user"></i> Full Portfolio
      </a>
    </div>
  </div>
</section>
```

**Step 2: Add Hero CSS:**

```css
/* Hero */
.hero-inner { text-align: center; max-width: 800px; }
.hero-greeting { font-size: 0.8rem; letter-spacing: 0.25em; color: var(--teal); margin-bottom: 16px; }
.hero-name {
  font-size: clamp(2.5rem, 8vw, 5.5rem);
  font-weight: 900;
  letter-spacing: -1px;
  color: var(--text);
  margin-bottom: 20px;
  min-height: 1.2em;
}
.hero-sub {
  font-size: clamp(1rem, 2.5vw, 1.4rem);
  color: var(--muted);
  min-height: 2em;
  margin-bottom: 32px;
}
.cursor {
  display: inline-block;
  color: var(--teal);
  animation: blink 1s step-end infinite;
}
@keyframes blink { 50% { opacity: 0; } }

.hero-badges {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 40px;
}
.badge {
  padding: 6px 16px;
  border: 1px solid var(--border);
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--teal);
  background: rgba(0,212,255,0.07);
  opacity: 0;
  transform: translateY(10px);
}
.gold-badge { color: var(--gold); border-color: rgba(240,192,64,0.3); background: rgba(240,192,64,0.07); }

.hero-ctas { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: var(--font);
  text-decoration: none;
  cursor: pointer;
  opacity: 0;
  transform: translateY(20px);
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-primary {
  background: var(--teal);
  color: #000;
  border: none;
}
.btn-primary:hover { box-shadow: 0 0 20px rgba(0,212,255,0.5); transform: translateY(-2px); }
.btn-outline {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);
}
.btn-outline:hover { border-color: var(--teal); color: var(--teal); }
```

**Step 3: Replace `entranceHero` stub with:**

```js
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const HERO_ROLES = ['Data Analyst', 'ML Engineer', 'BI Specialist', 'Data Scientist'];

function scrambleName(el, finalText, cb) {
  el.innerHTML = finalText.split('').map((ch, i) =>
    ch === ' ' ? ' ' : `<span data-i="${i}">${ch}</span>`
  ).join('');
  const spans = el.querySelectorAll('span');
  let iter = 0;
  const total = finalText.replace(/ /g, '').length * 4;
  const iv = setInterval(() => {
    spans.forEach(s => {
      const fi = parseInt(s.dataset.i);
      const resolved = fi < iter / 4;
      s.textContent = resolved ? finalText[fi] : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    });
    iter++;
    if (iter > total) {
      clearInterval(iv);
      spans.forEach(s => s.textContent = finalText[parseInt(s.dataset.i)]);
      cb();
    }
  }, 28);
}

function typeWriter(el, words, cb) {
  let wi = 0, ci = 0, deleting = false;
  el.textContent = '';
  cb(); // unblock — typewriter runs indefinitely
  function tick() {
    const word = words[wi];
    el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    let delay = deleting ? 60 : 100;
    if (!deleting && ci > word.length) { delay = 1800; deleting = true; }
    if (deleting && ci <= 0) { deleting = false; wi = (wi + 1) % words.length; ci = 0; delay = 300; }
    setTimeout(tick, delay);
  }
  tick();
}

function animateIn(el, delay) {
  setTimeout(() => {
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }, delay);
}

function entranceHero(done) {
  const sec = getSection(0);
  // Reset
  sec.querySelector('.hero-greeting').style.opacity = '0';
  sec.querySelector('.hero-name').style.opacity = '0';
  sec.querySelectorAll('.badge').forEach(b => { b.style.opacity='0'; b.style.transform='translateY(10px)'; });
  sec.querySelectorAll('.btn').forEach(b => { b.style.opacity='0'; b.style.transform='translateY(20px)'; });

  // 1. Greeting fades in
  setTimeout(() => {
    const g = sec.querySelector('.hero-greeting');
    g.style.transition = 'opacity 0.4s';
    g.style.opacity = '1';
  }, 100);

  // 2. Name scrambles in
  setTimeout(() => {
    const nameEl = sec.querySelector('.hero-name');
    nameEl.style.opacity = '1';
    scrambleName(nameEl, 'Sriram Ganeshalingam', () => {
      // 3. Typewriter starts
      typeWriter(document.getElementById('hero-typewriter'), HERO_ROLES, () => {});

      // 4. Badges pop in
      sec.querySelectorAll('.badge').forEach((b, i) => animateIn(b, i * 150));

      // 5. CTAs slide up
      sec.querySelectorAll('.btn').forEach((b, i) => animateIn(b, 400 + i * 120));

      done();
    });
  }, 400);
}
```

**Step: Verify** — open in browser. Hero section should show scrambling name, typewriter subtitle, badges popping in, buttons sliding up.

**Step: Commit**
```bash
git add index.html && git commit -m "feat: hero section with scramble, typewriter, badges, CTAs"
```

---

## Task 5: Skills section — scanline sweep + XP bars

**Step 1: Replace `<section id="s1">` with:**

```html
<section id="s1" class="section">
  <div class="skills-inner">
    <p class="sec-label">PLAYER STATS</p>
    <h2 class="sec-title">Technical <span>Skills</span></h2>
    <div class="skills-grid" id="skills-grid">
      <div class="skill-row" data-pct="92"><span class="skill-name">SQL &amp; Databases</span><div class="xp-bar"><div class="xp-fill"></div></div><span class="xp-num">0</span></div>
      <div class="skill-row" data-pct="88"><span class="skill-name">Python &amp; ML</span><div class="xp-bar"><div class="xp-fill"></div></div><span class="xp-num">0</span></div>
      <div class="skill-row" data-pct="85"><span class="skill-name">Analytics &amp; BI</span><div class="xp-bar"><div class="xp-fill"></div></div><span class="xp-num">0</span></div>
      <div class="skill-row" data-pct="80"><span class="skill-name">Data Engineering</span><div class="xp-bar"><div class="xp-fill"></div></div><span class="xp-num">0</span></div>
      <div class="skill-row" data-pct="78"><span class="skill-name">Machine Learning &amp; AI</span><div class="xp-bar"><div class="xp-fill"></div></div><span class="xp-num">0</span></div>
      <div class="skill-row" data-pct="90"><span class="skill-name">Product &amp; Strategy</span><div class="xp-bar"><div class="xp-fill"></div></div><span class="xp-num">0</span></div>
    </div>
  </div>
  <div class="scanline-sweep" id="skills-sweep"></div>
</section>
```

**Step 2: Add Skills CSS:**

```css
/* Skills */
.skills-inner { width: 100%; max-width: 700px; }
.skills-grid { display: flex; flex-direction: column; gap: 18px; }
.skill-row { display: grid; grid-template-columns: 200px 1fr 48px; align-items: center; gap: 16px; opacity: 0; transform: translateX(-20px); }
.skill-name { font-size: 0.85rem; font-weight: 600; color: var(--text); }
.xp-bar { height: 8px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden; }
.xp-fill { height: 100%; width: 0%; background: linear-gradient(90deg, var(--teal), var(--gold)); border-radius: 4px; transition: width 1s cubic-bezier(0.4,0,0.2,1); }
.xp-num { font-size: 0.75rem; font-weight: 700; color: var(--teal); text-align: right; }

/* Scanline sweep */
.scanline-sweep {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0,212,255,0.06) 50%, transparent 100%);
  height: 80px;
  width: 100%;
  top: -80px;
  pointer-events: none;
}
```

**Step 3: Replace `entranceSkills` stub with:**

```js
function entranceSkills(done) {
  const sec = getSection(1);
  const label = sec.querySelector('.sec-label');
  const title = sec.querySelector('.sec-title');
  const rows = sec.querySelectorAll('.skill-row');
  const sweep = document.getElementById('skills-sweep');

  // Reset
  label.style.opacity = '0';
  title.style.opacity = '0';
  rows.forEach(r => { r.style.opacity='0'; r.style.transform='translateX(-20px)'; r.querySelector('.xp-fill').style.width='0%'; r.querySelector('.xp-num').textContent='0'; });

  // 1. Scanline sweep
  sweep.style.transition = 'top 0.6s linear';
  sweep.style.top = '-80px';
  setTimeout(() => { sweep.style.top = '110%'; }, 50);

  // 2. Label + title fade in
  setTimeout(() => {
    label.style.transition = 'opacity 0.4s'; label.style.opacity = '1';
    setTimeout(() => { title.style.transition = 'opacity 0.4s'; title.style.opacity = '1'; }, 200);
  }, 300);

  // 3. Rows slide in + bars fill
  rows.forEach((row, i) => {
    setTimeout(() => {
      row.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      row.style.opacity = '1';
      row.style.transform = 'translateX(0)';
      const pct = parseInt(row.dataset.pct);
      setTimeout(() => {
        row.querySelector('.xp-fill').style.width = pct + '%';
        // Count up number
        let n = 0;
        const numEl = row.querySelector('.xp-num');
        const countIv = setInterval(() => {
          n += 2;
          if (n >= pct) { n = pct; clearInterval(countIv); }
          numEl.textContent = n;
        }, 20);
      }, 200);
      if (i === rows.length - 1) setTimeout(done, 1200);
    }, 500 + i * 130);
  });
}
```

**Step: Verify** — scroll to Skills. Scanline sweeps down, rows slide in, XP bars fill with numbers counting up.

**Step: Commit**
```bash
git add index.html && git commit -m "feat: skills section with scanline sweep and XP bars"
```

---

## Task 6: Experience section — mission briefing slide-in

**Step 1: Replace `<section id="s2">` with:**

```html
<section id="s2" class="section">
  <div class="exp-inner" id="exp-inner">
    <p class="sec-label">MISSION LOG</p>
    <h2 class="sec-title">Work <span>Experience</span></h2>
    <div class="timeline">
      <div class="tl-item">
        <div class="tl-dot"></div>
        <div class="tl-content">
          <div class="tl-header">
            <span class="tl-org">Capgemini</span>
            <span class="tl-date">Jun 2022 – Jul 2024</span>
          </div>
          <div class="tl-role">Professional Software Developer · Chennai, India</div>
          <ul class="tl-bullets">
            <li>Queried PostgreSQL across <strong>500K+ records daily</strong>, reducing query latency by <strong>20%</strong></li>
            <li>Reduced reconciliation errors by <strong>15%</strong> through automated validation checks</li>
            <li>Cut clarification cycles by <strong>25%</strong> via root cause analysis coordination</li>
          </ul>
        </div>
      </div>
      <div class="tl-item">
        <div class="tl-dot"></div>
        <div class="tl-content">
          <div class="tl-header">
            <span class="tl-org">Cango Networks</span>
            <span class="tl-date">Sep 2021 – Mar 2022</span>
          </div>
          <div class="tl-role">Software Developer · Chennai, India</div>
          <ul class="tl-bullets">
            <li>Built Tableau &amp; Power BI dashboards reducing reporting time by <strong>30%</strong></li>
            <li>Improved data consistency, reducing inconsistencies by <strong>18%</strong></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>
```

**Step 2: Add Experience CSS:**

```css
/* Experience */
.exp-inner { width: 100%; max-width: 760px; transform: translateX(100px); opacity: 0; }
.timeline { display: flex; flex-direction: column; gap: 32px; position: relative; padding-left: 24px; }
.timeline::before { content: ''; position: absolute; left: 0; top: 8px; bottom: 8px; width: 2px; background: linear-gradient(180deg, var(--teal), var(--gold)); }
.tl-item { display: flex; gap: 20px; opacity: 0; transform: translateX(30px); }
.tl-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--teal); margin-top: 6px; flex-shrink: 0; box-shadow: 0 0 8px var(--teal); position: relative; left: -30px; }
.tl-content { flex: 1; }
.tl-header { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 8px; margin-bottom: 4px; }
.tl-org { font-size: 1.1rem; font-weight: 700; color: var(--text); }
.tl-date { font-size: 0.8rem; color: var(--teal); font-weight: 600; }
.tl-role { font-size: 0.85rem; color: var(--muted); margin-bottom: 10px; font-style: italic; }
.tl-bullets { list-style: none; display: flex; flex-direction: column; gap: 6px; }
.tl-bullets li { font-size: 0.85rem; color: var(--muted); padding-left: 14px; position: relative; }
.tl-bullets li::before { content: '▸'; position: absolute; left: 0; color: var(--teal); }
.tl-bullets strong { color: var(--text); font-weight: 600; }
```

**Step 3: Replace `entranceExperience` stub with:**

```js
function entranceExperience(done) {
  const sec = getSection(2);
  const inner = document.getElementById('exp-inner');
  const label = sec.querySelector('.sec-label');
  const title = sec.querySelector('.sec-title');
  const items = sec.querySelectorAll('.tl-item');

  // Reset
  inner.style.transform = 'translateX(100px)';
  inner.style.opacity = '0';
  label.style.opacity = '0';
  title.style.opacity = '0';
  items.forEach(it => { it.style.opacity='0'; it.style.transform='translateX(30px)'; });

  // 1. Panel slides in from right
  setTimeout(() => {
    inner.style.transition = 'transform 0.5s cubic-bezier(0.2,0,0.2,1), opacity 0.5s ease';
    inner.style.transform = 'translateX(0)';
    inner.style.opacity = '1';
  }, 100);

  // 2. Label + title
  setTimeout(() => {
    label.style.transition = 'opacity 0.4s'; label.style.opacity = '1';
    setTimeout(() => { title.style.transition = 'opacity 0.4s'; title.style.opacity = '1'; }, 200);
  }, 400);

  // 3. Timeline items drop in
  items.forEach((item, i) => {
    setTimeout(() => {
      item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      item.style.opacity = '1';
      item.style.transform = 'translateX(0)';
      if (i === items.length - 1) setTimeout(done, 500);
    }, 700 + i * 250);
  });
}
```

**Step: Verify** — scroll to Experience. Panel slides from right, items drop in sequentially.

**Step: Commit**
```bash
git add index.html && git commit -m "feat: experience section with mission briefing slide-in"
```

---

## Task 7: Projects section — cards fly in from edges

**Step 1: Replace `<section id="s3">` with:**

```html
<section id="s3" class="section">
  <p class="sec-label">LOADOUT SELECT</p>
  <h2 class="sec-title">Featured <span>Projects</span></h2>
  <div class="proj-grid">
    <div class="proj-card featured-card" data-from="top">
      <div class="proj-badge">★ FEATURED</div>
      <h3 class="proj-title">Real Estate AI Platform</h3>
      <p class="proj-desc">Full-stack AI decision platform · 4 API versions · 38 tests · 6.6M rows live data</p>
      <div class="proj-tags"><span>FastAPI</span><span>PostgreSQL</span><span>Angular 17</span><span>Monte Carlo</span><span>Bayesian AI</span></div>
      <a href="https://github.com/Sriram006SJM/real_estate_ai" target="_blank" class="proj-link"><i class="fab fa-github"></i> GitHub</a>
    </div>
    <div class="proj-card" data-from="left">
      <h3 class="proj-title">Credit Risk Modeling</h3>
      <p class="proj-desc">XGBoost &amp; Neural Networks on 100M+ transaction records</p>
      <div class="proj-tags"><span>Python</span><span>XGBoost</span><span>TensorFlow</span><span>SQL</span></div>
      <a href="https://github.com/Sriram006SJM/Machine-Learning" target="_blank" class="proj-link"><i class="fab fa-github"></i> GitHub</a>
    </div>
    <div class="proj-card" data-from="right">
      <h3 class="proj-title">SmartSell — Housing Analytics</h3>
      <p class="proj-desc">35% accuracy improvement · AI-driven real estate decisions (Mr. Cooper)</p>
      <div class="proj-tags"><span>SQL</span><span>Python</span><span>Regression</span></div>
      <a href="https://smartsell-app.vercel.app" target="_blank" class="proj-link"><i class="fas fa-external-link-alt"></i> Live Demo</a>
    </div>
    <div class="proj-card" data-from="bottom">
      <h3 class="proj-title">Predictive Sales Forecasting</h3>
      <p class="proj-desc">Conagra Hackathon · plant-based product forecasting · C-suite dashboards</p>
      <div class="proj-tags"><span>Python</span><span>Tableau</span><span>Predictive Modeling</span></div>
      <a href="https://github.com/Sriram006SJM/CONAGRA" target="_blank" class="proj-link"><i class="fab fa-github"></i> GitHub</a>
    </div>
  </div>
</section>
```

**Step 2: Add Projects CSS:**

```css
/* Projects */
.proj-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; max-width: 860px; }
.proj-card {
  background: rgba(0,212,255,0.04);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  opacity: 0;
  position: relative;
  transition: border-color 0.3s, box-shadow 0.3s;
}
.proj-card:hover { border-color: var(--teal); box-shadow: 0 4px 20px rgba(0,212,255,0.1); }
.featured-card { grid-column: 1 / -1; border-color: rgba(0,212,255,0.35); background: rgba(0,212,255,0.07); }
.proj-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.15em; color: var(--gold); }
.proj-title { font-size: 1rem; font-weight: 700; color: var(--text); }
.proj-desc { font-size: 0.8rem; color: var(--muted); flex: 1; }
.proj-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.proj-tags span { font-size: 0.7rem; padding: 3px 10px; border-radius: 12px; background: rgba(0,212,255,0.1); color: var(--teal); border: 1px solid var(--border); }
.proj-link { font-size: 0.8rem; color: var(--teal); text-decoration: none; display: inline-flex; align-items: center; gap: 6px; margin-top: auto; }
.proj-link:hover { text-decoration: underline; }

@media (max-width: 600px) { .proj-grid { grid-template-columns: 1fr; } .featured-card { grid-column: 1; } }
```

**Step 3: Replace `entranceProjects` stub with:**

```js
function entranceProjects(done) {
  const sec = getSection(3);
  const label = sec.querySelector('.sec-label');
  const title = sec.querySelector('.sec-title');
  const cards = sec.querySelectorAll('.proj-card');

  const fromMap = { top: 'translateY(-60px)', left: 'translateX(-60px)', right: 'translateX(60px)', bottom: 'translateY(60px)' };

  // Reset
  label.style.opacity = '0'; title.style.opacity = '0';
  cards.forEach(c => {
    c.style.opacity = '0';
    c.style.transform = fromMap[c.dataset.from] || 'translateY(40px)';
  });

  setTimeout(() => { label.style.transition='opacity 0.4s'; label.style.opacity='1'; }, 100);
  setTimeout(() => { title.style.transition='opacity 0.4s'; title.style.opacity='1'; }, 250);

  cards.forEach((card, i) => {
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.2,0,0.2,1)';
      card.style.opacity = '1';
      card.style.transform = 'translate(0,0)';
      if (i === cards.length - 1) setTimeout(done, 500);
    }, 400 + i * 150);
  });
}
```

**Step: Verify** — scroll to Projects. Cards fly in from top/left/right/bottom.

**Step: Commit**
```bash
git add index.html && git commit -m "feat: projects section with cards flying in from edges"
```

---

## Task 8: Education section — achievement unlocked

**Step 1: Replace `<section id="s4">` with:**

```html
<section id="s4" class="section">
  <div class="achievement-banner" id="ach-banner">
    <i class="fas fa-trophy"></i>
    <span>ACHIEVEMENT UNLOCKED</span>
  </div>
  <div class="edu-inner" id="edu-inner">
    <p class="sec-label">CREDENTIALS</p>
    <h2 class="sec-title">Education</h2>
    <div class="edu-cards">
      <div class="edu-card" id="edu-card-0">
        <div class="edu-icon"><i class="fas fa-graduation-cap"></i></div>
        <div class="edu-body">
          <div class="edu-school">University of Texas at Dallas</div>
          <div class="edu-degree">MS in Business Analytics &amp; AI</div>
          <div class="edu-meta">Aug 2024 – Dec 2025 · GPA <strong>3.92</strong> · Dean's Excellence Scholar</div>
          <div class="edu-chips">
            <span>Data Warehousing</span><span>Predictive Analytics</span><span>Big Data</span><span>Deep Learning</span><span>Business Analytics with R</span>
          </div>
        </div>
      </div>
      <div class="edu-card" id="edu-card-1">
        <div class="edu-icon"><i class="fas fa-university"></i></div>
        <div class="edu-body">
          <div class="edu-school">College of Engineering, Guindy</div>
          <div class="edu-degree">BE in Engineering</div>
          <div class="edu-meta">2017 – 2021 · GPA <strong>3.1</strong></div>
        </div>
      </div>
    </div>
  </div>
</section>
```

**Step 2: Add Education CSS:**

```css
/* Education */
.achievement-banner {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%) scale(0.5);
  background: linear-gradient(90deg, var(--gold), #ffaa00);
  color: #000;
  padding: 10px 28px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  display: flex;
  align-items: center;
  gap: 10px;
  opacity: 0;
  white-space: nowrap;
}
.edu-inner { width: 100%; max-width: 760px; opacity: 0; transform: translateY(30px); }
.edu-cards { display: flex; flex-direction: column; gap: 20px; }
.edu-card { display: flex; gap: 20px; padding: 24px; background: rgba(240,192,64,0.05); border: 1px solid rgba(240,192,64,0.2); border-radius: 12px; opacity: 0; transform: translateY(20px); }
.edu-icon { font-size: 1.8rem; color: var(--gold); width: 40px; flex-shrink: 0; }
.edu-school { font-size: 1rem; font-weight: 700; color: var(--text); margin-bottom: 4px; }
.edu-degree { font-size: 0.9rem; color: var(--teal); font-weight: 600; margin-bottom: 4px; }
.edu-meta { font-size: 0.8rem; color: var(--muted); margin-bottom: 10px; }
.edu-meta strong { color: var(--gold); }
.edu-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.edu-chips span { font-size: 0.7rem; padding: 3px 10px; border-radius: 12px; background: rgba(240,192,64,0.1); color: var(--gold); border: 1px solid rgba(240,192,64,0.2); }
```

**Step 3: Replace `entranceEducation` stub with:**

```js
function entranceEducation(done) {
  const sec = getSection(4);
  const banner = document.getElementById('ach-banner');
  const inner = document.getElementById('edu-inner');
  const cards = sec.querySelectorAll('.edu-card');
  const label = sec.querySelector('.sec-label');
  const title = sec.querySelector('.sec-title');

  // Reset
  banner.style.opacity='0'; banner.style.transform='translateX(-50%) scale(0.5)';
  inner.style.opacity='0'; inner.style.transform='translateY(30px)';
  label.style.opacity='0'; title.style.opacity='0';
  cards.forEach(c => { c.style.opacity='0'; c.style.transform='translateY(20px)'; });

  // 1. Achievement banner pops
  setTimeout(() => {
    banner.style.transition = 'opacity 0.3s, transform 0.4s cubic-bezier(0.2,0,0.2,1)';
    banner.style.opacity = '1';
    banner.style.transform = 'translateX(-50%) scale(1)';
  }, 100);

  // 2. Banner fades out, content fades in
  setTimeout(() => {
    banner.style.opacity = '0';
    inner.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    inner.style.opacity = '1';
    inner.style.transform = 'translateY(0)';
    label.style.transition='opacity 0.4s'; label.style.opacity='1';
    setTimeout(() => { title.style.transition='opacity 0.4s'; title.style.opacity='1'; }, 200);
  }, 1000);

  // 3. Cards pop up
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
      if (i === cards.length - 1) setTimeout(done, 500);
    }, 1300 + i * 250);
  });
}
```

**Step: Verify** — scroll to Education. Gold "Achievement Unlocked" banner pops, then degree cards slide up.

**Step: Commit**
```bash
git add index.html && git commit -m "feat: education section with achievement unlocked animation"
```

---

## Task 9: Contact section — glitch + beam in

**Step 1: Replace `<section id="s5">` with:**

```html
<section id="s5" class="section">
  <div class="contact-inner" id="contact-inner">
    <p class="sec-label" id="contact-label">INCOMING TRANSMISSION</p>
    <h2 class="sec-title">Get In <span>Touch</span></h2>
    <div class="contact-lines">
      <a href="mailto:sriram.ganeshalingam@utdallas.edu" class="contact-line">
        <i class="fas fa-envelope"></i>
        <span>sriram.ganeshalingam@utdallas.edu</span>
      </a>
      <a href="https://www.linkedin.com/in/sriram-ganeshalingam" target="_blank" class="contact-line">
        <i class="fab fa-linkedin"></i>
        <span>linkedin.com/in/sriram-ganeshalingam</span>
      </a>
      <a href="tel:+14696796681" class="contact-line">
        <i class="fas fa-phone"></i>
        <span>+1 (469) 679-6681</span>
      </a>
    </div>
    <p class="contact-footer">Currently open to <strong>Data Analyst</strong> &amp; <strong>Data Engineering</strong> roles</p>
  </div>
</section>
```

**Step 2: Add Contact CSS:**

```css
/* Contact */
.contact-inner { text-align: center; max-width: 600px; opacity: 0; }
.contact-lines { display: flex; flex-direction: column; gap: 20px; margin: 32px 0; }
.contact-line {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 28px;
  border: 1px solid var(--border);
  border-radius: 10px;
  text-decoration: none;
  color: var(--text);
  font-size: 0.95rem;
  opacity: 0;
  transform: translateX(-30px);
  transition: border-color 0.3s, box-shadow 0.3s;
}
.contact-line:hover { border-color: var(--teal); box-shadow: 0 0 16px rgba(0,212,255,0.15); color: var(--teal); }
.contact-line i { font-size: 1.2rem; color: var(--teal); width: 24px; }
.contact-footer { font-size: 0.85rem; color: var(--muted); opacity: 0; margin-top: 16px; }
.contact-footer strong { color: var(--teal); }

@keyframes glitch {
  0%   { transform: translate(0); }
  20%  { transform: translate(-3px, 2px); clip-path: inset(10% 0 80% 0); }
  40%  { transform: translate(3px, -2px); clip-path: inset(60% 0 20% 0); }
  60%  { transform: translate(-2px, 1px); clip-path: inset(30% 0 50% 0); }
  80%  { transform: translate(2px, -1px); clip-path: inset(70% 0 10% 0); }
  100% { transform: translate(0); clip-path: none; }
}
.glitching { animation: glitch 0.4s steps(1) forwards; }
```

**Step 3: Replace `entranceContact` stub with:**

```js
function entranceContact(done) {
  const sec = getSection(5);
  const inner = document.getElementById('contact-inner');
  const label = sec.querySelector('.sec-label');
  const title = sec.querySelector('.sec-title');
  const lines = sec.querySelectorAll('.contact-line');
  const footer = sec.querySelector('.contact-footer');

  // Reset
  inner.style.opacity = '0';
  label.style.opacity = '0'; title.style.opacity = '0';
  lines.forEach(l => { l.style.opacity='0'; l.style.transform='translateX(-30px)'; });
  footer.style.opacity = '0';

  // 1. Glitch the section label
  setTimeout(() => {
    inner.style.opacity = '1';
    label.style.opacity = '1';
    label.classList.add('glitching');
    setTimeout(() => label.classList.remove('glitching'), 400);
  }, 100);

  // 2. Title fades
  setTimeout(() => { title.style.transition='opacity 0.4s'; title.style.opacity='1'; }, 600);

  // 3. Lines beam in
  lines.forEach((line, i) => {
    setTimeout(() => {
      line.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      line.style.opacity = '1';
      line.style.transform = 'translateX(0)';
    }, 900 + i * 200);
  });

  // 4. Footer
  setTimeout(() => {
    footer.style.transition = 'opacity 0.5s';
    footer.style.opacity = '1';
    done();
  }, 900 + lines.length * 200 + 300);
}
```

**Step: Verify** — scroll to Contact. Label glitches, title fades, contact lines beam in.

**Step: Commit**
```bash
git add index.html && git commit -m "feat: contact section with glitch + beam-in animation"
```

---

## Task 10: Deploy to GitHub Pages

**Step 1: Run deploy script**
```bash
bash ~/Desktop/portfolio-3d/deploy.sh
```

**Step 2: Verify live**

Visit: `https://sriram006sjm.github.io/portfolio-3d/`

Expected: Dark background, HUD counter top-right, hero name scrambles in on load. Scrolling cycles through all 6 sections with their animations.

---

## Summary

| Task | What it builds |
|---|---|
| 1 | index.html scaffold + deploy.sh |
| 2 | Global CSS — dark theme, HUD, scanlines |
| 3 | Scroll-lock engine — wheel/touch/keyboard |
| 4 | Hero — scramble name, typewriter, badges, CTAs |
| 5 | Skills — scanline sweep, XP bars fill |
| 6 | Experience — mission briefing slide from right |
| 7 | Projects — cards fly in from edges |
| 8 | Education — achievement unlocked animation |
| 9 | Contact — glitch + beam in |
| 10 | Deploy to GitHub Pages |
