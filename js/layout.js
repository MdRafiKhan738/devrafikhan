/* ---------------------------------------------------------
   Shared layout: header, mobile menu and footer for EVERY page.
   Edit them here once; each page just has
   <div data-layout="header"></div> and <div data-layout="footer"></div>.
   This file must load before js/main.js.
   --------------------------------------------------------- */
(() => {
  // Real social profiles, used in both the mobile-menu icon row and the footer text list.
  const SOCIAL_LINKS = [
    ['Facebook', 'https://github.com/MdRafiKhan738',
      '<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M15 8h-1.5A2.5 2.5 0 0 0 11 10.5V12H9v3h2v6h3v-6h2.2l.3-3H14v-1.2c0-.44.36-.8.8-.8H15Z"/>'],
    ['GitHub', 'https://github.com/MdRafiKhan738',
      '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 1.3 5.4 1.6 5.4 1.6a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 8c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V19"/>'],
    ['X', 'https://github.com/MdRafiKhan738', '<path d="M4 4l11.733 16h4.267l-11.733-16z"/><path d="M4 20l6.768-6.768m2.46-2.46L20 4"/>'],
    ['LinkedIn', 'https://github.com/MdRafiKhan738',
      '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>'],
  ];
  const SOCIAL_ICONS = SOCIAL_LINKS.map(([name, url, path]) => `<a href="${url}" target="_blank" rel="noopener" aria-label="${name}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${path}</svg></a>`).join('');
  const SOCIAL_TEXT = SOCIAL_LINKS.map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener" class="flip">${name}</a>`).join('');

  const HEADER = `
  <!-- ============ HEADER ============ -->
  <header class="site-header container">
    <a href="index.html" class="logo">Rafi <span>Hasan</span></a>
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
    </nav>
    <button type="button" class="theme-toggle hide-m" id="themeToggle" aria-label="Toggle light and dark mode">◐</button>
    <a href="contact.html" class="btn btn-outline hide-m"><span class="btn-ico"><i data-lucide="arrow-right"></i></span><span class="btn-txt">Start a project</span></a>
    <button type="button" class="theme-toggle show-m" id="themeToggleMobile" aria-label="Toggle light and dark mode">◐</button>
    <button class="burger show-m" aria-label="Menu"><i class="burger-lines"><span></span><span></span></i></button>
  </header>
  <!-- Mobile menu: animated by a GSAP timeline in js/main.js -->
  <div class="mobile-menu" aria-hidden="true">
    <p class="mm-label eyebrow gold"><span class="mm-reveal">Menu</span></p>
    <nav class="mm-links">
      <a href="about.html"><span class="mm-clip"><span class="mm-txt flip">About</span></span><i data-lucide="arrow-up-right" class="mm-arrow"></i></a>
      <a href="works.html"><span class="mm-clip"><span class="mm-txt flip">Works</span></span><i data-lucide="arrow-up-right" class="mm-arrow"></i></a>
      <a href="contact.html"><span class="mm-clip"><span class="mm-txt flip">Contact</span></span><i data-lucide="arrow-up-right" class="mm-arrow"></i></a>
      <a href="blog.html"><span class="mm-clip"><span class="mm-txt flip">Blog</span></span><i data-lucide="arrow-up-right" class="mm-arrow"></i></a>
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
  </div>
`;

  const FOOTER = `
    <!-- ============ FOOTER / CONTACT ============ -->
    <footer class="footer" id="footer">
      <div class="container footer-inner">
        <p class="meta avail">Available for projects</p>
        <p class="collab gold">Let's Collab</p>
        <div class="footer-portrait"><img class="fp-img" src="https://raw.githubusercontent.com/MdRafiKhan738/developerrafikhan/main/assets/images/site/portrait-bw.webp" alt="" /></div>

        <div class="footer-contact">
          <p class="meta">Mail</p><a href="#" data-site-email class="f-big flip">Email</a>
          <p class="meta">WhatsApp/Telegram</p><a href="#" data-site-phone target="_blank" rel="noopener" class="f-big flip">+88 01831-624571</a>
        </div>
        <div class="footer-social">${SOCIAL_TEXT}</div>
        <a href="contact.html" class="btn btn-white footer-btn"><span class="btn-ico"><i data-lucide="arrow-right"></i></span><span class="btn-txt">Start a project</span></a>
        <div class="footer-nav">
          <p class="eyebrow gold">Navigation</p>
          <a href="about.html" class="flip">About</a><a href="works.html" class="flip">Works</a><a href="blog.html" class="flip">Blog</a><a href="contact.html" class="flip">Contact</a><a href="guestbook.html" class="flip">Guestbook</a><a href="login.html" class="flip">Sign in</a>
          <div class="footer-bottom"><span>©2026 Mohammad Rafi Khan</span><span>All rights reserved</span></div>
        </div>
      </div>
    </footer>
`;

  // floating "book a call / email" card, bottom-right on every page
  const CALENDLY_URL = 'https://calendly.com/';
  const DOCK = `
  <aside class="dock" aria-label="Get in touch">
    <button type="button" class="dock-btn dock-primary" data-calendly="${CALENDLY_URL}">
      <img src="https://raw.githubusercontent.com/MdRafiKhan738/developerrafikhan/main/assets/icons/calendly-icon.png" alt="" /><span>Book a meeting</span>
    </button>
    <a href="mailto:rafi@webin.agency" class="dock-btn dock-ghost">
      <img src="https://raw.githubusercontent.com/MdRafiKhan738/developerrafikhan/main/assets/icons/gmail-icon.png" alt="" /><span>Email me</span><i data-lucide="arrow-up-right" class="dock-arrow"></i>
    </a>
  </aside>`;
  document.body.insertAdjacentHTML('beforeend', DOCK);
  // opens Calendly as a popup over the page (loads Calendly's script on first click);
  // falls back to a new tab if the script can't load
  document.querySelector('.dock-primary').addEventListener('click', (e) => {
    const url = e.currentTarget.dataset.calendly;
    const open = () => window.Calendly.initPopupWidget({ url: `${url}?background_color=12110d&text_color=ffffff&primary_color=006bff` });
    if (window.Calendly) return open();
    const css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = 'https://assets.calendly.com/https://raw.githubusercontent.com/MdRafiKhan738/developerrafikhan/main/assets/external/widget.css';
    document.head.appendChild(css);
    const js = document.createElement('script');
    js.src = 'https://assets.calendly.com/https://raw.githubusercontent.com/MdRafiKhan738/developerrafikhan/main/assets/external/widget.js';
    js.onload = open;
    js.onerror = () => window.open(url, '_blank', 'noopener');
    document.head.appendChild(js);
  });

  const put = (name, markup) => document.querySelectorAll(`[data-layout="${name}"]`).forEach((el) => (el.outerHTML = markup));
  put('header', HEADER);
  put('footer', FOOTER);

  const applyTheme = (light) => { document.body.classList.toggle("light", light); localStorage.setItem("rafi-theme", light ? "light" : "dark"); document.querySelectorAll("#themeToggle,#themeToggleMobile").forEach(b => b.textContent = light ? "☾" : "◐"); }; applyTheme(localStorage.getItem("rafi-theme")==="light"); document.querySelectorAll("#themeToggle,#themeToggleMobile").forEach(b => b.addEventListener("click",()=>applyTheme(!document.body.classList.contains("light"))));
  // highlight the current page in the navigation
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const section = { 'work.html': 'works.html', 'post.html': 'blog.html' }[here] || here;
  document.querySelectorAll('.header-nav a, .mm-links a, .footer-nav a').forEach((a) => {
    if (a.getAttribute('href') === section) a.setAttribute('aria-current', 'page');
  });
})();

<script>/* runtime site contact */fetch("https://devrafikhanbackend.onrender.com/api/site").then(r=>r.json()).then(({site})=>{document.querySelectorAll("[data-site-email]").forEach(e=>{e.textContent=site?.email||"Email";e.href=site?.email?"mailto:"+site.email:"#"});document.querySelectorAll("[data-site-phone]").forEach(e=>{e.textContent=site?.phone||"";e.href=site?.phone?"https://wa.me/"+site.phone.replace(/\D/g,""):"#"});}).catch(()=>{});</script>
