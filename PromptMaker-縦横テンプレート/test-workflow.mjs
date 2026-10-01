import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
const ctx=vm.createContext({console});
vm.runInContext(read('engine-data.js'),ctx);vm.runInContext(read('workflow.js'),ctx);
const {SanmeiEngine:E,MakerWorkflow:W,StoneSelector:S}=ctx;
const plain=x=>JSON.parse(JSON.stringify(x));
const available=S.STONES.filter(s=>s.stock).map(s=>s.id);
let calls=0;const calculate=E.calculate;E.calculate=(...args)=>{calls++;return calculate(...args)};
const answer={name:'テスト',birthDate:'1987-04-25',birthTime:'06:00',purpose:'本人',wishes:['仕事運','人間関係','癒し'],colors:['グリーン','ブルー'],shape:'ピラミッド中',future:'仕事に自信を持って前進したい'};
const parsed=W.parse(JSON.stringify(answer));assert.equal(calls,1,'1回答で計算は1回');
const before=JSON.stringify(parsed.sanmei.raw),sets=W.recommend(parsed.customer,available,3);
assert.equal(sets[0].uncovered.length,0,'願いのカバー');assert.equal(new Set(sets[0].stones.map(s=>s.id)).size,sets[0].stones.length);
assert.ok(sets.every(set=>set.stones.every(s=>available.includes(s.id))),'使用可能な石だけ');
const fields=W.fields(parsed.customer,parsed.sanmei,sets[0],{materials:'レジン・銅線'});
assert.equal(calls,1,'提案・反映時の再計算禁止');assert.equal(JSON.stringify(parsed.sanmei.raw),before);
assert.equal(parsed.sanmei.stars.judaiShusei,parsed.sanmei.raw.judaiShusei,'星は同じ参照');
assert.throws(()=>{parsed.sanmei.raw.yearPillar='変更'},TypeError);
for(const [i,s] of sets[0].stones.entries()){assert.ok(fields['material'+(i+1)].includes(s.name));assert.ok(fields['stone'+(i+1)].includes(s.name));assert.ok(fields.visual.includes(s.name));}
assert.equal(fields.reading,W.facts(parsed.sanmei));
assert.ok(!fields.reading.includes('strengths'));assert.ok(!('fiveElements' in parsed.sanmei));
const jp='用途：プレゼント\n名前／SNSネーム：テスト\n生年月日：1987/4/25\n叶えたいこと：仕事運、人間関係\n好きな色：グリーン、ブルー\nお好きな形、大きさ：円錐小\nどんな未来にしたいですか：仕事に自信を持ちたい\nメールアドレス：非公開';
const imported=W.parse(jp);assert.equal(imported.customer.purpose,'gift');assert.equal(imported.customer.future,'仕事に自信を持ちたい');assert.equal(imported.customer.birthDate,'1987-04-25');assert.equal(imported.sanmei.conditions.timeKnown,false);
for(const sep of ['\t',',']){const headings=['用途','名前','生年月日','願い','好きな色','形・大きさ','望む未来'];const values=['本人','テスト','1987-04-25','仕事運','グリーン','四角柱小','前進'];assert.equal(W.parse(headings.join(sep)+'\n'+values.join(sep)).customer.name,'テスト');}
assert.throws(()=>W.parse(JSON.stringify({...answer,birthDate:'2026-02-30'})),/正しく/);
assert.throws(()=>W.parse(JSON.stringify({...answer,purpose:''})),/用途/);
assert.throws(()=>W.recommend(parsed.customer,[],3),/石がありません/);
const limited=W.recommend(parsed.customer,available,1);assert.equal(limited[0].stones.length,1);
for(const g of JSON.parse(read('golden-sanmei.json'))){const r=E.calculate(g.birthDate,g.time);for(const [field,expected] of Object.entries(g.expected))assert.equal(r[field],expected,`birthDate=${g.birthDate} time=${g.time} field=${field} expected=${expected} actual=${r[field]}`);}
// 正本と埋め込みコアの同一性。ビルド漏れを検出する。
const source=read('../統合版ソース確認/sanmeigaku/engine.js');assert.ok(read('engine-data.js').includes(source.slice(0,source.lastIndexOf('calc.addEventListener('))));
console.log('PASS Golden 5件・一度だけ計算・原本不変・同一参照・正規化・4取り込み形式・組み合わせ/在庫/自動反映');

