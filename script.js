/* ---------- helpers ---------- */
const $ = q => document.querySelector(q);
const $$ = q => document.querySelectorAll(q);


document.querySelectorAll('[data-count]').forEach(el => animate(el));

function animate(el){
  const end = +el.dataset.count;
  let n = 0, step = end / 100;
  const t = setInterval(() => {
    n += step;
    if (n >= end){ el.textContent = end; clearInterval(t); }
    else          { el.textContent = Math.round(n); }
  }, 20);
}

/* ========= BACK-TO-TOP (robust version) ========= */
document.addEventListener('DOMContentLoaded', () => {

  const btn = document.getElementById('backTop');
  if (!btn) return;                       // button missing – nothing to do

  // show / hide on scroll
  const toggleVis = () =>
    btn.classList.toggle('show', window.scrollY > 300);
  window.addEventListener('scroll', toggleVis);
  toggleVis();                            // run once on load

  // click → smooth-scroll
  btn.addEventListener('click', e => {
    e.preventDefault();
    const home = document.getElementById('home');
    if (home) {
      home.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

});

/* ========= contact mailto form ========= */
document.addEventListener('DOMContentLoaded', () => {

  const form  = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  if (!form) return;                 // section not on this page → done

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('cf-name').value.trim();
    const from = document.getElementById('cf-email').value.trim();
    const msg  = document.getElementById('cf-msg').value.trim();
    if (!name || !from || !msg) return;   // simple guard

    /* Build mailto URL */
    const mail = new URL('mailto:vaishnaisme@gmail.com');
    mail.searchParams.set('subject', `Message from ${name}`);
    mail.searchParams.set(
      'body',
      `Name: ${name}%0D%0AEmail / Phone: ${from}%0D%0A%0D%0A${encodeURIComponent(msg)}`
    );

    /* show toast, open mail client after tiny delay */
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      window.location.href = mail.toString();
      form.reset();
    }, 300);   // 0.3 s feels instant but lets users see the toast
  });

});



/* sticky header background */
const topbar = $('#topbar');
window.addEventListener('scroll', () => {
  topbar.classList.toggle('scrolled', scrollY > 40);
  $('#backTop').classList.toggle('show', scrollY > 300);
});

/* smooth anchor scroll */
$$('a[href^="#"]').forEach(a => a.onclick = e => {
  e.preventDefault(); document.querySelector(a.getAttribute('href'))
         .scrollIntoView({behavior:'smooth'});
});

/* typewriter */
function typeWriter(el){
  const words = JSON.parse(el.dataset.words); let i=0, j=0, dir=1;
  setInterval(()=>{
    el.textContent = words[i].slice(0,j) + (j%2 ? '|' : '');
    j+=dir;
    if(j===words[i].length+1||j===0){dir*=-1;if(j===0)i=(i+1)%words.length}
  },120);
}
typeWriter($('.typewriter'));

/* stats counter */
function counter(id, end){ let n=0, el=$(id); const step=end/100;
  const int = setInterval(()=>{ n+=step; el.textContent=Math.round(n);
    if(n>=end) clearInterval(int); },20);
}
counter('#xp',5); counter('#students',400); counter('#projects-completed',5); counter('#citations',120);

/* skill cloud */
['TensorFlow','PyTorch','Scikit-learn','Pandas','NumPy','JAX','Keras','Docker',
 'FastAPI','Matplotlib','Git','AWS','Azure','OpenCV','NLP','CV'].forEach(tag=>{
  const span=document.createElement('span');
  span.className='tech-tag'; span.textContent=tag;
  $('#skill-cloud').append(span);
});

/* -------------- GitHub Projects -------------- */
const GITHUB_USER='YOUR_GITHUB';  // <- replace
let page=1, dataCache=[];
async function loadRepos(){
  const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&page=${page}`);
  const repos = await res.json(); if(repos.length) dataCache = dataCache.concat(repos);
  renderRepos(dataCache);
  $('#load-more').classList.toggle('hidden', repos.length<100);
  page++;
}
function tagFromRepo(r){
  const map={'research':'Research','edu':'Education'}; // naive
  return Object.keys(map).find(k=>r.name.includes(k))?map[Object.keys(map).find(k=>r.name.includes(k))]:'Applications';
}
function renderRepos(arr, filter='all'){
  const grid=$('#repo-grid'); grid.innerHTML='';
  arr.filter(r=>filter==='all'||tagFromRepo(r)===filter).forEach(r=>{
    const card=document.createElement('div'); card.className='repo-card';
    card.innerHTML=`<h3>${r.name.replace(/-/g,' ')}</h3>
    <p>${r.description||''}</p>
    <div class="repo-meta">
      <svg><use href="#star"/></svg>${r.stargazers_count}
      <span class="tech-tag">${r.language||''}</span>
      <span class="tech-tag">${tagFromRepo(r)}</span>
    </div>
    <p style="margin-top:.8rem">
      ${r.homepage?`<a href="${r.homepage}" target="_blank" class="btn outline" style="margin-right:.4rem">Live Demo</a>`:''}
      <a href="${r.html_url}" target="_blank" class="btn accent">Code</a>
    </p>`;
    grid.append(card);
  });
}
$('#load-more').onclick=loadRepos;
loadRepos();

/* filter buttons */
$$('.filters button').forEach(btn=>btn.onclick=()=>{
  $$('.filters button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderRepos(dataCache, btn.dataset.filter);
});

/* scroll reveal */
const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');observer.unobserve(e.target)}})
},{threshold:.15});
$$('section').forEach(s=>observer.observe(s));

/* Back-to-top */
document.getElementById('backTop')
        .addEventListener('click', e => {
            e.preventDefault();                 // stop <button> default focus/submit
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

/* YouTube playlist lazy load */
$('.yt-thumb')?.addEventListener('click', e=>{
  const id=e.currentTarget.dataset.id;
  e.currentTarget.outerHTML=`<iframe src="https://www.youtube.com/embed/videoseries?list=${id}&autoplay=1"
  title="YouTube playlist" loading="lazy" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope" frameborder="0"></iframe>`;
});

/* Masonry lightbox */
$('#gallery-grid')?.addEventListener('click',e=>{
  if(e.target.tagName!=='IMG')return;
  const lb=document.createElement('div');lb.className='lightbox';
  lb.innerHTML=`<img src="${e.target.src}" alt=""><button style="position:fixed;top:1rem;right:1rem;color:#fff;font-size:2rem;background:none;border:none">&times;</button>`;
  document.body.append(lb);
  lb.onclick=()=>lb.remove();
});

/* Blog: load all markdown files inside posts/ */
async function loadPosts(){
  const resp=await fetch('posts/index.json').catch(()=>null);
  if(!resp)return;
  const files=await resp.json();
  files.forEach(async f=>{
    const md=await fetch(`posts/${f}`).then(r=>r.text());
    const html=window.marked.parse(md);
    const art=document.createElement('article');art.innerHTML=html;
    $('#post-list').append(art);
  })
}
if(window.marked) loadPosts();
