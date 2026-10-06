/* ---------------------------------------------------------
   Content lists - edit these to swap your own assets/text
   --------------------------------------------------------- */
const RING_IMAGES = Array.from({ length: 10 }, (_, i) => `assets/images/ring/ring-${String(i + 1).padStart(2, '0')}.webp`);

// real side projects & experiments from github.com/Kallolx and devrafikhan01.vercel.app.
// third item is the real screenshot slug where one exists (null keeps the
// generic cycling archive art) - always the wide hero crop.
const ARCHIVE = [
  ['OneDigitalSpot', '26', 'onedigitalspot'], ['Toolbox Central', '25', 'tooltune'],
  ['Photocard Generator', '25', 'photocard'],
  ['Citizen', '24', 'civix'],
  ['Star Vibe', '26', 'starvibe'], ['Niyenin.com', '26', 'niyenin'], ['Mailflow', '26', 'mailflow'],
  ['Postra', '26', 'postra'], ['Aperitiv', '26', 'aperitiv'], ['Softune Agency', '25', 'softune-agency'],
  ['JamilIfat', '25', 'jamilifat'], ['Webify', '26', 'webify'], ['Eventra', '26', 'eventra'],
  ['Distribe', '26', 'distribe'], ['AllInOne OTT', '26', 'allinone-ott'], ['FoodMaster', '26', 'foodmaster'],
  ['Service Market', '26', 'servicemarket'], ['MasterTools BD', '26', 'mastertools'],
].map(([title, year, slug], i) => ({
  title, year,
  src: slug ? `assets/images/projects/${slug}/hero.webp` : `assets/images/archive/archive-${String((i % 12) + 1).padStart(2, '0')}.jpg`,
}));

const TESTI_DURATION = 6; // seconds per testimonial

/* --------------------------------------------------------- */
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
gsap.registerPlugin(ScrollTrigger);

/* Smooth scroll (Lenis) wired into GSAP's ticker */
let lenis;
if (!reduced && window.Lenis) {
  lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1 && document.querySelector(id)) { e.preventDefault(); closeMenu(); lenis.scrollTo(id); }
    })
  );
}

/* Icons (Lucide - same icon set as lucide-react): turns every <i data-lucide="…"> into an SVG */
if (window.lucide) lucide.createIcons({ attrs: { 'stroke-width': 1.75 } });

/* Buttons: add a second arrow circle on the right, which grows in on hover as the left one shrinks away */
document.querySelectorAll('.btn .btn-ico').forEach((ico) => {
  const end = ico.cloneNode(true);
  end.classList.add('end');
  ico.parentElement.appendChild(end);
});

/* ---------------------------------------------------------
   mailto: links rely on the visitor having a desktop mail app
   configured - if they don't, the browser just does nothing and it
   looks broken. Every mailto link site-wide still attempts to open
   one, but also copies the address to the clipboard and confirms it
   with a small toast, so clicking it is never a dead end.
   --------------------------------------------------------- */
let toastTimer;
function showToast(text) {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = text;
  clearTimeout(toastTimer);
  requestAnimationFrame(() => el.classList.add('on'));
  toastTimer = setTimeout(() => el.classList.remove('on'), 2600);
}
document.querySelectorAll('a[href^="mailto:"]').forEach((a) => {
  a.addEventListener('click', () => {
    const email = a.getAttribute('href').replace('mailto:', '').split('?')[0];
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email)
        .then(() => showToast(`Copied ${email} - opening your email app…`))
        .catch(() => showToast(`Email me at ${email}`));
    } else {
      showToast(`Email me at ${email}`);
    }
  });
});

/* ---------------------------------------------------------
   Text 3D flip on hover (nav links) - vanilla port of Magic UI's Text3DFlip
   --------------------------------------------------------- */
document.querySelectorAll('.flip').forEach((el) => {
  const text = el.textContent.trim();
  const word = (w) => `<span class="flip-word" aria-hidden="true">${[...w].map((c) =>
    `<span class="flip-char"><span class="flip-face">${c}</span><span class="flip-face top">${c}</span></span>`).join('')}</span>`;
  el.innerHTML = `<span class="sr-only">${text}</span>` + text.split(' ').map(word).join(' ');
  const chars = el.querySelectorAll('.flip-char');
  const trigger = el.closest('a') || el;
  let tween;
  trigger.addEventListener('mouseenter', () => {
    if (reduced) return;
    tween && tween.kill();
    gsap.set(chars, { '--rx': '0deg' });
    tween = gsap.to(chars, {
      '--rx': '-90deg', duration: 0.5, ease: 'back.out(1.4)', stagger: 0.035, // springy roll, letter by letter
      onComplete: () => gsap.set(chars, { '--rx': '0deg' }), // faces are identical, so the snap back is invisible
    });
  });
  // leaving mid-roll: roll the letters straight back instead of letting the gold finish
  trigger.addEventListener('mouseleave', () => {
    if (!tween || !tween.isActive()) return;
    tween.kill();
    tween = gsap.to(chars, { '--rx': '0deg', duration: 0.18, ease: 'power2.out', overwrite: true });
  });
});