// 模擬DOMでページ初期化、採用、差し替え、案件復元、undoの実コードを検証。
const html=read('index.html');
class Node {
 constructor(tag='div'){this.tagName=tag.toUpperCase();this.value='';this.checked=false;this.children=[];this.dataset={};this.style={};this.listeners={};this.textContent='';this.hidden=false;this.scrollHeight=60;this.clientHeight=1000;this.clientWidth=1000;this.files=[];this.classList={toggle(){},add(){}};}
 append(...nodes){this.children.push(...nodes)}replaceChildren(...nodes){this.children=[...nodes]}
 addEventListener(k,fn){(this.listeners[k]??=[]).push(fn)}setAttribute(k,v){this[k]=v}closest(){return{classList:{toggle(){}}}}focus(){}select(){}click(){for(const fn of this.listeners.click||[])fn({target:this})}
 querySelector(){return null}querySelectorAll(selector){const all=this.children.flatMap(c=>c instanceof Node?[c,...c.querySelectorAll('*')]:[]);return selector==='input:checked'?all.filter(c=>c.tagName==='INPUT'&&c.checked):all;}
}
const elements=new Map();for(const m of html.matchAll(/<(input|textarea|select|button|[a-z][a-z0-9]*)\b[^>]*\bid="([^"]+)"[^>]*>/g)){const n=new Node(m[1]);n.id=m[2];n.value=/\bvalue="([^"]*)"/.exec(m[0])?.[1]||'';if(n.tagName==='TEXTAREA'){n.value=html.slice(m.index+m[0].length).split('</textarea>')[0];}elements.set(n.id,n);}
const storage=new Map();const document={getElementById(id){assert.ok(elements.has(id),'missing id '+id);return elements.get(id)},createElement:t=>new Node(t),createTextNode:t=>t,querySelector:s=>s==='.preview-wrap'?new Node():null,querySelectorAll:()=>[],addEventListener(){},body:{style:{}}};
const ui=vm.createContext({console,document,URL:{createObjectURL:()=>'',revokeObjectURL(){}},Blob,Image:class{},navigator:{clipboard:{writeText:async()=>{}}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},setTimeout:()=>1,clearTimeout(){},setInterval(){},requestAnimationFrame:fn=>fn()});ui.window=ui;ui.addEventListener=()=>{};
vm.runInContext(read('engine-data.js'),ui);vm.runInContext(read('workflow.js'),ui);for(const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g))vm.runInContext(m[1],ui);vm.runInContext(read('workflow-ui.js'),ui);
const el=id=>elements.get(id);el('formAnswer').value=JSON.stringify(answer);el('importAnswer').click();assert.ok(ui.MakerUI.context());assert.equal(ui.MakerUI.context().accepted,false);
el('inventoryVerified').checked=true;el('saveProduction').click();el('importAnswer').click();el('adoptSet').click();assert.equal(ui.MakerUI.context().accepted,true);assert.ok(el('reading').value.includes('丁卯'));assert.equal(el('reading').value,el('v-reading').textContent);assert.ok(el('prompt').value.includes(el('material1').value));assert.equal(ui.MakerUI.context().sanmei,ui.MakerUI.context().sanmei);
const snapshot=plain(ui.MakerEditor.state());assert.ok(snapshot.pipelineState);assert.deepEqual(plain(JSON.parse(storage.get('orgonitePromptMaker.v2')).fields),snapshot);
const swap=el('stoneSwaps').children[0].children[0];swap.value='sunstone';for(const fn of swap.listeners.change)fn();assert.ok(el('material1').value.includes('サンストーン'));assert.ok(!el('prompt').value.includes(snapshot.material1));assert.equal(ui.MakerUI.context().accepted,false);
el('undo').click();assert.equal(el('material1').value,snapshot.material1);assert.equal(ui.MakerUI.context().accepted,true);
ui.MakerEditor.newCase(snapshot);assert.equal(el('reading').value,el('v-reading').textContent);assert.equal(ui.MakerUI.context().customer.name,'テスト');
el('formAnswer').value=JSON.stringify({...answer,name:'別の方'});for(const fn of el('formAnswer').listeners.input)fn({target:el('formAnswer')});assert.ok(ui.MakerUI.guards().length);assert.equal(ui.MakerUI.context().accepted,false);
console.log('PASS 模擬DOM：取り込み→制作設定→採用→表示/プロンプト一致→自動保存→差し替え→undo→復元→回答変更で無効化');
const restoreFile=JSON.stringify({format:'orgonite-case-v1',fields:snapshot});
el('importCase').files=[{size:restoreFile.length,text:async()=>restoreFile}];
await el('importCase').listeners.change[0]({target:el('importCase')});
assert.equal(ui.MakerUI.context().accepted,true);assert.equal(el('material1').value,snapshot.material1);assert.equal(ui.MakerUI.guards().length,0);
const multiple=JSON.stringify({...answer,shape:'ピラミッド中、円錐小'});el('formAnswer').value=multiple;el('importAnswer').click();el('adoptSet').click();assert.equal(ui.MakerUI.context().accepted,false);assert.ok(el('intakeStatus').textContent.includes('形'));
el('finalShape').value='円錐小';for(const fn of el('finalShape').listeners.change)fn();el('adoptSet').click();assert.equal(ui.MakerUI.context().accepted,true);assert.ok(el('visual').value.includes('円錐小'));assert.ok(!el('prompt').value.includes('左は大きなピラミッド型'));
console.log('PASS 案件JSON読込ハンドラ・複数形状の確認・希望形状のプロンプト反映');
