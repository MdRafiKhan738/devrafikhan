(async()=>{
  const site=(await api('/site'))?.site||{};
  const email=document.getElementById('directEmail');
  const phone=document.getElementById('directPhone');
  const name=document.querySelector('.browser-showcase h3');
  const location=document.querySelector('.browser-showcase .muted');
  if(name&&site.name)name.textContent=site.name;
  if(location&&site.location)location.textContent=site.location;
  if(email&&site.email){email.href=`mailto:${site.email}`;email.textContent=site.email}
  if(phone&&site.phone){phone.href=`tel:${String(site.phone).replace(/\s+/g,'')}`;phone.textContent=site.phone}
})();
const form=document.getElementById('contactForm');
form?.addEventListener('submit',async e=>{e.preventDefault();const status=document.getElementById('contactStatus');status.textContent='Sending…';const body=Object.fromEntries(new FormData(form));body.website='';const r=await api('/contact',{method:'POST',body:JSON.stringify(body)});if(r?.success){status.textContent='Message sent. Thank you — I will get back to you soon.';form.reset()}else status.textContent=r?.message||'Could not send right now. Please email me directly.'});
