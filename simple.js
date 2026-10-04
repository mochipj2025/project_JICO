(function(){
'use strict';const $=id=>document.getElementById(id),W=MakerWorkflow;
const sample='用途：本人\n名前：サンプル\n生年月日：1987-04-25\n叶えたいこと：仕事運、人間関係\n好きな色：グリーン、ブルー\n形・大きさ：ピラミッド中\n望む未来：新しい仕事に自信を持って前進したい';
function detailedFacts(s){
const targets=s.stars.judaiShusei.targets,j=s.stars.junidaiJusei,n=s.stars.nijuhachigen,b=s.core.boundaries;
return [W.facts(s),'','【十大主星・人体星図】',...['north','east','center','west','south'].map(k=>`${targets[k].label}：${targets[k].star}`),'','【十二大従星】',...[j.early,j.middle,j.late].map(v=>`${v.period}：${v.star}（エネルギー ${v.energy}）`),'','【月支の二十八元】',`月支 ${n.branch}／節入りから ${n.dayNumber}日目`,`${n.active.phase}：${n.active.stem}`,n.countRule,'','【節入り・計算基準】',`直前の節入り：${b.latestJie} ${b.latestJieJST}`,`立春：${b.lichunJST}`,'日本時間（Asia/Tokyo）'].join('\n');
}
function clear(){for(const id of ['stonePrompt','sanmeiPrompt','imagePrompt','pdfPrompt'])$(id).value='';for(const id of ['copyStone','copySanmei','copyImage','copyPDF'])$(id).disabled=true;for(const id of ['stones','facts'])$(id).textContent='フォーム反映後に表示します。';$('condition').textContent='';$('raw').textContent='';}
function reflect(){clear();try{
const {customer:c,sanmei:s}=W.parse($('answer').value);
const condition=s.conditions.timeKnown?'出生時刻を含む計算結果。':'出生時刻不明のため12:00で暫定計算。節入り付近は年柱・月柱が変わる可能性があります。';
const common=[`用途：${c.purpose==='gift'?'プレゼント':'本人'}`,`願い：${c.wishes.join('・')}`,`望む未来：${c.future}`];
$('facts').textContent=detailedFacts(s);$('condition').textContent=condition;$('raw').textContent=JSON.stringify(s.raw,null,2);
$('sanmeiPrompt').value=['以下の算命学計算結果から、わかりやすい鑑定文を作成してください。','命式・星は再計算せず、未記載の計算値を補完しないでください。解釈と計算事実を分け、断定しすぎない表現にしてください。',...common,condition,JSON.stringify({core:s.core,stars:s.stars},null,2)].join('\n');$('copySanmei').disabled=false;
try{const set=W.recommend(c,StoneSelector.STONES.filter(stone=>stone.stock).map(stone=>stone.id),3)[0];
const lines=set.stones.map(stone=>`${stone.role}：${stone.name}\n象徴：${stone.keywords.join('・')}\n選定理由：${stone.reasons.join('／')}`);
const notes=[set.uncovered.length?'対応未登録の願い：'+set.uncovered.join('・'):'',set.unmatchedColors.length?'作品配色に取り入れる希望色：'+set.unmatchedColors.join('・'):''].filter(Boolean);
$('stones').textContent=[...lines,...notes].join('\n\n');
$('stonePrompt').value=['以下の回答と選定済みの石から、オルゴナイトの制作案を作成してください。','石の役割・配色・配置を簡潔に提案してください。石の効能を保証せず、実在庫や未指定の素材を確定扱いしないでください。形の希望が複数あれば候補として扱ってください。',...common,`希望色：${c.colors.join('・')}`,`形・大きさ：${c.shape}`,...lines,...notes].join('\n');$('copyStone').disabled=false;
$('imagePrompt').value=['オルゴナイトの作品イメージと算命学結果を一緒に載せた横長3:2の鑑定カードを、1枚の画像として生成してください。','明るいアイボリー背景、繊細な金色の装飾、希望色のアクセント。読みやすい日本語と十分な余白。','上にタイトルと表示名。左35％に作品イメージ、願い、石の役割と選定理由。右65％に三柱・日干・天中殺、十大主星の人体星図（北が上、南が下、東が右、西が左、中央が中心）、十二大従星の3期とエネルギー値。下部に二十八元と節入り・計算条件、短い応援メッセージ。全結果を省略せず1枚に配置。文字領域を広く確保し、作品画像を大きくしすぎない。','タイトル：オルゴナイト × 算命学',`表示名：${c.name}様`,...common,`作品の希望形・大きさ：${c.shape}`,`希望色：${c.colors.join('・')}`,'選定した石を封入した透明感のあるオルゴナイトの制作イメージを描く。実物写真とは扱わない。複数形状の希望は候補と明記し、イラストは候補の一例とする。','選定した石：',...lines,...notes,'算命学の掲載結果（表記を正確に使う）：',detailedFacts(s),condition,'命式・星は再計算・変更・補完しない。石の選定理由は願い・色によるもので、算命学から導かれたと説明しない。','石の効能や未来を保証しない。メッセージは願いに沿った短い応援文。表示名・石名・命式を正確に描き、詳細の星名・エネルギー値・二十八元・節入り条件も省略しない。計算事実と解釈を分け、未計算の五行点数・大運・年運は追加しない。選定理由の加点は内部スコアなので画像では数値を外し、願い・色との対応を短い文章で説明する。'].join('\n');$('copyImage').disabled=false;
$('pdfPrompt').value=['添付する完成画像と下記の計算結果を使って、詳しい鑑定PDFを日本語で作成してください。','構成：表紙に完成画像／算命学の結果とわかりやすい解説／石の象徴と選定理由／願いに沿った短いメッセージ。3〜4ページ程度。','画像の文字を読み取って計算値を決めず、以下のテキストを原本として使用してください。命式・星を再計算・補完しないでください。','鑑定の解釈は計算事実と分け、断定や石の効能保証を避けてください。未計算の五行点数・大運・年運を追加しないでください。',`表示名：${c.name}様`,...common,`希望形・大きさ：${c.shape}`,`希望色：${c.colors.join('・')}`,'石の選定：',...lines,...notes,'石の選定理由の加点は内部スコアです。PDFでは点数を省き、願い・色との対応を短い文章で説明してください。算命学から選定したと説明しないでください。','算命学の計算結果：',detailedFacts(s),condition,'添付画像は制作イメージです。'].join('\n');$('copyPDF').disabled=false;$('status').textContent='石の選定・算命学計算と、両方を1枚にまとめる画像プロンプトを作成しました。';
}catch(e){$('stones').textContent=e.message;$('status').textContent='算命学と鑑定文プロンプトを作成しました。石の選定：'+e.message;}
}catch(e){$('status').textContent=e.message;}}
$('reflect').addEventListener('click',reflect);$('sample').addEventListener('click',()=>{$('answer').value=sample;reflect()});$('answer').addEventListener('input',()=>{clear();$('status').textContent='回答が変わりました。「フォームを反映」を押してください。'});
for(const [button,field] of [['copyStone','stonePrompt'],['copySanmei','sanmeiPrompt'],['copyImage','imagePrompt'],['copyPDF','pdfPrompt']]){
const btn=$(button),original=btn.innerHTML;let resetTimer;
btn.addEventListener('click',async()=>{
const text=$(field).value;if(!text){$('status').textContent='先に回答を反映してください。';return;}
let copied=false;
try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);copied=true;}}catch{}
if(!copied){const temp=document.createElement('textarea');temp.value=text;temp.setAttribute('readonly','');temp.style.cssText='position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;';document.body.append(temp);try{temp.focus();temp.select();copied=document.execCommand('copy');}catch{}finally{temp.remove();btn.focus();}}
clearTimeout(resetTimer);
if(copied){btn.textContent='✓ コピーしました';$('status').textContent='プロンプトをコピーしました。';resetTimer=setTimeout(()=>{btn.innerHTML=original},2400);}
else{const details=$(field).closest('details');if(details)details.open=true;$(field).focus();$(field).select();btn.textContent='文章を選択しました';$('status').textContent='自動コピーが許可されませんでした。選択した文章をCtrl+Cでコピーしてください。';resetTimer=setTimeout(()=>{btn.innerHTML=original},4000);}
});
}
})();
