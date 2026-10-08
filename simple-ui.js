(function(){
'use strict';
const status=document.getElementById('status'),copy=document.getElementById('copyImage'),badge=document.getElementById('resultBadge'),hint=document.getElementById('outputHint');
function update(){const ready=!copy.disabled;document.body.dataset.ready=String(ready);const calculated=Boolean(document.getElementById('sanmeiPrompt').value);badge.textContent=ready?'作成できました':calculated?'石を選んでください':'回答待ち';hint.textContent=ready?'コピーして、画像生成AIに貼り付けましょう。':calculated?'使う石・素材を選ぶと、画像プロンプトが作成されます。':'回答を反映してから、使う石を選んでください。';const text=status.textContent;const mascot=document.getElementById('mugiStatusImage');mascot.src=text.includes('プロンプトをコピーしました。')?'assets/mugi/mugi-done.png':'assets/mugi/mugi-check.png';status.dataset.tone=text.includes('作成しました')||text.includes('コピーしました')?'success':text.includes('確認してください')||text.includes('ありません')||text.includes('貼り付けてください')?'error':'info';}
new MutationObserver(update).observe(status,{childList:true,characterData:true,subtree:true});
for(const id of ['reflect','sample'])document.getElementById(id).addEventListener('click',()=>{update();if(!document.getElementById('copyAdvice').disabled)document.getElementById('advice').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});else document.getElementById('answer').focus();});
update();
})();
