/* 決まったフォーム以外の短文・箇条書きも受け付ける。計算は既存処理へ渡す。 */
(function(root){
'use strict';
const groups={name:['名前','お名前','表示名','氏名','名前／SNSネーム','名前/SNSネーム','name'],birthDate:['生年月日','誕生日','生まれ','出生年月日','birthDate'],birthTime:['出生時刻','生まれた時間','誕生時間','birthTime'],purpose:['用途','お迎えになるのは','お迎えになるのは？','purpose'],wishes:['願い','希望','叶えたいこと','叶えたいことはなんですか？','wishes'],colors:['色','カラー','希望色','好きな色','好きな色は？','colors'],shape:['形','サイズ','形・大きさ','形状','お好きな形、大きさ','shape'],future:['未来','目標','なりたい姿','相談内容','望む未来','どんな未来にしたいですか','どんな未来にしたいですか？','future']};
const key=s=>s.replace(/[\s？?]/g,'');
const field=s=>Object.keys(groups).find(k=>groups[k].some(v=>key(v)===key(s)));
function parse(text){
text=String(text).trim();if(!text)throw Error('生年月日と望む未来を入力してください。');
let data={},rest=[];
if(text.startsWith('{')){try{const obj=JSON.parse(text);if(!obj||Array.isArray(obj)||typeof obj!=='object')throw Error();for(const [k,v] of Object.entries(obj)){const id=field(k);if(id)data[id]=v;}}catch{throw Error('JSONはお客様1人分のオブジェクトで指定してください。');}}
else if(text.includes('\t')||(/^.*生年月日.*,/.test(text.split(/\r?\n/)[0]))){return MakerWorkflow.parse(text);}
else {let current=null;for(const raw of text.split(/[\r\n]+/)){const line=raw.replace(/^\s*[-・●]\s*/,'').trim();if(!line)continue;const m=/^([^：:=]+)[：:=]\s*(.*)$/.exec(line);const id=m&&field(m[1]);if(id){data[id]=m[2];current=id;continue;}const q=field(line);if(q){current=q;data[q]='';continue;}if(current){data[current]+=(data[current]?'\n':'')+line;}else rest.push(line);}}
if(!data.birthDate){const joined=rest.join('\n');const dates=[...joined.matchAll(/(?:^|[^\d])(\d{4})[-/年.](\d{1,2})[-/月.](\d{1,2})日?(?!\d)/g)];if(dates.length!==1)throw Error('生年月日を1件、例：1987-04-25 の形で入力してください。');const m=dates[0];data.birthDate=`${m[1]}-${m[2]}-${m[3]}`;rest=joined.replace(m[0],' ').replace(/(?:生まれ|生年月日|誕生日)(?:です)?[。、]?/g,'').split('\n').map(s=>s.trim()).filter(Boolean);}
if(!data.future)data.future=rest.join('\n');
if(typeof data.future!=='string'||!data.future.trim())throw Error('望む未来や相談内容を、短い文章で入力してください。');
const optional=['name','purpose','shape','wishes','colors'];const missing=optional.filter(k=>data[k]==null||data[k]==='');
const defaults={name:'依頼者',purpose:'本人',shape:'未指定',wishes:['未指定'],colors:['未指定']};
for(const k of missing)data[k]=defaults[k];
const result=MakerWorkflow.parse(JSON.stringify(data));if(missing.includes('wishes'))result.customer.wishes=[];if(missing.includes('colors'))result.customer.colors=[];
result.sourceText=text;result.inputNote=`読み取り確認：生年月日 ${result.customer.birthDate}／望む未来 ${result.customer.future}${missing.length?'（名前・用途・形・願い・色の未入力項目は仮表示／未指定）':''}`;return result;
}
root.FlexibleInput={parse};
})(globalThis);
