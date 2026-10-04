const API=(document.querySelector('meta[name="api-base"]')?.content||'/api').replace(/\/$/,'');
const token=localStorage.getItem('rafi-token');
if(!token)location.href='login.html';

const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
async function adminApi(path,opt={}){const r=await fetch(API+path,{...opt,headers:{'Content-Type':'application/json',Authorization:'Bearer '+token,...(opt.headers||{})}});const d=await r.json().catch(()=>({}));if(r.status===401||r.status===403){localStorage.removeItem('rafi-token');location.href='login.html';return null}if(!r.ok)throw new Error(d.message||'Request failed');return d}
const tabs=[...document.querySelectorAll('.tab')];
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>tabs.forEach(x=>x.classList.toggle('hide',x.id!==b.dataset.tab)));
document.getElementById('logout').onclick=()=>{localStorage.removeItem('rafi-token');location.href='login.html'};

function readFile(input){return new Promise((resolve,reject)=>{const f=input?.files?.[0];if(!f)return resolve(null);if(!f.type.startsWith('image/'))return reject(new Error('Please choose an image file.'));if(f.size>4*1024*1024)return reject(new Error('Image must be under 4MB.'));const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(f)})}

async function loadAll(){
 const d=await adminApi('/admin/data');
 const projects=d?.projects||[],blogs=d?.blogs||[],messages=d?.messages||[],entries=d?.guestbook||[];
 document.getElementById('projectCount').textContent=projects.length;
 document.getElementById('messageCount').textContent=messages.length;
 document.getElementById('projectItems').innerHTML=projects.map(p=>`<div class="item"><div><strong>${esc(p.title)}</strong><div class="muted">${esc(p.slug)} · ${p.published?'Published':'Draft'} · ${p.featured?'Featured':'Standard'}</div></div><div><button class="btn btn-outline" onclick='editProject(${JSON.stringify(p).replaceAll("'","\\u0027")})'>Edit</button> <button class="btn btn-outline danger" onclick="deleteProject('${esc(p._id)}')">Delete</button></div></div>`).join('');
 document.getElementById('blogItems').innerHTML=blogs.map(b=>`<div class="item"><div><strong>${esc(b.title)}</strong><div class="muted">${esc(b.slug)} · ${b.published?'Published':'Draft'}</div></div><div><button class="btn btn-outline" onclick='editBlog(${JSON.stringify(b).replaceAll("'","\\u0027")})'>Edit</button> <button class="btn btn-outline danger" onclick="deleteBlog('${esc(b._id)}')">Delete</button></div></div>`).join('');
 document.getElementById('messageItems').innerHTML=messages.map(m=>`<div class="item" style="display:block"><strong>${esc(m.name)}</strong> · ${esc(m.email)}<div class="muted" style="margin-top:8px">${esc(m.company||'')} ${esc(m.projectType||'')}</div><p style="margin-top:8px">${esc(m.message)}</p><select class="form-input message-status" data-id="${esc(m._id)}"><option ${m.status==='new'?'selected':''}>new</option><option ${m.status==='read'?'selected':''}>read</option><option ${m.status==='replied'?'selected':''}>replied</option><option ${m.status==='archived'?'selected':''}>archived</option></select></div>`).join('');
 document.getElementById('guestItems').innerHTML=entries.map(g=>`<div class="item"><div><strong>${esc(g.name)}</strong><div class="muted">${esc(g.message)}</div></div><select class="form-input guest-status" data-id="${esc(g._id)}"><option ${g.status==='pending'?'selected':''}>pending</option><option ${g.status==='approved'?'selected':''}>approved</option><option ${g.status==='rejected'?'selected':''}>rejected</option></select></div>`).join('');
 document.querySelectorAll('.message-status').forEach(s=>s.onchange=async()=>{await adminApi('/admin/messages/'+s.dataset.id,{method:'PUT',body:JSON.stringify({status:s.value})})});
 document.querySelectorAll('.guest-status').forEach(s=>s.onchange=async()=>{await adminApi('/admin/guestbook/'+s.dataset.id,{method:'PUT',body:JSON.stringify({status:s.value})})});
}

window.editProject=p=>{const f=document.getElementById('projectForm');f.reset();Object.keys(p).forEach(k=>{if(f.elements[k])f.elements[k].value=Array.isArray(p[k])?p[k].join(', '):p[k]??''});f.elements.id.value=p._id||'';document.querySelector('[data-tab="projects"]')?.click()};
window.deleteProject=async id=>{if(confirm('Delete project?')){await adminApi('/admin/projects/'+id,{method:'DELETE'});await loadAll()}};
document.getElementById('newProject').onclick=()=>{document.getElementById('projectForm').reset();document.getElementById('projectForm').elements.id.value=''};