/* ---------------------------------------------------------
   Live local clock - Dhaka, Bangladesh (GMT+6)
   Each digit sits in its own little window and rolls up to the next value;
   the colons blink, seconds are smaller and gold, AM/PM is a tiny pill.
   --------------------------------------------------------- */
(() => {
  const clocks = document.querySelectorAll('[data-clock]');
  if (!clocks.length) return;
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
  });
  const digit = () => '<span class="clk-d"><span class="clk-roll"><i>0</i><i>0</i></span></span>';
  clocks.forEach((c) => {
    c.innerHTML = `<span class="clk-live"></span>${digit()}${digit()}<span class="clk-colon">:</span>${digit()}${digit()}` +
      `<span class="clk-sec"><span class="clk-colon">:</span>${digit()}${digit()}</span><span class="clk-ap">AM</span>`;
  });
  const set = (roll, v) => {
    const [cur, next] = roll.children;
    if (cur.textContent === v) return;
    next.textContent = v;
    roll.classList.remove('go'); void roll.offsetWidth; // restart the roll
    roll.classList.add('go');
    setTimeout(() => { cur.textContent = v; roll.classList.remove('go'); }, 420);
  };
  const tick = () => {
    const parts = fmt.formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    const digits = (get('hour') + get('minute') + get('second')).split('');
    const ap = get('dayPeriod').toUpperCase();
    clocks.forEach((c) => {
      c.querySelectorAll('.clk-roll').forEach((r, i) => set(r, digits[i]));
      c.querySelector('.clk-ap').textContent = ap;
    });
    setTimeout(tick, 1000 - (Date.now() % 1000)); // stay aligned to the real second
  };
  tick();
})();

/* Mobile menu
   1. a circle grows out of the menu button until it covers the whole screen
   2. link text slides in from the left inside its own clip, dividers draw
   3. footer info, button and socials slide in from the left
   Closing shrinks the circle back into the button. */
const burger = document.querySelector('.burger');
const menu = document.querySelector('.mobile-menu');
// circle centred on the burger, with a radius big enough to reach the far corner
function menuCircle(open) {
  const b = burger.getBoundingClientRect();
  const x = b.left + b.width / 2, y = b.top + b.height / 2;
  const r = open ? Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) : 0;
  return `circle(${r}px at ${x}px ${y}px)`;
}
// opening timeline
const menuTl = gsap.timeline({ paused: true })
  .fromTo(menu,
    { clipPath: () => menuCircle(false) },
    { clipPath: () => menuCircle(true), duration: 0.6, ease: 'power3.inOut' })
  .fromTo('.mm-reveal', { yPercent: 110, xPercent: 0 }, { yPercent: 0, duration: 0.4, ease: 'expo.out' }, '-=0.28')
  .fromTo('.mm-txt', { xPercent: -110 }, { xPercent: 0, duration: 0.65, ease: 'expo.out', stagger: 0.045 }, '<')
  .fromTo('.mm-links a', { '--ln': 0 }, { '--ln': 1, duration: 0.7, ease: 'expo.inOut', stagger: 0.045 }, '<')
  .fromTo(['.mm-meta > div', '.mm-row .btn', '.mm-social a'],
    { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'expo.out', stagger: 0.04 }, '-=0.6');

// closing: its own quicker exit - contents whip out left, then the circle shrinks back into the button
let closeTl;
function playClose() {
  menuTl.pause();
  closeTl && closeTl.kill();
  closeTl = gsap.timeline({ onComplete: () => menu.classList.remove('on') })
    .to(['.mm-txt', '.mm-reveal'], { xPercent: -110, duration: 0.35, ease: 'expo.in', stagger: 0.025 })
    .to(['.mm-arrow', '.mm-meta > div', '.mm-row .btn', '.mm-social a'], { opacity: 0, x: -30, duration: 0.3, ease: 'power2.in', stagger: 0.015 }, 0)
    .to('.mm-links a', { '--ln': 0, duration: 0.35, ease: 'expo.in' }, 0)
    .to(menu, { clipPath: menuCircle(false), duration: 0.5, ease: 'power3.inOut' }, 0.15);
}

