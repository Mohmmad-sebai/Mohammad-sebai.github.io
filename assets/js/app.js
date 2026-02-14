
(function(){
  const images = window.PORTFOLIO_IMAGES || [];
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const lbPlay = document.getElementById('lbPlay');

  const slideshowBtn = document.getElementById('slideshowBtn');
const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  let idx = 0;
  let playing = false;
  let timer = null;

  function setCaption(){
    lbCaption.textContent = `PAGE ${String(idx+1).padStart(2,'0')} / ${images.length}`;
  }

  function openAt(i){
    if(!images.length) return;
    idx = (i + images.length) % images.length;
    lbImg.src = images[idx];
    setCaption();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
  }

  function close(){
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    lbImg.src = '';
    stop();
  }

  function next(){
    openAt(idx + 1);
  }
  function prev(){
    openAt(idx - 1);
  }

  function play(){
    if(playing) return;
    playing = true;
    lbPlay.textContent = 'Pause';
    timer = setInterval(()=> next(), 2200);
  }
  function stop(){
    playing = false;
    lbPlay.textContent = 'Play';
    if(timer){ clearInterval(timer); timer = null; }
  }
  function togglePlay(){
    playing ? stop() : play();
  }

  // Tiles open lightbox
  document.querySelectorAll('a.tile').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const i = parseInt(a.dataset.idx || '0', 10);
      openAt(i);
    });
  });

  // Controls
  lbClose?.addEventListener('click', close);
  lightbox?.addEventListener('click', (e)=>{ if(e.target === lightbox) close(); });
  document.addEventListener('keydown', (e)=>{
    if(!lightbox.classList.contains('open')) return;
    if(e.key === 'Escape') close();
    if(e.key === 'ArrowRight') next();
    if(e.key === 'ArrowLeft') prev();
    if(e.key === ' ') { e.preventDefault(); togglePlay(); }
  });

  lbNext?.addEventListener('click', next);
  lbPrev?.addEventListener('click', prev);
  lbPlay?.addEventListener('click', togglePlay);

  slideshowBtn?.addEventListener('click', ()=>{
    openAt(0);
    play();
  });
// Page-level prev/next (scroll)
  prevBtn?.addEventListener('click', ()=>{
    document.getElementById('work')?.scrollIntoView({behavior:'smooth', block:'start'});
    openAt(Math.max(0, idx-1));
  });
  nextBtn?.addEventListener('click', ()=>{
    document.getElementById('work')?.scrollIntoView({behavior:'smooth', block:'start'});
    openAt(Math.min(images.length-1, idx+1));
  });

  // Smooth tilt for preview card
  const card = document.getElementById('previewCard');
  const previewImg = document.getElementById('previewImg');
  if(previewImg && images.length){
    previewImg.src = images[0];
  }
  if(card){
    const maxTilt = 10;
    card.addEventListener('mousemove', (e)=>{
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (py - 0.5) * -maxTilt;
      const ry = (px - 0.5) * maxTilt;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
    });
    card.addEventListener('mouseleave', ()=>{
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  }
})();
