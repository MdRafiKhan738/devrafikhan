/* ---------------------------------------------------------
   Shared layout: header, mobile menu and footer for EVERY page.
   Edit them here once; each page just has
   <div data-layout="header"></div> and <div data-layout="footer"></div>.
   This file must load before js/main.js.
   --------------------------------------------------------- */
(() => {
  // Real social profiles, used in both the mobile-menu icon row and the footer text list.
  const SOCIAL_LINKS = [
    ['GitHub', 'https://github.com/MdRafiKhan738',
      '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 1.3 5.4 1.6 5.4 1.6a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 8c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V19"/>'],
  ];
  const SOCIAL_ICONS = SOCIAL_LINKS.map(([name, url, path]) => `<a href="${url}" target="_blank" rel="noopener" aria-label="${name}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${path}</svg></a>`).join('');
  const SOCIAL_TEXT = SOCIAL_LINKS.map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener" class="flip">${name}</a>`).join('');

  const HEADER = `
  <!-- ============ HEADER ============ -->
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
      <a href="blog.html" class="flip">Blog</a><a href="resume.html" class="flip">Resume</a>
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
        <div class="footer-portrait"><img class="fp-img" src="assets/images/rafi-portrait.webp" alt="" /></div>

        <div class="footer-contact">
          <p class="meta">Mail</p><a href="#" data-site-email class="f-big flip">NextJS061@gmail.com</a>
          <p class="meta">WhatsApp/Telegram</p><a href="#" data-site-phone target="_blank" rel="noopener" class="f-big flip">+88 01831-624571</a>
        </div>
        <div class="footer-social">${SOCIAL_TEXT}</div>
        <a href="contact.html" class="btn btn-white footer-btn"><span class="btn-ico"><i data-lucide="arrow-right"></i></span><span class="btn-txt">Start a project</span></a>
        <div class="footer-nav">
          <p class="eyebrow gold">Navigation</p>
          <a href="about.html" class="flip">About</a><a href="works.html" class="flip">Works</a><a href="blog.html" class="flip">Blog</a><a href="contact.html" class="flip">Contact</a><a href="guestbook.html" class="flip">Guestbook</a><a href="resume.html" class="flip">Resume</a><a href="login.html" class="flip">Sign in</a>
          <div class="footer-bottom"><span>©2026 Mohammad Rafi Khan</span><span>All rights reserved</span></div>
        </div>
      </div>
    </footer>
`;

  // floating "book a call / email" card, bottom-right on every page
  const CALENDLY_URL = 'contact.html';
  const DOCK = `
  <aside class="dock" aria-label="Get in touch">
    <button type="button" class="dock-btn dock-primary" data-calendly="${CALENDLY_URL}">
      <img src="assets/icons/calendly-icon.png" alt="" /><span>Book a meeting</span>
    </button>
    <a href="mailto:NextJS061@gmail.com" class="dock-btn dock-ghost">
      <img src="assets/icons/gmail-icon.png" alt="" /><span>Email me</span><i data-lucide="arrow-up-right" class="dock-arrow"></i>
    </a>
  </aside>`;
  document.body.insertAdjacentHTML('beforeend', DOCK);
  // opens Calendly as a popup over the page (loads Calendly's script on first click);
  // falls back to a new tab if the script can't load
  document.querySelector('.dock-primary').addEventListener('click', (e) => {
    const url = e.currentTarget.dataset.calendly; if (url === 'contact.html') return (location.href = url);
    const open = () => window.Calendly.initPopupWidget({ url: `${url}?background_color=12110d&text_color=ffffff&primary_color=006bff` });
    if (window.Calendly) return open();
    const css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = 'https://assets.calendly.com/assets/external/widget.css';
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
    localStorage.setItem('rafi-theme', light ? 'light' : 'dark');
    document.querySelectorAll('#themeToggle,#themeToggleMobile').forEach((b) => { b.textContent = light ? '☾' : '◐'; });
  };
  applyTheme(localStorage.getItem('rafi-theme') === 'light');
  document.querySelectorAll('#themeToggle,#themeToggleMobile').forEach((b) => b.addEventListener('click', () => applyTheme(!document.body.classList.contains('light'))));
  fetch('https://devrafikhanbackend.onrender.com/api/site').then(r => r.json()).then(({site}) => {
    document.querySelectorAll('[data-site-email]').forEach((el) => { const email = site?.email || 'nextjs061@gmail.com'; el.textContent = email; if (el.tagName === 'A') el.href = email ? 'mailto:' + email : '#'; });
    document.querySelectorAll('[data-site-phone]').forEach((el) => { const phone = site?.phone || ''; el.textContent = phone; if (el.tagName === 'A') el.href = phone ? 'https://wa.me/' + phone.replace(/\D/g,'') : '#'; });
  }).catch(() => {});
  // CMS runtime: local time, dynamic media, reviews/reactions.
  const API='https://devrafikhanbackend.onrender.com/api';
  const tickClock=()=>document.querySelectorAll('[data-clock]').forEach(el=>{const d=new Date();let h=d.getHours(),m=d.getMinutes(),s=d.getSeconds();const ap=h>=12?'PM':'AM';h=h%12||12;el.textContent=`${String(h).padStart(2,'0')} : ${String(m).padStart(2,'0')} : ${String(s).padStart(2,'0')} ${ap}`;});
  tickClock();setInterval(tickClock,1000);
  const cmsCss=document.createElement('style');cmsCss.textContent='.clock{display:inline-block!important;visibility:visible!important;opacity:1!important}iconify-icon{display:inline-block;width:1em;height:1em}';document.head.appendChild(cmsCss);
  const replaceAssets=async()=>{try{const r=await fetch(API+'/assets');const d=await r.json();const map=new Map((d.assets||[]).map(a=>[a.key,a]));document.querySelectorAll('img[src],video[src],source[src]').forEach(el=>{const a=map.get(el.getAttribute('src')||'');if(a?.url)el.setAttribute('src',a.url)});document.querySelectorAll('[data-cms-asset]').forEach(el=>{const a=map.get(el.dataset.cmsAsset);if(a?.url)el.src=a.url})}catch{}};
  replaceAssets();
  const loadReviews=async()=>{const root=document.querySelector('.testi-card');if(!root)return;try{const r=await fetch(API+'/reviews');const reviews=r.reviews||[];const slides=root.querySelector('.testi-slides');if(slides&&reviews.length){slides.innerHTML=reviews.map((x,i)=>{const safe=String(x.text||'').replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));return `<figure class="testi-slide ${i===0?'active':''}"><blockquote>${safe}</blockquote><figcaption><img src="${x.image||'assets/images/avatars/avatar-1.webp'}" alt=""><span class="testi-who"><span class="name">${String(x.clientName||'Client')}</span><span class="role">${String(x.role||'')} ${x.company?'· '+String(x.company):''}</span></span></figcaption></figure>`}).join('')}}
    let index=0;const draw=()=>{const items=[...root.querySelectorAll('.testi-slide')];items.forEach((x,i)=>x.classList.toggle('active',i===index));};root.querySelectorAll('.testi-nav button').forEach(b=>b.onclick=()=>{const items=root.querySelectorAll('.testi-slide');if(!items.length)return;index=(index+(Number(b.dataset.dir)||1)+items.length)%items.length;draw()});
  }catch{}};
  loadReviews();
  const reactionTarget='homepage',reactionCount=async()=>{try{const r=await fetch(API+'/reactions/'+reactionTarget);const el=document.querySelector('.testi-react-count');if(el&&r.ok){const d=await r.json();el.textContent=d.count}}catch{}};
  reactionCount();setInterval(reactionCount,5000);
  document.addEventListener('click',async e=>{const b=e.target.closest('.testi-react');if(!b)return;try{const r=await fetch(API+'/reactions/'+reactionTarget,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:localStorage.getItem('rafi-name')||'Anonymous visitor'})});const d=await r.json();if(r.ok&&d.count!==undefined){const el=b.querySelector('.testi-react-count');if(el)el.textContent=d.count}else if(d.alreadyReacted)b.classList.add('reacted')}catch{}});
  // highlight the current page in the navigation
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const section = { 'work.html': 'works.html', 'post.html': 'blog.html' }[here] || here;
  document.querySelectorAll('.header-nav a, .mm-links a, .footer-nav a').forEach((a) => {
    if (a.getAttribute('href') === section) a.setAttribute('aria-current', 'page');
  });
})();