function setMenu(open) {
  burger.classList.toggle('on', open);
  menu.setAttribute('aria-hidden', !open);
  if (open) {
    closeTl && closeTl.kill();
    gsap.set('.mm-arrow', { clearProps: 'all' }); // undo the close animation's inline styles
    menu.classList.add('on');
    menuTl.invalidate().restart(); // re-measure the circle (screen size may have changed)
  } else playClose();
  // freeze the page behind the menu. (Not via body overflow:hidden - that removes the
  // scrollbar, widens the page and makes the full-width portrait jump.)
  if (lenis) open ? lenis.stop() : lenis.start();
}
function closeMenu() { if (menu.classList.contains('on')) setMenu(false); }
burger.addEventListener('click', () => setMenu(!burger.classList.contains('on')));
menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));

/* ---------------------------------------------------------
   Hero: auto-rotating 3D ring
   --------------------------------------------------------- */
/* The camera sits INSIDE the ring (like the reference): cards on the far wall
   look small, cards at the sides are big and bend toward the viewer.
   Geometry measured from the reference. Like the reference, it is NOT scaled
   down on small screens - phones just see fewer, bigger cards. */
const RING = {
  count: 14,        // cards around the full circle (images repeat if fewer)
  cardW: 640, cardH: 360, // real 16:9 photos (1920×1080)
  radius: 1450,     // ring radius
  centerZ: -470,    // ring centre, behind the screen plane
  perspective: 650,
  speed: 5.2,       // degrees per second, cards travel right → left
};
if (document.getElementById('ring')) { // home page hero only
  const stage = document.querySelector('.ring-stage');
  const ring = document.getElementById('ring');
  Array.from({ length: RING.count }, (_, i) => RING_IMAGES[i % RING_IMAGES.length]).forEach((src) => {
    const card = document.createElement('div');
    card.className = 'ring-card';
    card.innerHTML = `<img src="${src}" alt="" loading="eager" draggable="false">`;
    ring.appendChild(card);
  });
  const cards = [...ring.children];
  // spread / boost / introTilt are only used by the entrance animation
  const ringState = { rot: 0, tiltX: 0, y: 0, spread: 1, boost: 0, introTilt: 0 };
  // On narrow screens the reference shrinks the ring with a flat 2D scale of
  // (viewport − 40) / 640 - e.g. 0.609 at 430px, 0.547 at 390px. Desktop: 1.
  let ringScale = 1;
  function layoutRing() {
    ringScale = Math.min(1, (window.innerWidth - 40) / RING.cardW);
    stage.style.perspective = `${RING.perspective}px`;
    const step = 360 / cards.length;
    cards.forEach((c, i) => {
      c.dataset.base = i * step;
      Object.assign(c.style, {
        width: `${RING.cardW}px`, height: `${RING.cardH}px`,
        left: `${-RING.cardW / 2}px`, top: `${-RING.cardH / 2}px`,
      });
    });
  }
  function renderRing() {
    const r = RING.radius * ringState.spread;
    ring.style.transform =
      `translate3d(0, ${ringState.y}px, ${RING.centerZ}px) rotateX(${ringState.tiltX + ringState.introTilt}deg) scale(${ringScale}) rotateY(${ringState.rot}deg)`;
    cards.forEach((c) => {
      const a = +c.dataset.base;
      // card sits on the inside wall, facing the centre
      c.style.transform = `rotateY(${a}deg) translateZ(${-r}px)`;
      // angle from the front (0 = far wall, straight ahead)
      let ang = (((a + ringState.rot) % 360) + 360) % 360;
      if (ang > 180) ang -= 360;
      const abs = Math.abs(ang);
      // cards past ~100° are off-screen / behind the camera - hide them
      c.style.opacity = abs > 100 ? 0 : abs > 85 ? (100 - abs) / 15 : 1;
      c.style.visibility = abs > 100 ? 'hidden' : 'visible';
    });
  }
  layoutRing();
  window.addEventListener('resize', layoutRing);
  /* Drag to spin (the reference ring is draggable too), with a little momentum */
  const hero = document.querySelector('.hero');
  const drag = { on: false, x: 0, vel: 0 };
  hero.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button')) return;
    const y = e.clientY - hero.getBoundingClientRect().top;
    if (y < 90 || y > 460) return; // only the ring's band
    e.preventDefault(); // stop the browser's native image drag / text selection
    drag.on = true; drag.x = e.clientX; drag.vel = 0;
    hero.classList.add('dragging');
  });
  window.addEventListener('pointermove', (e) => {
    if (!drag.on) return;
    const dx = e.clientX - drag.x;
    drag.x = e.clientX;
    drag.vel = -dx * 0.12; // dragging left spins the same way as the auto-spin
    ringState.rot += drag.vel;
  });
  ['pointerup', 'pointercancel'].forEach((ev) =>
    window.addEventListener(ev, () => { drag.on = false; hero.classList.remove('dragging'); })
  );

  gsap.ticker.add((t, dt) => {
    if (!drag.on) {
      ringState.rot += drag.vel;      // momentum after release
      drag.vel *= 0.94;
      if (!reduced) ringState.rot += (dt / 1000) * (RING.speed + ringState.boost);
    }
    renderRing();
  });

  /* Ring entrance: the cards start bunched at the centre, burst outward into the ring
     while it whips round at high speed, then glide down into the slow drift.
     The ring also levels out from a slight tilt as it lands. */
  if (!reduced) {
    gsap.timeline({ delay: 0.1 })
      .from('.ring-stage', { opacity: 0, duration: 0.35, ease: 'power1.out' }, 0)
      .fromTo(ringState, { spread: 0.15 }, { spread: 1, duration: 1.9, ease: 'power4.inOut' }, 0)
      .fromTo(ringState, { boost: 260 }, { boost: 0, duration: 3, ease: 'power3.out' }, 0)
      .fromTo(ringState, { introTilt: 22 }, { introTilt: 0, duration: 2.2, ease: 'elastic.out(1, 0.55)' }, 0);
  }

  /* Hero intro - same language as the footer portrait: rise up, fade in, sharpen from a blur */
  // the blur animates alongside the CSS drop-shadow, so the shadow is there from the first frame
  const portraitShadow = getComputedStyle(document.documentElement).getPropertyValue('--portrait-shadow').trim();
  gsap.fromTo('.portrait-anim',
    { y: 160, opacity: 0, scale: 0.9, filter: `blur(18px) ${portraitShadow}` },
    { y: 0, opacity: 1, scale: 1, filter: `blur(0px) ${portraitShadow}`, duration: 1.6, ease: 'expo.out', delay: 0.15, clearProps: 'filter,scale' });
  gsap.fromTo('.hero-in',
    { y: 60, opacity: 0, filter: 'blur(10px)' },
    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out', stagger: 0.12, delay: 0.55, clearProps: 'filter' });

  /* Hero scroll: ring tilts back & lifts, portrait parallax */
  gsap.to(ringState, {
    tiltX: -8, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('.portrait-anim', {
    yPercent: 12, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });

}

/* "All Works" thumbnail - same aggressive parallax as the works.html project images */
gsap.utils.toArray('.all-works .wimg').forEach((el) =>
  gsap.fromTo(el, { yPercent: -38 }, { yPercent: 38, ease: 'none',
    scrollTrigger: { trigger: el.closest('.all-works'), start: 'top bottom', end: 'bottom top', scrub: 0.3 } })
);

/* ---------------------------------------------------------
   Portrait: grayscale by default, smooth color reveal on hover
   --------------------------------------------------------- */
(() => {
  const wrap = document.getElementById('portrait');
  if (!wrap) return;

  const color = wrap.querySelector('.portrait-color');
  if (!color) return;

  const state = { cx: 50, cy: 38, tx: 50, ty: 38, r: 0, tr: 0 };
  let inside = false;

  const point = (e) => {
    const b = wrap.getBoundingClientRect();
    state.tx = Math.max(4, Math.min(96, ((e.clientX - b.left) / b.width) * 100));
    state.ty = Math.max(4, Math.min(86, ((e.clientY - b.top) / b.height) * 100));
  };

  const enter = (e) => {
    inside = true;
    wrap.classList.add('is-hovering');
    point(e);
    state.tr = 1;
  };

  const leave = () => {
    inside = false;
    wrap.classList.remove('is-hovering');
    state.tr = 0;
  };

  wrap.addEventListener('pointerenter', enter);
  wrap.addEventListener('pointermove', point);
  wrap.addEventListener('pointerleave', leave);

  gsap.ticker.add(() => {
    state.cx += (state.tx - state.cx) * 0.18;
    state.cy += (state.ty - state.cy) * 0.18;
    state.r += (state.tr - state.r) * 0.13;
    const radius = 18 + state.r * 100;
    color.style.clipPath = `circle(${radius}% at ${state.cx}% ${state.cy}%)`;
    color.style.opacity = String(Math.min(1, state.r * 1.15));
  });
})();
/* ---------------------------------------------------------
   Generic fade-up reveals
   --------------------------------------------------------- */
gsap.utils.toArray('.reveal').forEach((el) => {
  gsap.from(el, {
    opacity: 0, y: 40, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 88%' },
  });
});

/* ---------------------------------------------------------
   Word-by-word text reveal (.word-in) - used site-wide (every page's headings
   and copy). Each word gets its own overflow-hidden mask and slides up into
   place one after another, instead of the whole paragraph fading up as a
   single block. <br> tags (hand-set line breaks) are kept in place.
   Elements inside a hero (home or an inner page) play on load, like the rest
   of that hero; everything else plays once it scrolls into view.
   --------------------------------------------------------- */
(() => {
  // simple inline formatting is split too (its words still reveal, just visually bold/italic);
  // anything else (e.g. <br>) is left completely alone
  const INLINE_TAGS = new Set(['B', 'STRONG', 'EM', 'I']);
  const splitInto = (container, node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent.split(/(\s+)/).forEach((chunk) => {
        if (chunk === '') return;
        if (/^\s+$/.test(chunk)) { container.appendChild(document.createTextNode(chunk)); return; }
        const mask = document.createElement('span'); mask.className = 'word-mask';
        const inner = document.createElement('span'); inner.className = 'word-inner'; inner.textContent = chunk;
        mask.appendChild(inner); container.appendChild(mask);
      });
    } else if (node.nodeType === Node.ELEMENT_NODE && INLINE_TAGS.has(node.tagName)) {
      const clone = node.cloneNode(false); // same tag + attributes, empty - refilled by recursing below
      [...node.childNodes].forEach((child) => splitInto(clone, child));
      container.appendChild(clone);
    } else {
      container.appendChild(node.cloneNode(true)); // e.g. <br> - left untouched
    }
  };
  const splitWords = (el) => {
    const frag = document.createDocumentFragment();
    el.childNodes.forEach((node) => splitInto(frag, node));
    el.replaceChildren(frag);
    return [...el.querySelectorAll('.word-inner')];
  };

  document.querySelectorAll('.word-in').forEach((el) => {
    const words = splitWords(el);
    if (!words.length) return;
    if (reduced) return; // words are already visible; nothing to animate
    gsap.set(words, { yPercent: 130, opacity: 0 });
    const play = () => gsap.to(words, { yPercent: 0, opacity: 1, duration: 0.85, ease: 'expo.out', stagger: 0.035 });
    if (el.closest('.hero-content, .about-hero-inner')) gsap.delayedCall(0.2, play); // hero text: plays on load
    else ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: play });
  });
})();

