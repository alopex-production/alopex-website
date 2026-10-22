const films=[{"title": "音の雫", "slug": "oto-no-shizuku", "detail": true}, {"title": "ヒナゲシが咲いた場所", "slug": "hinageshi", "detail": true}, {"title": "世界には時々、隙間がある", "slug": "sekai-no-sukima", "detail": false}, {"title": "左か右か。", "slug": "left-or-right", "detail": false}, {"title": "日向夏", "slug": "hyuganatsu", "detail": false}, {"title": "並行感情理論", "slug": "heiko-kanjo", "detail": false}, {"title": "おみくぢ", "slug": "omikuji", "detail": false}, {"title": "ここが私の世界隅。", "slug": "watashi-no-sekai", "detail": false}];
const grid=document.getElementById('filmGrid');const dialog=document.getElementById('filmDialog');
function render(filter='all'){
 grid.textContent='';films.forEach((film,i)=>{
 if(filter==='detail'&&!film.detail)return;
 const card=document.createElement(film.detail?'a':'button');card.className='film-card reveal';
 if(film.detail){card.href=film.slug+'.html';}else{card.type='button';card.setAttribute('aria-label',film.title+'のポスターを見る');}
 const art=document.createElement('div');art.className='film-art poster-art';
 const img=document.createElement('img');img.src='assets/'+film.slug+'.webp';img.alt='映画『'+film.title+'』ポスター';img.loading=i<4?'eager':'lazy';img.decoding='async';art.appendChild(img);
 const over=document.createElement('span');over.className='poster-overlay';over.textContent=film.detail?'EXPLORE FILM  ↗':'VIEW POSTER  ↗';art.appendChild(over);
 const info=document.createElement('div');info.className='film-info';
 const text=document.createElement('div');const h=document.createElement('h3');h.textContent=film.title;const p=document.createElement('p');p.textContent=film.detail?'FILM DETAIL ↗':'DETAILS IN PREPARATION';text.append(h,p);const more=document.createElement('span');more.className='more';more.textContent='↗';info.append(text,more);card.append(art,info);
 if(!film.detail)card.addEventListener('click',()=>{
 document.getElementById('dialogTitle').textContent=film.title;
 const container=document.getElementById('dialogArt');container.replaceChildren();
 const photo=document.createElement('img');photo.src='assets/'+film.slug+'.webp';photo.alt=film.title+' ポスター';container.append(photo);dialog.showModal();
 });grid.append(card);
 });observeReveals();
}
const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.07}):null;
function observeReveals(){document.querySelectorAll('.reveal:not(.visible)').forEach(el=>observer?observer.observe(el):el.classList.add('visible'))};render();
document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(x=>{x.classList.remove('active');x.setAttribute('aria-pressed','false')});b.classList.add('active');b.setAttribute('aria-pressed','true');render(b.dataset.filter)}));
document.getElementById('dialogClose').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});window.addEventListener('scroll',()=>{const h=document.documentElement;document.getElementById('progress').style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%'},{passive:true});
