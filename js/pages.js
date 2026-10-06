/* ---------------------------------------------------------
   Inner-page behaviour (About, Works, Contact, Blog, project, post).
   Loads after main.js, so gsap, ScrollTrigger, lenis, reduced and countUp exist.
   --------------------------------------------------------- */
const API_BASE = 'https://devrafikhanbackend.onrender.com/api';
const CONTACT_EMAIL = 'nextjs061@gmail.com';

/* Page intro: the top-of-page text blurs up in sequence (same feel as the home hero) */
gsap.fromTo('.hero-in',
  { y: 60, opacity: 0, filter: 'blur(10px)' },
  { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out', stagger: 0.1, delay: 0.15, clearProps: 'filter' });

/* Full-bleed hero backgrounds drift against the page - aggressive, not subtle
   (the home hero portrait and the footer portrait are the only parallax left at the old, gentler pace) */
gsap.utils.toArray('.p-hero-bg img, .vision-bg img').forEach((img) =>
  gsap.fromTo(img, { yPercent: -16 }, { yPercent: 16, ease: 'none',
    scrollTrigger: { trigger: img.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } }));

/* About hero: layered depth - the background drifts one way, the text drifts the other,
   each line a little faster than the one before it, so the block itself feels three-dimensional */
gsap.utils.toArray('.about-hero-inner > *').forEach((el, i) =>
  gsap.to(el, { yPercent: -22 - i * 8, ease: 'none',
    scrollTrigger: { trigger: '.about-hero', start: 'top top', end: 'bottom top', scrub: true } }));

/* Counters (project stats) */
document.querySelectorAll('.detail-stats .count').forEach((el) =>
  ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => countUp(el) }));

/* ---------------- About: experience rows ----------------
   Each row's divider draws across and the row brightens as it reaches the middle of the screen. */
gsap.utils.toArray('.job').forEach((job) => {
  gsap.fromTo(job, { '--p': 0, opacity: 0.25 }, {
    '--p': 1, opacity: 1, ease: 'none',
    scrollTrigger: { trigger: job, start: 'top 85%', end: 'top 45%', scrub: true },
  });
});

/* ---------------- About: origins portrait parallax ---------------- */
gsap.utils.toArray('.origins-img img').forEach((img) =>
  gsap.fromTo(img, { yPercent: -22 }, { yPercent: 4, ease: 'none',
    scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));

/* ---------------- About: "Beyond The Screens" ----------------
   The title stays pinned (CSS sticky) while photos rise past it at different speeds. */
gsap.utils.toArray('.bp').forEach((img) => {
  const speed = +img.dataset.speed || 1;
  gsap.fromTo(img, { y: 260 * speed }, { y: -420 * speed, ease: 'none',
    scrollTrigger: { trigger: '.beyond', start: 'top bottom', end: 'bottom top', scrub: true } });
});

/* ---------------- Works: category filter ---------------- */
(() => {
  const bar = document.querySelector('.filters');
  if (!bar) return;
  const line = bar.querySelector('.filter-line');
  const cards = [...document.querySelectorAll('.works-filterable .work-card')];
  const moveLine = (btn) => { line.style.left = `${btn.offsetLeft - 16}px`; line.style.width = `${btn.offsetWidth + 32}px`; };
  const apply = (btn) => {
    bar.querySelectorAll('.filter').forEach((b) => b.classList.toggle('active', b === btn));
    moveLine(btn);
    const f = btn.dataset.filter;
    const show = cards.filter((c) => f === 'all' || c.dataset.cats.split(' ').includes(f));
    // fade out, swap, fade the survivors back in one after another
    gsap.to(cards, { opacity: 0, y: 20, duration: 0.25, ease: 'power2.in', onComplete: () => {
      cards.forEach((c) => c.classList.toggle('is-hidden', !show.includes(c)));
      gsap.fromTo(show, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.07 });
      ScrollTrigger.refresh();
    } });
  };
  bar.querySelectorAll('.filter').forEach((b) => b.addEventListener('click', () => apply(b)));
  moveLine(bar.querySelector('.filter.active'));
  addEventListener('resize', () => moveLine(bar.querySelector('.filter.active')));
  gsap.from(cards, { opacity: 0, y: 40, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 0.4 });
})();

/* ---------------- Works: "Other Projects" list - hover shows a floating preview image ----------------
   Positioned directly on mousemove (no rAF loop - rAF can stall/throttle
   unpredictably), with the easing done declaratively via a CSS transition
   on left/top instead. */
(() => {
  const preview = document.getElementById('plist-preview');
  if (!preview) return;
  const img = document.getElementById('plist-preview-img');
  const rows = [...document.querySelectorAll('.plist-row[data-img]')];

  function moveTo(e) {
    preview.style.left = `${e.clientX}px`;
    preview.style.top = `${e.clientY}px`;
  }

  rows.forEach((row) => {
    row.addEventListener('mouseenter', (e) => {
      img.src = row.dataset.img;
      moveTo(e);
      preview.classList.add('on');
    });
    row.addEventListener('mousemove', moveTo);
    row.addEventListener('mouseleave', () => {
      preview.classList.remove('on');
    });
  });
})();

/* ---------------- Contact: form opens the visitor's email app ---------------- */
(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const msg = form.querySelector('.form-msg');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    if (!d.name.trim() || !d.message.trim() || !/^\S+@\S+\.\S+$/.test(d.email)) {
      msg.textContent = 'Please fill in your name, a valid email and a short message.';
      return;
    }    try {
      const r = await fetch(API_BASE + '/contact', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({name:d.name,email:d.email,message:d.message})
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.message || 'Unable to send');
      msg.textContent = 'Your message was sent successfully. I’ll get back to you soon.';
      form.reset();
    } catch(error) {
      msg.textContent = 'Unable to send right now. Please email me directly at ' + CONTACT_EMAIL + '.';
    }
  });
})();

/* ---------------- Blog: dynamic latest posts ---------------- */
(async()=>{
  const grid=document.querySelector('.post-grid');
  if(!grid) return;
  try{
    const r=await fetch(API_BASE+'/blogs');
    if(!r.ok) return;
    const d=await r.json();
    const posts=d.blogs||[];
    if(!posts.length) return;
    const esc=v=>String(v??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
    grid.innerHTML=posts.map((p,i)=>`<a href="post.html?slug=${encodeURIComponent(p.slug)}" class="post-card reveal">
      <div class="post-img"><img src="${esc(p.coverImage||'assets/images/projects/softunebd/hero.webp')}" alt="${esc(p.title)}" loading="${i<2?'eager':'lazy'}"></div>
      <p class="meta">${esc(p.category||'Insight')} <span class="slash">/</span> ${new Date(p.publishedAt||p.createdAt).toLocaleDateString()}</p>
      <h3 class="h3">${esc(p.title)}</h3>
      <p class="body-s" style="margin-top:10px">${esc(p.excerpt||'')}</p>
    </a>`).join('');
    gsap.utils.toArray('.post-card.reveal').forEach(el=>gsap.from(el,{opacity:0,y:30,duration:.8,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));
    ScrollTrigger.refresh();
  }catch{}
})();

/* recalc once images have sized the page */
addEventListener('load', () => ScrollTrigger.refresh());
