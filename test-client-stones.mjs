import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
class Element{
 constructor(tag='div'){this.tag=tag;this.value='';this.textContent='';this.innerHTML='copy';this.disabled=false;this.checked=false;this.children=[];this.handlers={};}
 addEventListener(k,f){this.handlers[k]=f;}
 append(...children){this.children.push(...children);}
 replaceChildren(...children){this.children=children;}
 querySelectorAll(selector){const all=this.children.flatMap(c=>[c,...(c.children||[])]);return all.filter(c=>c.tag==='input'&&(!selector.includes(':checked')||c.checked));}
}
const ids=['answer','stones','facts','condition','raw','stonePrompt','sanmeiPrompt','imagePrompt','pdfPrompt','copyStone','copySanmei','copyImage','copyPDF','advicePrompt','copyAdvice','status','reflect','sample','clientStoneList','mainStone','stoneChoiceHint','clearStones','suggestStones'];
const els=Object.fromEntries(ids.map(id=>[id,new Element()]));
const ctx=vm.createContext({document:{getElementById:id=>els[id],createElement:tag=>new Element(tag),createTextNode:text=>({textContent:text})}});
for(const f of ['PromptMaker-縦横テンプレート/engine-data.js','PromptMaker-縦横テンプレート/workflow.js','client-stones.js','flexible-input.js','advice-prompt.js'])vm.runInContext(read(f),ctx);
let calls=0;const calculate=ctx.SanmeiEngine.calculate;ctx.SanmeiEngine.calculate=(...args)=>{calls++;return calculate(...args)};
vm.runInContext(read('advice-prompt.js'),ctx);vm.runInContext(read('flexible-input.js'),ctx);vm.runInContext(read('simple.js'),ctx);
assert.equal(ctx.ClientStones.items.length,25);
assert.equal(new Set(ctx.ClientStones.items.map(s=>s.name)).size,25);
assert.equal(els.clientStoneList.querySelectorAll('input').length,25);
els.sample.handlers.click();assert.equal(calls,1);assert.equal(els.copyAdvice.disabled,false);const adviceData=JSON.parse(els.advicePrompt.value.split('【入力データ】')[1]);assert.equal(adviceData.日干,'甲');assert.equal(adviceData.中心星,'禄存星');assert.equal(adviceData.望む未来,'新しい仕事に自信を持って前進したい');assert.equal(Object.keys(adviceData).length,5);assert.ok(els.advicePrompt.value.includes('全体240字以内'));assert.equal(typeof els.copyAdvice.handlers.click,'function');assert.equal(els.copyImage.disabled,true);assert.ok(els.facts.textContent.includes('禄存星'));
const inputs=els.clientStoneList.querySelectorAll('input');
const choose=name=>{const item=ctx.ClientStones.items.find(s=>s.name===name),input=inputs.find(i=>i.value===item.id);input.checked=true;input.handlers.change();return item.id;};
choose('岩塩');assert.ok(els.imagePrompt.value.includes('メイン：岩塩'));assert.ok(els.pdfPrompt.value.includes('メイン：岩塩'));assert.ok(els.imagePrompt.value.includes('説明データ未登録'));assert.ok(!els.imagePrompt.value.includes('アマゾナイト'));assert.equal(calls,1);
const crystal=choose('水晶クリア');els.mainStone.value=crystal;els.mainStone.handlers.change();assert.ok(els.imagePrompt.value.includes('メイン：水晶クリア'));assert.ok(els.imagePrompt.value.includes('サブ：岩塩'));assert.equal(calls,1);
for(const item of ctx.ClientStones.items){const set=ctx.ClientStones.select([item.id],item.id,{wishes:[]});assert.equal(set.stones[0].name,item.name);if(!item.source&&!item.brief)assert.equal(set.stones[0].keywords.length,0);}
els.clearStones.handlers.click();assert.equal(els.copyImage.disabled,true);assert.equal(els.pdfPrompt.value,'');assert.equal(calls,1);
els.suggestStones.handlers.click();assert.equal(els.copyImage.disabled,false);const selected=els.clientStoneList.querySelectorAll('input:checked').map(i=>i.value);assert.ok(selected.length>0);assert.ok(selected.every(id=>ctx.ClientStones.items.some(item=>item.id===id)));assert.equal(calls,1);
els.answer.handlers.input();assert.equal(els.copyImage.disabled,true);assert.equal(els.suggestStones.disabled,true);assert.equal(els.pdfPrompt.value,'');
assert.equal(els.advicePrompt.value,'');assert.equal(els.copyAdvice.disabled,true);console.log('PASS アドバイス固定形式・基本性格と未来のみ・石選択前コピー・変更時解除／25素材・手動選択・メイン変更・未登録説明保留・画像/PDF一致・選択解除・リスト内おすすめ・再計算なし');

const free=ctx.FlexibleInput.parse('1987年4月25日生まれ\n新しい仕事に自信を持って前進したい');assert.equal(free.customer.birthDate,'1987-04-25');assert.equal(free.customer.future,'新しい仕事に自信を持って前進したい');assert.equal(free.customer.colors.length,0);assert.equal(free.customer.shape,'未指定');
const alternate=ctx.FlexibleInput.parse('表示名：むぎ\n誕生日：1987/4/25\n目標：毎週、新しい仕事に応募したい\nカラー：青');assert.equal(alternate.customer.name,'むぎ');assert.equal(alternate.customer.colors[0],'青');assert.throws(()=>ctx.FlexibleInput.parse('新しい仕事に進みたい'),/生年月日/);assert.throws(()=>ctx.FlexibleInput.parse('1987-04-25'),/望む未来/);assert.throws(()=>ctx.FlexibleInput.parse('1987-04-25\n1988-04-25\n仕事に進みたい'),/生年月日/);assert.throws(()=>ctx.FlexibleInput.parse('1987-02-30\n仕事に進みたい'));
els.answer.value='1987年4月25日生まれ\n新しい仕事に自信を持って前進したい';els.reflect.handlers.click();assert.equal(els.copyAdvice.disabled,false);choose('ローズクォーツ');assert.ok(els.stonePrompt.value.includes('色の目安：ピンク'));assert.ok(els.imagePrompt.value.includes('簡易特性：淡いピンクの水晶'));assert.ok(els.pdfPrompt.value.includes('色の目安：ピンク'));assert.ok(!els.advicePrompt.value.includes('ローズクォーツ'));
console.log('PASS 自由文・別名見出し・任意項目省略・必須不足/複数日付/不正日付拒否・石の意味と色と簡易特性反映');