/* Divider lines grow in */
gsap.utils.toArray('.line.grow, .acc-item, .footer-nav a').forEach((el) => {
  gsap.fromTo(el, { clipPath: 'inset(0% 100% 0% 0%)' }, {
    clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power3.out', clearProps: 'clipPath',
    scrollTrigger: { trigger: el, start: 'top 92%' },
  });
});

/* Counters */
function countUp(el) {
  const to = +el.dataset.to;
  const obj = { v: 0 };
  gsap.to(obj, { v: to, duration: 2, ease: 'power2.out', onUpdate: () => (el.textContent = Math.round(obj.v)) });
}

/* ---------------------------------------------------------
   Why Us - pinned shrinking card (desktop), simple on mobile
   --------------------------------------------------------- */
const mm = gsap.matchMedia();
if (document.querySelector('.why')) mm.add('(min-width: 810px)', () => {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '.why', start: 'top top', end: '+=1000', pin: '.why-pin', scrub: 0.6 },
  });
  // contour lines only render while they're showing (they cost GPU time)
  const linesCanvas = document.querySelector('.why-lines');
  const lines = linesCanvas && window.createContours
    ? createContours(linesCanvas, { line: '#917b50', alpha: 0.45, scale: 1.7, levels: 7, seed: 1 }) : null;
  // always on while the section is on screen; paused when it's scrolled away
  const syncLines = () => {};
  if (lines) ScrollTrigger.create({ trigger: '.why', start: 'top bottom', end: 'bottom top',
    onToggle: (self) => (lines.active = self.isActive) });

  tl.fromTo('.why-card', { width: '100%', height: '100%' }, { width: 382, height: 560, ease: 'power2.inOut', duration: 1 })
    .to('.why-grid-bg', { opacity: 1, duration: 0.6 }, 0.4)
    // lines appear as soon as the card starts shrinking and are gone when it's full-size again
    ;
  tl.eventCallback('onUpdate', syncLines);
  // Stats glide in from further out, one after another (20+ → $1M+ → $100K+ → 50+),
  // settling into a staggered diagonal. Each number counts up while it travels in, tied to scroll.
  [['.stat-l1', -1], ['.stat-l2', -1], ['.stat-r1', 1], ['.stat-r2', 1]].forEach(([sel, dir], i) => {
    const at = 0.5 + i * 0.16;
    tl.fromTo(sel, { x: dir * 200, y: 90, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.7, ease: 'expo.out' }, at); // shoots in fast, glides to a stop
    const el = document.querySelector(`${sel} .count`);
    const n = { v: 0 };
    tl.fromTo(n, { v: 0 }, { v: +el.dataset.to, duration: 0.7, ease: 'expo.out',
      onUpdate: () => (el.textContent = Math.round(n.v)) }, at);
  });
  // no hold at the end: the pin releases as soon as the last stat lands
});
if (document.querySelector('.why')) mm.add('(max-width: 809px)', () => {
  gsap.utils.toArray('.why .stat').forEach((s) =>
    gsap.from(s, { opacity: 0, y: 30, duration: 0.8, scrollTrigger: { trigger: s, start: 'top 90%' } })
  );
  ScrollTrigger.create({
    trigger: '.why .stat', start: 'top 90%', once: true,
    onEnter: () => document.querySelectorAll('.why .count').forEach(countUp),
  });
});

