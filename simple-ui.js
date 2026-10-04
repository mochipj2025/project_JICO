(function(){
'use strict';
const status=document.getElementById('status'),copy=document.getElementById('copyImage'),badge=document.getElementById('resultBadge'),hint=document.getElementById('outputHint');
function update(){const ready=!copy.disabled;document.body.dataset.ready=String(ready);badge.textContent=ready?'作成できました':'回答待ち';hint.textContent=ready?'コピーして、画像生成AIに貼り付けましょう。':'回答を反映するとコピーできます。';const text=status.textContent;const mascot=document.getElementById('mugiStatusImage');mascot.src=text.includes('プロンプトをコピーしました。')?'assets/mugi/mugi-done.png':'assets/mugi/mugi-check.png';status.dataset.tone=text.includes('作成しました')||text.includes('コピーしました')?'success':text.includes('確認してください')||text.includes('ありません')||text.includes('貼り付けてください')?'error':'info';}
new MutationObserver(update).observe(status,{childList:true,characterData:true,subtree:true});
for(const id of ['reflect','sample'])document.getElementById(id).addEventListener('click',()=>{update();if(!copy.disabled)document.getElementById('results').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});else document.getElementById('answer').focus();});
update();
})();
