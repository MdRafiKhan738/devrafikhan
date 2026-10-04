(async()=>{
  const slug=new URLSearchParams(location.search).get('slug');
  const r=slug?await api('/projects/'+encodeURIComponent(slug)):null;
  const p=r?.project;
  const root=document.getElementById('projectDetail');
  if(!p){if(root)root.innerHTML='<h1>Project not found.</h1>';return}
  document.title=(p.seoTitle||p.title)+' — Mohammad Rafi Khan';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const list=(items)=>items?.length?`<ul class="detail-list">${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'';
  root.innerHTML=`
  <div class="browser-showcase project-detail-shell">
    <div class="browser-top"><span></span><span></span><span></span><div>${esc(p.liveUrl||p.slug)}</div></div>
    <div class="browser-body project-detail-top">
      <div>${p.heroImage?`<img class="detail-hero-image" src="${esc(p.heroImage)}" alt="${esc(p.title)}"/>`:''}${(p.gallery||[]).map(x=>`<img class="detail-gallery-image" src="${esc(x)}" alt="${esc(p.title)}" loading="lazy"/>`).join('')}</div>
      <div class="browser-copy"><span class="eyebrow">${esc(p.category||'Project')} · ${esc(p.year||'')}</span><h3>${esc(p.title)}</h3><p>${esc(p.description||p.summary||'')}</p>
        <div class="tag-list">${(p.tags||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>
        <div class="detail-actions">${p.liveUrl&&p.liveUrl!=='#'?`<a class="btn btn-white" href="${esc(p.liveUrl)}" target="_blank" rel="noreferrer noopener">Live demo ↗</a>`:''}${p.githubUrl?`<a class="btn btn-outline" href="${esc(p.githubUrl)}" target="_blank" rel="noreferrer noopener">GitHub ↗</a>`:''}</div>
      </div>
    </div>
  </div>
  <div class="detail-copy">
    ${p.overview?`<section><span class="eyebrow">Overview</span><p>${esc(p.overview)}</p></section>`:''}
    ${p.challenge?`<section><span class="eyebrow">Challenge</span><p>${esc(p.challenge)}</p></section>`:''}
    ${p.solution?`<section><span class="eyebrow">Solution</span><p>${esc(p.solution)}</p></section>`:''}
    ${p.features?.length?`<section><span class="eyebrow">Features</span>${list(p.features)}</section>`:''}
    ${p.results?.length?`<section><span class="eyebrow">Results</span>${list(p.results)}</section>`:''}
    ${p.fullDescription&&!p.overview&&!p.solution?`<section><span class="eyebrow">Details</span><p>${esc(p.fullDescription)}</p></section>`:''}
  </div>`;
})();