/* Testimonials: the same animated contour lines, fainter and slower, on every screen size */
(() => {
  const canvas = document.querySelector('.testi-lines');
  const field = canvas && window.createContours
    ? createContours(canvas, { line: '#917b50', alpha: 0.22, scale: 1.7, levels: 7, seed: 3, speed: 0.45 }) : null;
  if (!field) return;
  field.active = false;
  ScrollTrigger.create({ trigger: '.testi', start: 'top bottom', end: 'bottom top', onToggle: (self) => (field.active = self.isActive) });
})();

document.querySelectorAll('.testi-stat .count').forEach((el) =>
  ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => countUp(el) })
);

/* Parallax on process images and the about background - aggressive, not subtle.
   (The hero ring/portrait and the footer portrait keep their original, gentler parallax.) */
gsap.utils.toArray('.step-img img').forEach((img) =>
  gsap.fromTo(img, { yPercent: -20 }, {
    yPercent: 4, ease: 'none', scrollTrigger: { trigger: img.parentElement, scrub: true },
  })
);
if (document.querySelector('.about-bg')) gsap.fromTo('.about-bg', { yPercent: -14 }, {
  yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.about', scrub: true },
});

/* Footer portrait: rises up out of the bottom, fading in and sharpening
   from a blur - tied to scroll so it follows the page smoothly */
