const config=window.RESERVATION_CONFIG||{};
let url;try{url=new URL(config.formUrl)}catch{}
const valid=url&&url.protocol==='https:'&&(url.hostname==='docs.google.com'&&url.pathname.startsWith('/forms/')||url.hostname==='forms.gle');
if(config.受付開始===true&&valid){const button=document.querySelector('#google-reserve');button.disabled=false;button.innerHTML='上映会の予約を申し込む <span>→</span>';button.onclick=()=>window.open(url.href,'_blank','noopener,noreferrer');document.querySelector('#reservation-status').textContent='Googleフォームが別のタブで開きます。送信時点では仮受付です。';}