document.getElementById('projectForm').onsubmit=async e=>{
 e.preventDefault();const f=e.target;try{const image=await readFile(document.getElementById('projectImageFile'));const body={title:f.title.value,slug:f.slug.value,category:f.category.value,year:f.year.value,summary:f.summary.value,description:f.description.value,fullDescription:f.fullDescription.value,heroImage:image||f.heroImage.value,liveUrl:f.liveUrl.value,githubUrl:f.githubUrl.value,tags:f.tags.value.split(',').map(x=>x.trim()).filter(Boolean),published:true};const id=f.id.value;await adminApi('/admin/projects'+(id?'/'+id:''),{method:id?'PUT':'POST',body:JSON.stringify(body)});f.reset();await loadAll()}catch(err){alert(err.message)}};

window.editBlog=b=>{const f=document.getElementById('blogForm');f.reset();f.elements.id.value=b._id||'';f.elements.title.value=b.title||'';f.elements.slug.value=b.slug||'';f.elements.category.value=b.category||'';f.elements.coverImage.value=b.coverImage||'';f.elements.excerpt.value=b.excerpt||'';f.elements.content.value=b.content||'';f.elements.published.checked=!!b.published;document.querySelector('[data-tab="blogs"]')?.click()};
window.deleteBlog=async id=>{if(confirm('Delete post?')){await adminApi('/admin/blogs/'+id,{method:'DELETE'});await loadAll()}};
document.getElementById('blogForm').onsubmit=async e=>{e.preventDefault();const f=e.target;try{const cover=await readFile(document.getElementById('blogCoverFile'));const body={title:f.title.value,slug:f.slug.value,category:f.category.value,coverImage:cover||f.coverImage.value,excerpt:f.excerpt.value,content:f.content.value,published:f.published.checked};const id=f.id.value;await adminApi('/admin/blogs'+(id?'/'+id:''),{method:id?'PUT':'POST',body:JSON.stringify(body)});f.reset();await loadAll()}catch(err){alert(err.message)}};

async function loadSite(){
 const r=await adminApi('/site');const s=r?.site||{};const socials=s.socials||{};
 document.getElementById('siteForm').innerHTML=
 [['name','Name',s.name],['role','Role',s.role],['email','Email',s.email],['phone','Phone',s.phone],['location','Location',s.location],['signature','Signature',s.signature]].map(([k,l,v])=>`<label class="muted">${l}<input class="form-input" name="${k}" value="${esc(v)}"></label>`).join('')+
 [['github','GitHub',socials.github],['linkedin','LinkedIn',socials.linkedin],['facebook','Facebook',socials.facebook],['whatsapp','WhatsApp',socials.whatsapp],['x','X',socials.x],['youtube','YouTube',socials.youtube]].map(([k,l,v])=>`<label class="muted">${l}<input class="form-input" name="${k}" value="${esc(v)}"></label>`).join('')+
 `<label class="muted">Tech stack<input class="form-input" name="stack" value="${esc((s.stack||[]).join(', '))}"></label>
 <label class="muted">Hero portrait<input class="form-input" type="file" id="sitePortrait" accept="image/*"></label>
 <label class="muted">Color portrait<input class="form-input" type="file" id="sitePortraitColor" accept="image/*"></label>
 <label class="muted">Collab portrait<input class="form-input" type="file" id="siteCollab" accept="image/*"></label>
 <label class="muted">Signature image<input class="form-input" type="file" id="siteSignature" accept="image/*"></label>
 <button class="btn btn-white">Save content</button>`;
}
document.getElementById('siteForm').onsubmit=async e=>{
 e.preventDefault();const f=e.target;
 try{
  const [portraitImage,portraitColorImage,collabImage,signatureImage]=await Promise.all([readFile(document.getElementById('sitePortrait')),readFile(document.getElementById('sitePortraitColor')),readFile(document.getElementById('siteCollab')),readFile(document.getElementById('siteSignature'))]);
  const current=(await adminApi('/site'))?.site||{};const socials=current.socials||{};
  const body={name:f.name.value,role:f.role.value,email:f.email.value,phone:f.phone.value,location:f.location.value,signature:f.signature.value,socials:{...socials,github:f.github.value,linkedin:f.linkedin.value,facebook:f.facebook.value,whatsapp:f.whatsapp.value,x:f.x.value,youtube:f.youtube.value},stack:f.stack.value.split(',').map(x=>x.trim()).filter(Boolean)};
  if(portraitImage)body.portraitImage=portraitImage;
  if(portraitColorImage)body.portraitColorImage=portraitColorImage;
  if(collabImage)body.collabImage=collabImage;
  if(signatureImage)body.signatureImage=signatureImage;
  await adminApi('/admin/site',{method:'PUT',body:JSON.stringify(body)});await loadSite();alert('Site settings saved.');
 }catch(err){alert(err.message)}
};
document.getElementById('siteForm').addEventListener('submit',()=>{},true);
(async()=>{try{await loadAll();await loadSite()}catch(err){console.error(err)}})();