gsap.fromTo('.fp-img',
  { y: 180, opacity: 0, scale: 0.9, filter: 'grayscale(1) blur(16px)' },
  {
    y: 0, opacity: 1, scale: 1, filter: 'grayscale(1) blur(0px)', ease: 'power2.out',
    scrollTrigger: { trigger: '.footer-portrait', start: 'top 95%', end: 'top 35%', scrub: 0.8 },
  }
);
/* ...plus a slower parallax drift across the whole footer (yPercent, so it stacks with the
   entrance's y). It only ever moves down-to-settled, so the bottom edge never lifts off. */
// desktop only - on phones the head must stay tucked under "Let's Collab"
gsap.matchMedia().add('(min-width: 810px)', () => {
  gsap.fromTo('.fp-img', { yPercent: 14 }, {
    yPercent: 0, ease: 'none',
    scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true },
  });
});

/* ---------------------------------------------------------
   Accordions
   --------------------------------------------------------- */
document.querySelectorAll('.accordion').forEach((acc) => {
  acc.querySelectorAll('.acc-head').forEach((head) =>
    head.addEventListener('click', () => {
      const item = head.parentElement;
      const wasOpen = item.classList.contains('open');
      if (acc.hasAttribute('data-single')) acc.querySelectorAll('.acc-item').forEach((i) => i.classList.remove('open'));
      item.classList.toggle('open', !wasOpen);
      if (acc.classList.contains('acc-services') && !wasOpen) {
        const i = [...acc.querySelectorAll('.acc-item')].indexOf(item);
        document.querySelectorAll('.svc-media img').forEach((img, j) => img.classList.toggle('active', j === i));
      }
      setTimeout(() => ScrollTrigger.refresh(), 550);
    })
  );
});

/* ---------------------------------------------------------
   Testimonials slider with progress bar
   --------------------------------------------------------- */
