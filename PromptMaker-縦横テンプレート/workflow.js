/* フォーム回答、計算事実、制作提案を分離する。算命学の計算は既存エンジンのみ。 */
(function(root){
  'use strict';
  const uniq=a=>[...new Set(a.filter(Boolean))];
  const aliases={name:['名前／SNSネーム','名前/SNSネーム','お名前','名前','name'],birthDate:['生年月日','birthDate'],birthTime:['出生時刻','birthTime'],purpose:['お迎えになるのは？','お迎えになるのは','用途','purpose'],wishes:['叶えたいことはなんですか？','叶えたいこと','願い','wishes'],colors:['好きな色は？','好きな色','colors'],shape:['お好きな形、大きさ','形・大きさ','shape'],future:['どんな未来にしたいですか？','どんな未来にしたいですか','望む未来','future']};
  const key=s=>s.trim().replace(/[？?：:]/g,'').replace(/[（(].*?[）)]/g,'').replace(/\s/g,'');
  const aliasKey=k=>Object.entries(aliases).find(([,names])=>names.some(n=>key(n)===key(k)))?.[0];
  function list(value){return uniq((Array.isArray(value)?value:String(value||'').split(/[、,，;；\n]/)).map(s=>String(s).trim()));}
  function csv(text,separator){const rows=[];let row=[],cell='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++}else quoted=!quoted;}else if(!quoted&&c===separator){row.push(cell);cell=''}else if(!quoted&&(c==='\n'||c==='\r')){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(Boolean))rows.push(row);row=[];cell=''}else cell+=c;}if(quoted)throw Error('引用符が閉じられていません。');row.push(cell);if(row.some(Boolean))rows.push(row);return rows;}
  function parse(text){
    text=String(text).replace(/^\uFEFF/,'').trim();if(!text)throw Error('フォーム回答を貼り付けてください。');
    let source={};
    if(text.startsWith('{')){try{source=JSON.parse(text)}catch{throw Error('JSONの形式を確認してください。')}if(!source||Array.isArray(source)||typeof source!=='object')throw Error('回答は1件のオブジェクトにしてください。');}
    else {
      const first=text.split(/\r?\n/)[0];
      if(first.includes('\t')||(first.includes(',')&&csv(first,',')[0].filter(aliasKey).length>=2)){
        const rows=csv(text,first.includes('\t')?'\t':',');if(rows.length!==2)throw Error('見出し行と回答1件の2行だけを取り込んでください。');if(rows[0].length!==rows[1].length)throw Error('見出しと回答の列数が一致しません。');source=Object.fromEntries(rows[0].map((h,i)=>[h,rows[1][i]]));
      } else {
        let current=null;for(const line of text.split(/\r?\n/)){const match=/^([^：:]+)[：:]\s*(.*)$/.exec(line);const id=match&&aliasKey(match[1]);const question=aliasKey(line);if(id){current=id;source[id]=match[2]}else if(question){current=question;source[current]=''}else if(match){current=null}else if(current){source[current]+=(source[current]?'\n':'')+line} }
      }
    }
    const mapped={};for(const [k,v] of Object.entries(source)){const id=aliasKey(k);if(id)mapped[id]=v;}
    const scalar=id=>{const v=mapped[id];if(v!=null&&typeof v!=='string'&&typeof v!=='number')throw Error(`${id}は文字列で指定してください。`);return String(v??'').trim();};
    let birthDate=scalar('birthDate');const date=/^(\d{4})[-/年](\d{1,2})[-/月](\d{1,2})日?$/.exec(birthDate);if(date)birthDate=`${date[1]}-${date[2].padStart(2,'0')}-${date[3].padStart(2,'0')}`;
    const purpose=scalar('purpose');if(!purpose||!/(本人|プレゼント|贈答)/.test(purpose))throw Error('用途（本人／プレゼント）を確認してください。');
    const c={name:scalar('name'),birthDate,birthTime:scalar('birthTime'),purpose:/プレゼント|贈答/.test(purpose)?'gift':'self',wishes:list(mapped.wishes),colors:list(mapped.colors),shape:scalar('shape'),future:scalar('future')};
    for(const [id,label] of [['name','名前'],['birthDate','生年月日'],['shape','形・大きさ'],['future','望む未来']])if(!c[id])throw Error(`${label}がありません。回答を確認してください。`);
    if(!c.wishes.length||!c.colors.length)throw Error('願いと好きな色を確認してください。');if(c.wishes.length>3||c.colors.length>3)throw Error('願いと色はそれぞれ3件までです。');
    if(c.birthTime==='不明')c.birthTime='';
    const invalid=SanmeiEngine.calculate(c.birthDate,c.birthTime||'12:00:00');if(invalid.error)throw Error(invalid.error);
    // 検証を兼ねて取得した結果をそのまま渡す。二度計算しない。
    return {customer:c,sanmei:normalize(invalid,{timeKnown:Boolean(c.birthTime)}),sourceText:text};
  }
  function freeze(o){if(o&&typeof o==='object'&&!Object.isFrozen(o)){Object.values(o).forEach(freeze);Object.freeze(o)}return o;}
  function normalize(raw,conditions){if(raw.error)throw Error(raw.error);return freeze({birthDate:raw.input.date,core:{yearPillar:raw.yearPillar,monthPillar:raw.monthPillar,dayPillar:raw.dayPillar,dayMaster:raw.dayMaster,dayMasterElement:raw.dayMasterElement,tenchusatsu:raw.tenchusatsu,boundaries:raw.boundaries},stars:{nijuhachigen:raw.nijuhachigen,judaiShusei:raw.judaiShusei,junidaiJusei:raw.junidaiJusei},interpretation:{},conditions,raw});}
  const colorAliases={緑:'グリーン',青:'ブルー',紫:'パープル',白:'ホワイト',黒:'ブラック',赤:'レッド',黄色:'イエロー',透明:'クリア',金色:'ゴールド',茶色:'ブラウン'};
  function recommend(customer,available,maxStones=3){
    const input={wishes:customer.wishes,colors:customer.colors.map(c=>colorAliases[c]||c),future:customer.future};
    // 既存の分類を使う。誕生月加点・未定義の算命学加点はしない。
    const rows=StoneSelector.rank({...input,includeOutOfStock:true}).filter(r=>available.includes(r.stone.id));
    if(!rows.length)throw Error('使用できる石がありません。制作設定で石を選んでください。');
    const size=Math.max(1,Math.min(3,Number(maxStones)||3));
    const coverage=s=>new Set(s.flatMap(r=>r.stone.wishes.filter(w=>input.wishes.includes(w))));
    const selected=[];while(selected.length<size){const covered=coverage(selected);const remaining=rows.filter(r=>!selected.includes(r));remaining.sort((a,b)=>{const gain=r=>input.wishes.reduce((n,w,i)=>n+(!covered.has(w)&&r.stone.wishes.includes(w)?[60,40,25][i]:0),0),future=r=>r.stone.keywords.filter(w=>input.future.includes(w)).length,color=r=>input.colors.reduce((n,c,i)=>n+(r.stone.colors.includes(c)?[25,15,10][i]:0),0);return gain(b)-gain(a)||future(b)-future(a)||color(b)-color(a)||b.score-a.score||a.stone.id.localeCompare(b.stone.id)});const next=remaining[0];if(!next||next.score<=0)break;selected.push(next);}
    if(!selected.length)throw Error('願い・色・未来に一致する石がありません。回答の表記または石の設定を確認してください。');
    const sets=[selected];for(const candidate of rows.filter(r=>r.score>0&&!selected.includes(r)).slice(0,2)){const alt=[candidate,...selected.filter(r=>r.stone.id!==candidate.stone.id)].slice(0,selected.length);sets.push(alt);}
    return sets.map(set=>({stones:set.map((r,i)=>({id:r.stone.id,name:r.stone.name,role:i===0?'メイン':'サブ',keywords:r.stone.keywords,colors:r.stone.colors,reasons:r.reasons,matches:r.stone.wishes.filter(w=>input.wishes.includes(w))})),uncovered:input.wishes.filter(w=>!coverage(set).has(w)),unmatchedColors:input.colors.filter(c=>!set.some(r=>r.stone.colors.includes(c))),scoreRule:'existing-1.3.1-without-birth; wish-coverage-set-v1'}));
  }
  function facts(s){const c=s.core;return `年柱 ${c.yearPillar}／月柱 ${c.monthPillar}／日柱 ${c.dayPillar}\n日干 ${c.dayMaster}（${c.dayMasterElement}）／中心星 ${s.stars.judaiShusei.centerStar}\n${c.tenchusatsu}`;}
  function fields(customer,sanmei,set,settings){
    const names=set.stones.map(s=>s.name),keywords=uniq(set.stones.flatMap(s=>s.keywords)).slice(0,3);const wishes=customer.wishes.join('・');
    const shape=customer.shape.split(/[、,\n]/);const selectedShape=shape.length===1?shape[0]:'形・サイズは希望候補から要確認';
    const theme=`${wishes}をテーマにした作品`;
    const result={caseName:`${customer.name}様`,mode:'concept',title:'オルゴナイト鑑定書',theme,themeWords:keywords.join('／'),themeNote:'お寄せいただいた願いを制作テーマに。',tagline:'願いを、あなただけのかたちに。',wishes:customer.wishes.join('\n'),palette:customer.colors.join('・'),reading:facts(sanmei),visual:`${selectedShape}のオルゴナイト制作案。天然石：${names.join('、')}。希望色：${customer.colors.join('・')}。${settings.materials||''}`,meaning:`「${wishes}」を制作テーマとし、${keywords.join('・')}をイメージする石を組み合わせた提案です。`,structure:`中心：${names[0]}\n周囲：${names.slice(1).join('・')||'透明な余白'}\n素材：${settings.materials||'標準素材は未設定'}`,places:'作品に合う安定した場所に飾ってください。',message:`${customer.name}様の「${customer.future}」という願いをもとに${customer.purpose==='gift'?'贈り物として':'あなたのために'}考えた制作案です。`,closing:'願いをかたちに。',symbols:keywords.join('／')};
    for(let i=1;i<=7;i++)result['material'+i]=i<=set.stones.length?`${set.stones[i-1].name}｜${set.stones[i-1].keywords.slice(0,2).join('・')}`:i===4?settings.materials||'':'';
    for(let i=1;i<=3;i++)result['stone'+i]=set.stones[i-1]?`${set.stones[i-1].name}｜${set.stones[i-1].keywords.slice(0,2).join('・')}をイメージする制作素材。`:'';
    return result;
  }
  root.MakerWorkflow={parse,normalize,recommend,fields,facts,freeze};
})(globalThis);
