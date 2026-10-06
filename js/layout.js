/* ---------------------------------------------------------
   Shared layout for every page.
   Baseline behavior follows developerrafikhan; CMS features are
   additive and fail silently so the portfolio never becomes blocked.
   --------------------------------------------------------- */
(() => {
  const API = 'https://devrafikhanbackend.onrender.com/api';

  const SOCIAL_LINKS = [
    ['GitHub', 'https://github.com/MdRafiKhan738',
      '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 1.3 5.4 1.6 5.4 1.6a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 8c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V19"/>'],
  ];
  const SOCIAL_ICONS = SOCIAL_LINKS.map(([name, url, path]) => `<a href="${url}" target="_blank" rel="noopener" aria-label="${name}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${path}</svg></a>`).join('');
  const SOCIAL_TEXT = SOCIAL_LINKS.map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener" class="flip">${name}</a>`).join('');

  const HEADER = `
  <header class="site-header container">
    <a href="index.html" class="logo">Mohammad <span>Rafi Khan</span></a>
    <div class="header-meta hide-m">
      <span class="muted wx-row"><i class="wx-icon" data-wx aria-hidden="true"></i>Local time</span>
      <span class="clock" data-clock>--:--:-- --</span>
    </div>
    <div class="header-meta hide-m">
      <span class="muted">Based in</span>
      <span>Dhaka, Bangladesh</span>
    </div>
    <nav class="header-nav hide-m">
      <a href="about.html" class="flip">About</a>
      <a href="works.html" class="flip">Works</a>
      <a href="contact.html" class="flip">Contact</a>
      <a href="blog.html" class="flip">Blog</a>
      <a href="resume.html" class="flip">Resume</a>
    </nav>
    <button type="button" class="theme-toggle" id="themeToggle" aria-label="Toggle light and dark mode">◐</button>
    <a href="contact.html" class="btn btn-outline hide-m"><span class="btn-ico"><i data-lucide="arrow-right"></i></span><span class="btn-txt">Start a project</span></a>
    <button class="burger show-m" aria-label="Menu"><i class="burger-lines"><span></span><span></span></i></button>
  </header>

  <div class="mobile-menu" aria-hidden="true">
    <p class="mm-label eyebrow gold"><span class="mm-reveal">Menu</span></p>
    <nav class="mm-links">
      <a href="about.html"><span class="mm-clip"><span class="mm-txt flip">About</span></span><i data-lucide="arrow-up-right" class="mm-arrow"></i></a>
      <a href="works.html"><span class="mm-clip"><span class="mm-txt flip">Works</span></span><i data-lucide="arrow-up-right" class="mm-arrow"></i></a>
      <a href="contact.html"><span class="mm-clip"><span class="mm-txt flip">Contact</span></span><i data-lucide="arrow-up-right" class="mm-arrow"></i></a>
      <a href="blog.html"><span class="mm-clip"><span class="mm-txt flip">Blog</span></span><i data-lucide="arrow-up-right" class="mm-arrow"></i></a>
      <a href="resume.html"><span class="mm-clip"><span class="mm-txt flip">Resume</span></span><i data-lucide="arrow-up-right" class="mm-arrow"></i></a>
    </nav>
    <div class="mm-foot">
      <div class="mm-meta">
        <div><span class="muted wx-row"><i class="wx-icon" data-wx aria-hidden="true"></i>Local time</span><span class="clock" data-clock>--:--:-- --</span></div>
        <div><span class="muted">Based in</span><span>Dhaka, Bangladesh</span></div>
      </div>
      <div class="mm-row">
        <a href="contact.html" class="btn btn-white"><span class="btn-ico"><i data-lucide="arrow-right"></i></span><span class="btn-txt">Start a project</span></a>
        <div class="mm-social">${SOCIAL_ICONS}</div>
      </div>
    </div>
  </div>`;

  const FOOTER = `
    <footer class="footer" id="footer">
      <div class="container footer-inner">
        <p class="meta avail">Available for projects</p>
        <p class="collab gold">Let's Collab</p>
        <div class="footer-portrait">
          <img class="fp-img" src="assets/images/portrait-bw.png" alt="" />
        </div>

        <div class="footer-contact">
          <p class="meta">Mail</p><a href="mailto:nextjs061@gmail.com" data-site-email class="f-big flip">nextjs061@gmail.com</a>
          <p class="meta">WhatsApp/Telegram</p><a href="#" data-site-phone target="_blank" rel="noopener" class="f-big flip">8801989678448</a>
        </div>
        <div class="footer-social">${SOCIAL_TEXT}</div>
        <a href="contact.html" class="btn btn-white footer-btn"><span class="btn-ico"><i data-lucide="arrow-right"></i></span><span class="btn-txt">Start a project</span></a>
        <div class="footer-nav">
          <p class="eyebrow gold">Navigation</p>
          <a href="about.html" class="flip">About</a>
          <a href="works.html" class="flip">Works</a>
          <a href="blog.html" class="flip">Blog</a>
          <a href="contact.html" class="flip">Contact</a>
          <a href="guestbook.html" class="flip">Guestbook</a>
          <a href="resume.html" class="flip">Resume</a>
          <a href="login.html" class="flip">Sign in</a>
          <div class="footer-bottom"><span>©2026 Mohammad Rafi Khan</span><span>All rights reserved</span></div>
        </div>
      </div>
    </footer>`;

  const CALENDLY_URL = 'contact.html';
  const DOCK = `
    <aside class="dock" aria-label="Get in touch">
      <button type="button" class="dock-btn dock-primary" data-calendly="${CALENDLY_URL}">
        <img src="assets/icons/calendly-icon.png" alt="" /><span>Book a meeting</span>
      </button>
      <a href="mailto:nextjs061@gmail.com" class="dock-btn dock-ghost">
        <img src="assets/icons/gmail-icon.png" alt="" /><span>Email me</span><i data-lucide="arrow-up-right" class="dock-arrow"></i>
      </a>
    </aside>`;
  document.body.insertAdjacentHTML('beforeend', DOCK);

  const dock = document.querySelector('.dock-primary');
  if (dock) dock.addEventListener('click', (e) => {
    const url = e.currentTarget.dataset.calendly;
    if (url === 'contact.html') {
      location.href = url;
      return;
    }
    const open = () => window.Calendly?.initPopupWidget?.({ url: `${url}?background_color=12110d&text_color=ffffff&primary_color=006bff` });
    if (window.Calendly) return open();
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(css);
    const js = document.createElement('script');
    js.src = 'https://assets.calendly.com/assets/external/widget.js';
    js.onload = open;
    js.onerror = () => window.open(url, '_blank', 'noopener');
    document.head.appendChild(js);
  });

  const put = (name, markup) => document.querySelectorAll(`[data-layout="${name}"]`).forEach((el) => (el.outerHTML = markup));
  put('header', HEADER);
  put('footer', FOOTER);

  const applyTheme = (light) => {
    document.body.classList.toggle('light', light);
    try { localStorage.setItem('rafi-theme', light ? 'light' : 'dark'); } catch {}
    document.querySelectorAll('#themeToggle').forEach((b) => { b.textContent = light ? '☾' : '◐'; });
  };
  let savedTheme = 'dark';
  try { savedTheme = localStorage.getItem('rafi-theme') || 'dark'; } catch {}
  applyTheme(savedTheme === 'light');
  document.querySelectorAll('#themeToggle').forEach((b) => b.addEventListener('click', () => applyTheme(!document.body.classList.contains('light'))));

  // Local clock is always Dhaka time so auth/guestbook/footer never show a blank clock.
  const tickClock = () => {
    const fmt = new Intl.DateTimeFormat('en-BD', { timeZone: 'Asia/Dhaka', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true });
    const value = fmt.format(new Date());
    document.querySelectorAll('[data-clock]').forEach((el) => { el.textContent = value.replace(/,/g,''); });
  };
  tickClock();
  setInterval(tickClock, 1000);

  const cmsCss = document.createElement('style');
  cmsCss.textContent = '.clock{display:inline-flex!important;visibility:visible!important;opacity:1!important} iconify-icon{display:inline-block;width:1em;height:1em}';
  document.head.appendChild(cmsCss);

  // Repair old/reference asset paths before CMS replacement.
  const IMAGE_FALLBACK = 'assets/images/aboutimg.jpg';
  const pathMap = {
    'assets/images/site/signature.svg': 'assets/images/signature.png',
    'assets/images/site/rafi-signature.svg': 'assets/images/signature.png',
    'assets/images/site/portrait.webp': 'assets/images/portrait-bw.png',
    'assets/images/site/portrait-bw.webp': 'assets/images/portrait-bw.png',
    'assets/images/site/portrait-2.webp': 'assets/images/portrait-2.png',
    'assets/images/site/allworks.webp': 'assets/images/projects/softunebd/hero.webp',
    'assets/images/allworks.webp': 'assets/images/projects/softunebd/hero.webp',
    'assets/images/contact/contact-bg.webp': 'assets/images/contactbg.jpg',
    'assets/images/about/about-hero.webp': 'assets/images/about-bg.jpg',
    'assets/images/about/about-origins.webp': 'assets/images/aboutimg.jpg',
    'assets/images/about/about-vision.webp': 'assets/images/about-bg.jpg',
    'assets/images/site/og.png': 'assets/images/portrait-2.png'
  };
  const projectFallbacks = [
    'assets/images/projects/softunebd/hero.webp',
    'assets/images/projects/zinetic/hero.webp',
    'assets/images/projects/hoteleasy/hero.webp',
    'assets/images/projects/tooltune/hero.webp'
  ];
  let fallbackIndex = 0;

  const localizeReferenceSrc = (src) => {
    if (!src) return src;
    if (src.startsWith('https://raw.githubusercontent.com/MdRafiKhan738/developerrafikhan/main/')) {
      const path = src.split('/main/')[1] || '';
      return pathMap[path] || path;
    }
    return pathMap[src] || src;
  };

  document.querySelectorAll('img[src],video[src],source[src]').forEach((el) => {
    const before = el.getAttribute('src');
    const after = localizeReferenceSrc(before);
    if (after && after !== before) el.setAttribute('src', after);
    if (el.tagName === 'IMG') {
      el.addEventListener('error', () => {
        if (el.dataset.fallbackTried) return;
        el.dataset.fallbackTried = '1';
        el.src = projectFallbacks[fallbackIndex++ % projectFallbacks.length] || IMAGE_FALLBACK;
      });
    }
  });

  const replaceAssets = async () => {
    try {
      const r = await fetch(API + '/assets');
      if (!r.ok) return;
      const d = await r.json();
      const map = new Map((d.assets || []).map((a) => [a.key, a]));
      document.querySelectorAll('img[src],video[src],source[src],image[href]').forEach((el) => {
        const key = el.getAttribute('src') || el.getAttribute('href') || '';
        const a = map.get(key);
        if (a?.url) {
          if (el.hasAttribute('href')) el.setAttribute('href', a.url);
          else el.setAttribute('src', a.url);
        }
      });
      document.querySelectorAll('[data-cms-asset]').forEach((el) => {
        const a = map.get(el.dataset.cmsAsset);
        if (a?.url) el.src = a.url;
      });
    } catch {}
  };

  const loadReviews = async () => {
    const root = document.querySelector('.testi-card');
    if (!root) return;
    try {
      const r = await fetch(API + '/reviews');
      if (!r.ok) return;
      const data = await r.json();
      const reviews = data.reviews || [];
      const slides = root.querySelector('.testi-slides');
      if (slides && reviews.length) {
        const esc = (v) => String(v ?? '').replace(/[&<>"]/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
        slides.innerHTML = reviews.map((x, i) => `<figure class="testi-slide ${i===0?'active':''}"><blockquote>${esc(x.text)}</blockquote><figcaption><img src="${x.image || 'assets/images/avatars/avatar-1.webp'}" alt=""><span class="testi-who"><span class="name">${esc(x.clientName || 'Client')}</span><span class="role">${esc(x.role || '')}${x.company ? ' · ' + esc(x.company) : ''}</span></span></figcaption></figure>`).join('');
      }
      let index = 0;
      const draw = () => {
        const items = [...root.querySelectorAll('.testi-slide')];
        items.forEach((item, i) => item.classList.toggle('active', i === index));
      };
      root.querySelectorAll('.testi-nav button').forEach((b) => {
        b.onclick = () => {
          const items = root.querySelectorAll('.testi-slide');
          if (!items.length) return;
          index = (index + (Number(b.dataset.dir) || 1) + items.length) % items.length;
          draw();
        };
      });
    } catch {}
  };

  const syncReactions = async () => {
    const target = 'homepage';
    try {
      const r = await fetch(API + '/reactions/' + target);
      if (!r.ok) return;
      const data = await r.json();
      document.querySelectorAll('.testi-react-count').forEach((el) => { el.textContent = data.count ?? 0; });
    } catch {}
  };

  replaceAssets();
  loadReviews();
  syncReactions();
  setInterval(syncReactions, 5000);

  document.addEventListener('click', async (event) => {
    const button = event.target.closest?.('.testi-react');
    if (!button) return;
    try {
      const r = await fetch(API + '/reactions/homepage', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ name: (() => { try { return localStorage.getItem('rafi-name') || 'Anonymous visitor'; } catch { return 'Anonymous visitor'; } })() })
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.count !== undefined) {
        const el = button.querySelector('.testi-react-count');
        if (el) el.textContent = data.count;
        button.classList.add('reacted');
      } else if (data.alreadyReacted) {
        button.classList.add('reacted');
      }
    } catch {}
  });

  // Highlight current page in navigation.
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const section = { 'work.html':'works.html', 'post.html':'blog.html' }[here] || here;
  document.querySelectorAll('.header-nav a, .mm-links a, .footer-nav a').forEach((a) => {
    if (a.getAttribute('href') === section) a.setAttribute('aria-current', 'page');
  });
})();