(() => {
  const root = document.getElementById('testi');
  if (!root) return; // home page only
  const wrap = root.closest('.testi-wrap');
  const slides = [...root.querySelectorAll('.testi-slide')];
  const avatars = [...wrap.querySelectorAll('.testi-avatar')];
  const bar = root.querySelector('.testi-bar');
  // one segment per testimonial (Instagram/Facebook-story style), each with its own fill
  bar.innerHTML = slides.map(() => '<span class="testi-seg"><i></i></span>').join('');
  const segs = [...bar.querySelectorAll('.testi-seg > i')];
  let idx = 0, tween;

  function show(n) {
    slides[idx].classList.remove('active');
    avatars[idx]?.classList.remove('active');
    avatars[idx]?.setAttribute('aria-selected', 'false');
    idx = (n + slides.length) % slides.length;
    slides[idx].classList.add('active');
    avatars[idx]?.classList.add('active');
    avatars[idx]?.setAttribute('aria-selected', 'true');
    tween && tween.kill();
    // segments before idx are full, after are empty, current animates 0 -> 100
    segs.forEach((s, i) => gsap.set(s, { scaleX: i < idx ? 1 : 0 }));
    tween = gsap.fromTo(segs[idx], { scaleX: 0 }, {
      scaleX: 1, duration: TESTI_DURATION, ease: 'none', transformOrigin: 'left',
      onComplete: () => show(idx + 1),
    });
  }
  root.querySelectorAll('.testi-nav button').forEach((b) => b.addEventListener('click', () => show(idx + +b.dataset.dir)));
  avatars.forEach((a) => a.addEventListener('click', () => { if (+a.dataset.i !== idx) show(+a.dataset.i); }));
  ScrollTrigger.create({ trigger: root, start: 'top 80%', once: true, onEnter: () => show(0) });

  /* Reaction button: tap to pop a burst of little hearts that float up and fade,
     Facebook/Instagram-story style, plus the heart icon itself does a quick pop. */
  const reactBtn = root.querySelector('.testi-react');
  const countEl = root.querySelector('.testi-react-count');
  let reacted = false, count = +countEl.textContent;
  reactBtn.addEventListener('click', () => {
    const icon = reactBtn.querySelector('svg') || reactBtn.querySelector('i');
    gsap.fromTo(icon, { scale: 1 }, { scale: 1.5, duration: 0.16, ease: 'power2.out', yoyo: true, repeat: 1 });
    reactBtn.classList.toggle('liked', !reacted);
    count += reacted ? -1 : 1; reacted = !reacted;
    countEl.textContent = count; // no TextPlugin loaded, so just set it and let the pop (below) carry the feedback
    gsap.fromTo(countEl, { y: reacted ? 8 : -8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out' });
    // spawn a handful of floating hearts from the button (raw SVG - lucide.createIcons()
    // has no way to target just one node, it rescans the whole document every call)
    const HEART_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
    const n = 6;
    for (let i = 0; i < n; i++) {
      const p = document.createElement('span');
      p.className = 'testi-react-particle';
      p.innerHTML = HEART_SVG;
      reactBtn.appendChild(p);
      const dx = (Math.random() - 0.5) * 50;
      const rot = (Math.random() - 0.5) * 50;
      gsap.fromTo(p, { x: 0, y: 0, opacity: 1, scale: 0.5, rotate: 0 }, {
        x: dx, y: -60 - Math.random() * 30, opacity: 0, scale: 1, rotate: rot,
        duration: 0.9 + Math.random() * 0.4, ease: 'power1.out', delay: i * 0.04,
        onComplete: () => p.remove(),
      });
    }
  });
})();

/* ---------------------------------------------------------
   Archive grid
   --------------------------------------------------------- */
const archive = document.getElementById('archive');
if (archive) archive.innerHTML = ARCHIVE.map((a) => `
  <figure class="arch-item">
    <div class="arch-img"><img src="${a.src}" alt="${a.title}" loading="lazy"></div>
    <figcaption class="arch-cap"><span>${a.title}</span><span>‘${a.year}</span></figcaption>
  </figure>`).join('');
gsap.utils.toArray('.arch-item').forEach((el) =>
  gsap.from(el, { opacity: 0, y: 50, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%' } })
);

/* "Let's Collab" - scale the giant word to exactly fill the content width */
const collab = document.querySelector('.collab');
function fitCollab() {
  collab.style.fontSize = '100px';
  const target = collab.parentElement.clientWidth;
  collab.style.fontSize = `${(100 * target) / collab.scrollWidth}px`;
}
fitCollab();
document.fonts && document.fonts.ready.then(fitCollab);
window.addEventListener('resize', fitCollab);

/* ---------------------------------------------------------
   Tech stack loops - each row drifts forever; scrolling speeds it up and
   flips its direction with your scroll, then it eases back to its idle drift.
   Hovering a row slows it to a crawl so a logo is easy to read.
   --------------------------------------------------------- */
(() => {
  const ICON = (slug) => `https://cdn.jsdelivr.net/npm/simple-icons@13/icons/${slug}.svg`;
  const TECH_ROWS = [
    // languages & backend frameworks
    [['python', 'Python'], ['django', 'Django'], ['fastapi', 'FastAPI'], ['flask', 'Flask'], ['go', 'Go'], ['rust', 'Rust'], ['typescript', 'TypeScript'], ['nodedotjs', 'Node.js'], ['nestjs', 'NestJS'], ['graphql', 'GraphQL']],
    // data, queues & storage
    [['postgresql', 'PostgreSQL'], ['mysql', 'MySQL'], ['mongodb', 'MongoDB'], ['redis', 'Redis'], ['sqlite', 'SQLite'], ['elasticsearch', 'Elasticsearch'], ['apachekafka', 'Kafka'], ['rabbitmq', 'RabbitMQ'], ['celery', 'Celery'], ['prisma', 'Prisma'], ['apachespark', 'Spark'], ['apacheairflow', 'Airflow']],
    // infrastructure, cloud & observability
    [['docker', 'Docker'], ['kubernetes', 'Kubernetes'], ['terraform', 'Terraform'], ['amazonwebservices', 'AWS'], ['googlecloud', 'Google Cloud'], ['nginx', 'Nginx'], ['linux', 'Linux'], ['githubactions', 'GitHub Actions'], ['jenkins', 'Jenkins'], ['ansible', 'Ansible'], ['prometheus', 'Prometheus'], ['grafana', 'Grafana']],
    // ML, clients & product
    [['pytorch', 'PyTorch'], ['tensorflow', 'TensorFlow'], ['pandas', 'Pandas'], ['numpy', 'NumPy'], ['react', 'React'], ['nextdotjs', 'Next.js'], ['swift', 'Swift'], ['kotlin', 'Kotlin'], ['flutter', 'Flutter'], ['figma', 'Figma']],
  ];
  const rows = [...document.querySelectorAll('.stack-row')];
  const loops = rows.map((row, r) => {
    const items = TECH_ROWS[r % TECH_ROWS.length];
    // two icons per chip: monochrome (default) and the real brand colour (shown on hover).
    // If a brand-colour icon isn't available, the chip keeps the monochrome one.
    const chip = ([slug, name], i) => `<span class="chip${(i + r) % 3 === 1 ? ' ghost' : ''}">
      <span class="chip-ico"><img class="ico-mono" src="${ICON(slug)}" alt="" loading="lazy" draggable="false"><img class="ico-color" src="https://cdn.simpleicons.org/${slug}" alt="" loading="lazy" draggable="false" onerror="this.closest('.chip').classList.add('no-color');this.remove()"></span>${name}</span>`;
    const set = items.map(chip).join('');
    row.innerHTML = `<div class="stack-track">${set}${set}${set}</div>`; // 3 copies = seamless wrap
    const track = row.firstElementChild;
    const state = { x: 0, dir: +row.dataset.dir, hover: 1 };
    row.addEventListener('mouseenter', () => gsap.to(state, { hover: 0.15, duration: 0.6, ease: 'power3.out' }));
    row.addEventListener('mouseleave', () => gsap.to(state, { hover: 1, duration: 0.8, ease: 'power3.out' }));
    return { track, state };
  });

  let boost = 0; // extra speed from scrolling, decays back to 0
  let scrollDir = 1;
  const onScroll = (v) => { if (Math.abs(v) > 0.1) { scrollDir = Math.sign(v); boost = Math.min(Math.abs(v) * 0.6, 14); } };
  if (lenis) lenis.on('scroll', (e) => onScroll(e.velocity));
  else { let last = scrollY; addEventListener('scroll', () => { onScroll((scrollY - last) / 8); last = scrollY; }, { passive: true }); }

  gsap.ticker.add((t, dt) => {
    const f = Math.min(dt, 50) / 16.67;
    boost *= 0.94;
    loops.forEach(({ track, state }) => {
      const third = track.scrollWidth / 3;
      const speed = (0.6 + boost) * state.hover * f;
      state.x += speed * state.dir * scrollDir;
      if (state.x <= -third) state.x += third;
      if (state.x > 0) state.x -= third;
      track.style.transform = `translate3d(${state.x}px,0,0)`;
    });
  });

  // rows glide in from opposite sides as the section enters
  gsap.utils.toArray('.stack-row').forEach((row, i) =>
    gsap.from(row, { xPercent: i % 2 ? 12 : -12, opacity: 0, duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: '.stack-rows', start: 'top 85%' }, delay: i * 0.08 }));
})();

/* Recalculate positions once images have loaded */
window.addEventListener('load', () => { fitCollab(); ScrollTrigger.refresh(); });
