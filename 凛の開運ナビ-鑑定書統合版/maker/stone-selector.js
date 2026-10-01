/* 天然石の候補選定。効果の保証ではなく、ヒアリング条件による並べ替え。 */
(function(root){
  const STONES=[
    {id:'crystal',name:'クリスタル（本水晶）',colors:['ホワイト','クリア'],wishes:['願望成就'],keywords:['調和','クリア'],birth:[4],stock:true},
    {id:'amethyst',name:'アメジスト',colors:['パープル'],wishes:['恋愛成就','癒し'],keywords:['冷静','落ち着き','関係性'],birth:[2],stock:true},
    {id:'rose_quartz',name:'ローズクォーツ',colors:['ピンク'],wishes:['恋愛成就','人間関係'],keywords:['やさしさ','愛情','自己受容'],birth:[10],stock:true},
    {id:'citrine',name:'シトリン',colors:['イエロー','ゴールド'],wishes:['金運','仕事運','願望成就'],keywords:['繁栄','前進','明るさ'],birth:[11],stock:true},
    {id:'aquamarine',name:'アクアマリン',colors:['ブルー'],wishes:['人間関係','恋愛成就'],keywords:['調和','円満','コミュニケーション'],birth:[3],stock:true},
    {id:'garnet',name:'ガーネット',colors:['レッド'],wishes:['恋愛成就','仕事運'],keywords:['情熱','継続','実り'],birth:[1],stock:true},
    {id:'carnelian',name:'カーネリアン',colors:['オレンジ','レッド'],wishes:['仕事運','願望成就'],keywords:['行動','活力','挑戦'],birth:[7],stock:true},
    {id:'peridot',name:'ペリドット',colors:['グリーン'],wishes:['癒し','人間関係'],keywords:['前向き','明るさ','感情'],birth:[8],stock:true},
    {id:'lapis',name:'ラピスラズリ',colors:['ブルー'],wishes:['願望成就'],keywords:['知性','目標','判断'],birth:[12],stock:true},
    {id:'sapphire',name:'サファイア',colors:['ブルー'],wishes:['仕事運','願望成就'],keywords:['知性','基盤','成功'],birth:[9],stock:true},
    {id:'moonstone',name:'ホワイトムーンストーン',colors:['ホワイト','クリア'],wishes:['恋愛成就','癒し'],keywords:['思いやり','やさしさ','感情'],birth:[6],stock:true},
    {id:'emerald',name:'エメラルド',colors:['グリーン'],wishes:['恋愛成就','人間関係'],keywords:['愛情','調和','成長'],birth:[5],stock:false},
    {id:'onyx',name:'ブラックオニキス',colors:['ブラック'],wishes:['魔除け・厄除け'],keywords:['守り','意志','安定'],birth:[],stock:true},
    {id:'smoky',name:'スモーキークォーツ',colors:['グレー','ブラウン'],wishes:['癒し','魔除け・厄除け'],keywords:['安定','落ち着き','地に足'],birth:[],stock:true},
    {id:'tiger_eye',name:'タイガーアイ',colors:['ブラウン','ゴールド'],wishes:['仕事運','金運'],keywords:['判断','行動','仕事'],birth:[],stock:true},
    {id:'malachite',name:'マラカイト',colors:['グリーン'],wishes:['魔除け・厄除け','癒し'],keywords:['守り','変化','浄化'],birth:[],stock:true},
    {id:'amazonite',name:'アマゾナイト',colors:['ブルー','グリーン'],wishes:['願望成就','仕事運'],keywords:['希望','前進','表現'],birth:[],stock:true},
    {id:'blue_lace',name:'ブルーレースアゲート',colors:['ブルー'],wishes:['人間関係','癒し'],keywords:['穏やか','対話','安心'],birth:[],stock:true},
    {id:'fluorite',name:'フローライト',colors:['パープル','グリーン'],wishes:['仕事運','癒し'],keywords:['整理','集中','切替'],birth:[],stock:true},
    {id:'labradorite',name:'ラブラドライト',colors:['グレー','ブルー'],wishes:['願望成就'],keywords:['変化','直感','可能性'],birth:[],stock:true},
    {id:'hematite',name:'ヘマタイト',colors:['グレー','ブラック'],wishes:['仕事運','魔除け・厄除け'],keywords:['集中','行動','守り'],birth:[],stock:true},
    {id:'sunstone',name:'サンストーン',colors:['オレンジ'],wishes:['仕事運','願望成就'],keywords:['自信','明るさ','行動'],birth:[],stock:true},
    {id:'prehnite',name:'プレナイト',colors:['グリーン'],wishes:['癒し'],keywords:['整理','穏やか','手放し'],birth:[],stock:true},
    {id:'turquoise',name:'ターコイズ',colors:['ブルー','グリーン'],wishes:['魔除け・厄除け','願望成就'],keywords:['守り','旅','前進'],birth:[12],stock:true}
  ];
  const WISHES=['','願望成就','恋愛成就','人間関係','癒し','金運','仕事運','魔除け・厄除け'];
  const COLORS=['','ホワイト','クリア','ブラック','グレー','ブラウン','オレンジ','イエロー','ゴールド','グリーン','ブルー','パープル','ピンク','レッド'];
  const HEX={ホワイト:'#e9e8e1',クリア:'#dce6e4',ブラック:'#353a3a',グレー:'#818892',ブラウン:'#8d684d',オレンジ:'#df9451',イエロー:'#e9ce72',ゴールド:'#d7b65a',グリーン:'#78a98a',ブルー:'#6faeae',パープル:'#a08eb3',ピンク:'#dfa8b7',レッド:'#b96a65'};
  const unique=values=>values.map(v=>String(v||'').trim()).filter((v,i,a)=>v&&a.indexOf(v)===i);
  function score(stone,input){
    const wishes=unique(input.wishes||[]),colors=unique(input.colors||[]);
    const wishWeights=[60,40,25],colorWeights=[25,15,10];
    let points=0;const reasons=[];
    wishes.slice(0,3).forEach((v,i)=>{if(stone.wishes.includes(v)){points+=wishWeights[i];reasons.push(`${v} +${wishWeights[i]}`)}});
    colors.slice(0,3).forEach((v,i)=>{if(stone.colors.includes(v)){points+=colorWeights[i];reasons.push(`${v} +${colorWeights[i]}`)}});
    if(stone.birth.includes(Number(input.birthMonth))){points+=15;reasons.push('誕生月 +15')}
    const future=String(input.future||'');
    const hits=stone.keywords.filter(word=>future.includes(word));
    if(hits.length){points+=hits.length*6;reasons.push(`未来の語 ${hits.join('・')} +${hits.length*6}`)}
    return {stone,score:points,reasons,role:wishes[0]&&stone.wishes.includes(wishes[0])?'メイン向き':points>=40?'サブ向き':'補助候補'};
  }
  function rank(input){return STONES.filter(s=>input.includeOutOfStock||s.stock).map(s=>score(s,input)).sort((a,b)=>b.score-a.score||a.stone.name.localeCompare(b.stone.name,'ja'))}
  function asSheetStone(result,index){const s=result.stone;return {role:index===0?'MAIN STONE':'SUB STONE',name:s.name,color:HEX[s.colors[0]]||'#dce6e4',image:`${s.keywords.slice(0,2).join('・')}をイメージする石`,reason:result.reasons.length?`選定条件：${result.reasons.join('、')}`:'選定理由を鑑定者が入力してください。'}}
  root.StoneSelector={STONES,WISHES,COLORS,score,rank,asSheetStone};
})(typeof globalThis!=='undefined'?globalThis:this);
