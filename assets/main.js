const $=id=>document.getElementById(id);
const q=(s,r=document)=>[...r.querySelectorAll(s)];
if($('yr'))$('yr').textContent=new Date().getFullYear();

// contact form (Formspree, no page reload)
if($('cf'))$('cf').addEventListener('submit',async e=>{
 e.preventDefault();const f=e.target,n=$('note');n.textContent='Sending…';
 try{const r=await fetch(f.action,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'}});
  if(r.ok){f.reset();n.textContent='Thank you. I’ll get back to you soon.'}else throw 0}
 catch(_){n.innerHTML='Something went wrong. Please email <a href="mailto:reshmabdul07@gmail.com" style="text-decoration:underline">reshmabdul07@gmail.com</a>.'}
});

// close mobile menu after tapping a link
q('#menu a').forEach(a=>a.addEventListener('click',()=>$('menu').classList.remove('open')));

// Google Analytics 4: paste your Measurement ID (looks like G-XXXXXXXXXX) between the quotes
const GA_ID='';
if(GA_ID){const g=document.createElement('script');g.async=true;g.src='https://www.googletagmanager.com/gtag/js?id='+GA_ID;document.head.appendChild(g);
window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',GA_ID)}

/* ===================== MOTION GRAPHICS ===================== */
(function(){
const root=document.documentElement;
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
if(reduce||!('IntersectionObserver' in window)||!root.classList.contains('js'))return;

const BOOT=root.classList.contains('intro')?2.0:0.7;   // first-screen items wait for the curtain
let booted=false;setTimeout(()=>{booted=true},150);

/* split a heading into words for the rise-up reveal */
function split(el){
 el.setAttribute('aria-label',el.textContent.replace(/\s+/g,' ').trim());
 let i=0;
 (function walk(n){
  [...n.childNodes].forEach(c=>{
   if(c.nodeType===3){
    const f=document.createDocumentFragment();
    c.textContent.split(/(\s+)/).forEach(t=>{
     if(!t)return;
     if(/^\s+$/.test(t)){f.appendChild(document.createTextNode(' '));return}
     const w=document.createElement('span');w.className='w';
     const x=document.createElement('span');x.className='wi';x.textContent=t;x.style.setProperty('--i',i++);
     w.appendChild(x);f.appendChild(w);
    });
    c.replaceWith(f);
   }else if(c.nodeType===1&&c.tagName!=='BR')walk(c);
  });
 })(el);
}

const io=new IntersectionObserver(es=>es.forEach(e=>{
 if(!e.isIntersecting)return;
 const t=e.target;io.unobserve(t);
 const items=t._m||[];
 if(!booted)items.forEach(el=>el.style.setProperty('--d',((parseFloat(el.style.getPropertyValue('--d'))||0)+BOOT).toFixed(2)+'s'));
 items.forEach(el=>{
  el.classList.add('in');
  const d=parseFloat(el.style.getPropertyValue('--d'))||0;
  setTimeout(()=>{el.classList.add('done');if(el.tagName==='IMG'&&el.closest('.th'))el.classList.add('kb')},(d+1.5)*1000);
 });
 if(t._after)t._after(t);
}),{rootMargin:'0px 0px -9% 0px',threshold:0});

/* A(trigger, [[target, type, delay, stagger, extraClasses], ...]) */
function A(trig,specs){
 if(!trig)return;
 const items=[];
 specs.forEach(([sel,type,base=0,step=0,extra=''])=>{
  const els=typeof sel==='string'?q(sel,trig):(Array.isArray(sel)?sel:[sel]);
  els.forEach((el,i)=>{
   if(!el)return;
   if(type==='split'){split(el);el.classList.add('split')}
   else el.classList.add('mo','mo-'+type);
   extra.split(' ').forEach(c=>c&&el.classList.add(c));
   el.style.setProperty('--d',(base+i*step).toFixed(2)+'s');
   items.push(el);
  });
 });
 trig._m=items;io.observe(trig);
}

/* ---------- every page: footer ---------- */
q('.ft').forEach(ft=>{
 A(q('.ft-main',ft)[0],[['.ft-l > *','l',0,.11],['.ft-r h4','r',.1],['.ft-r li','r',.22,.1],[q('.ft-bot',ft)[0],'u',1.1]]);
});

/* ---------- HOME ---------- */
const hero=q('.hero')[0];
if(hero){
 A(hero,[['.eyebrow','l',0],['h1','split',.12],['.wrap p','u',.7,.13],['.cta','u',1.3]]);
 const sg=q('#strategy .wrap')[0];
 A(sg,[['h2','l',0],['.lead','r',.15]]);
 const band=q('.band',sg)[0];
 A(band,[[band,'z',0],['h3','l',.3],['.cell','u',.5,.14,'mo-i']]);
 const end=q('.sc-end',sg)[0];A(end,[[end,'u',0]]);
 A(q('#process .proc > div:first-child')[0],[['.eyebrow','l',0],['h2','l',.12],['.lead','l',.28]]);
 A($('steps'),[['.step','s',0,.17,'tilt']]);
 const imp=$('impact');
 A(imp,[['.eyebrow','d',0],['h2','t',.1],['.stat','u',.45,.14]]);
 A($('industries'),[['.eyebrow','d',0],['h2','t',.1],['.lead','u',.25],['.ind','z',.4,.09,'mo-i'],['.ind-cta','u',1.3]]);
 // count-up numbers
 const stats=q('.stat b',imp);
 stats.forEach(b=>{const m=b.textContent.match(/^([\d,]+)(.*)$/);if(m){b._n=+m[1].replace(/,/g,'');b._s=m[2];b.textContent='0'+m[2]}});
 imp._after=()=>stats.forEach((b,i)=>{
  if(b._n==null)return;
  const t0=performance.now()+(booted?0:BOOT*1000)+(.55+i*.14)*1000,dur=2000;
  (function tick(now){
   const p=Math.min(1,Math.max(0,(now-t0)/dur)),e=p===1?1:1-Math.pow(2,-10*p);
   b.textContent=Math.round(b._n*e).toLocaleString('en-US')+b._s;
   if(p<1)requestAnimationFrame(tick);
  })(performance.now());
 });
}

/* ---------- ABOUT ---------- */
const about=q('.about')[0];
if(about){
 A(about,[['h1','l',0],['p','l',.2,.16]]);
 A(q('.journey > div:first-child')[0],[['.eyebrow','l',0],['h2','l',.12],['.lead','l',.26]]);
 const tl=q('.tl')[0];A(tl,[[tl,'f',0]]);
 q('.job').forEach(j=>A(j,[[j,'r',0]]));
 A(q('.edu')[0],[['h2','z',0],['.card','k',.2,.16,'tilt']]);
 A(q('.vals')[0],[['h2','l',0],['.val','l',.2,.1]]);
}

/* ---------- EXPERTISE ---------- */
const xh=q('.xhead')[0];
if(xh){
 A(xh,[['.xsub','b',0],['.xtxt','u',.2],['.pills span','p',.45,.07]]);
 q('.eyebrow.eb-lg').forEach(eb=>A(eb,[[eb,'l',0],[eb.nextElementSibling,'r',.12]]));
 const sv=$('svc'),spec=[['.card','u',0,.12,'tilt']];
 q('.card',sv).forEach((c,i)=>spec.push([q('li',c),'l',.5+i*.12,.07]));
 A(sv,spec);
 const tl2=$('tools'),sp2=[['.tools > div','u',0,.12]];
 q('.tools > div',tl2.parentNode).forEach((c,i)=>sp2.push([q('li',c),'l',.4+i*.12,.06]));
 A(tl2,sp2);
}

/* ---------- FREE TIME ---------- */
const free=q('.free')[0];
if(free){
 A(q('h1',free)[0],[[q('h1',free)[0],'split',0]]);
 const ld=q('.lead',free)[0];A(ld,[[ld,'u',.3]]);
 A($('free'),[['.card','p',0,.12,'mo-i tilt']]);
 const qu=q('.quote',free)[0];
 A(qu,[[qu,'z',0],['h3','split',.35],['p','u',.9]]);
}

/* ---------- BLOG ---------- */
const blog=q('.blog')[0];
if(blog){
 A(q('h1',blog)[0],[[q('h1',blog)[0],'split',0]]);
 const lt=q('h3',blog)[0];A(lt,[[lt,'u',.35]]);
 A($('posts'),[['.post','u',0,.15,'tilt'],['.post .th img','w',.1,.15,'mo-w2']]);
}

/* ---------- CONTACT ---------- */
const ct=q('.contact')[0];
if(ct){
 A(ct,[['.wrap > div:first-child h1','split',0],['.wrap > div:first-child .lead','l',.5],
  ['#cf','r',.2],['#cf > h3','u',.6],['#cf > .row, #cf > input, #cf > textarea','u',.7,.09]]);
}

/* ---------- 404 + blog post template ---------- */
const nf=q('main section[style*="180px"]')[0];
if(nf)A(nf,[['.eyebrow','d',0],['h1','split',.1],['.lead','u',.6],['.btn','u',.8]]);
const art=q('.art')[0];
if(art){
 A(art,[['.back','l',0],['.eyebrow','l',.1],['h1','split',.2],['.meta','u',.5]]);
 q('.post-body > *',art).forEach(el=>A(el,[[el,'u',0]]));
}

/* ---------- interactions ---------- */
// 3D tilt on cards
q('.tilt').forEach(el=>{
 el.addEventListener('pointermove',e=>{
  if(!el.classList.contains('done')||e.pointerType==='touch')return;
  const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  el.style.setProperty('--ry',(x*8).toFixed(2)+'deg');el.style.setProperty('--rx',(-y*8).toFixed(2)+'deg');
 });
 el.addEventListener('pointerleave',()=>{el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')});
});
// magnetic buttons
q('.btn').forEach(b=>{
 b.addEventListener('pointermove',e=>{
  if(e.pointerType==='touch')return;
  const r=b.getBoundingClientRect();
  b.style.setProperty('--mx',((e.clientX-r.left-r.width/2)*.22).toFixed(1)+'px');
  b.style.setProperty('--my',((e.clientY-r.top-r.height/2)*.32).toFixed(1)+'px');
 });
 b.addEventListener('pointerleave',()=>{b.style.setProperty('--mx','0px');b.style.setProperty('--my','0px')});
});
// scroll progress bar + gentle parallax
const bar=document.createElement('div');bar.className='prog';document.body.appendChild(bar);
const heroArt=q('.heroart')[0],abFrame=q('.about .frame')[0],abWrap=abFrame&&abFrame.parentElement;
let tick=false;
function onScroll(){
 if(tick)return;tick=true;
 requestAnimationFrame(()=>{
  tick=false;
  const h=document.documentElement.scrollHeight-innerHeight;
  bar.style.transform='scaleX('+(h>0?Math.min(1,scrollY/h):0)+')';
 });
}
addEventListener('scroll',onScroll,{passive:true});onScroll();
// cursor spotlight (mouse devices only)
if(matchMedia('(hover:hover) and (pointer:fine)').matches){
 const g=document.createElement('div');g.className='glow';document.body.appendChild(g);
 let tx=innerWidth/2,ty=innerHeight/2,cx=tx,cy=ty,run=false;
 function loop(){cx+=(tx-cx)*.12;cy+=(ty-cy)*.12;g.style.transform='translate('+cx.toFixed(1)+'px,'+cy.toFixed(1)+'px)';
  if(Math.abs(tx-cx)>.5||Math.abs(ty-cy)>.5)requestAnimationFrame(loop);else run=false}
 addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;g.classList.add('on');if(!run){run=true;requestAnimationFrame(loop)}},{passive:true});
 document.addEventListener('pointerleave',()=>g.classList.remove('on'));
}
// page-exit wipe
const ex=document.createElement('div');ex.className='exit';document.body.appendChild(ex);
document.addEventListener('click',e=>{
 const a=e.target.closest&&e.target.closest('a[href]');
 if(!a||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
 if(a.target&&a.target!=='_self')return;
 let u;try{u=new URL(a.href,location.href)}catch(_){return}
 if(u.origin!==location.origin)return;
 if(u.pathname===location.pathname)return;   // same page / anchor: let the browser scroll
 e.preventDefault();ex.classList.add('on');setTimeout(()=>{location.href=a.href},520);
});
addEventListener('pageshow',e=>{if(e.persisted)ex.classList.remove('on')});
})();
