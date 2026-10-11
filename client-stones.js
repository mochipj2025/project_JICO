/* 依頼者の制作素材。未登録の象徴・効果を推測しない。 */
(function(root){
'use strict';
const names=['MIXカーネリアン','水晶クリア','水晶ホワイト','ソーダライト','シトリン','ラズベリークォーツ','ローズクォーツ','ストロベリークォーツ','スーパーセブン','ラピスラズリ','アメジスト','アベンチュリン','タイガーアイ','プレナイト','アクアマリン','ターコイズ','クンツァイト','ピンクエピドート','アラゴナイト','ロードライトガーネット','ゴールドルチル','ブラックルチル','テラヘルツ','パープルフローライト','岩塩'];
const brief={
'水晶クリア':{keywords:['調和','クリア'],colors:['クリア'],feature:'透明感を活かした配色のつなぎ役。天然・加工の別は現物確認'},
'水晶ホワイト':{keywords:['調和','やわらかさ'],colors:['ホワイト'],feature:'白色を活かして全体を明るくまとめる制作テーマ。透明度は現物確認'}
};
const features={'アメジスト':'紫色の水晶。落ち着いた配色のアクセント','シトリン':'黄〜オレンジ系の水晶。明るい配色のアクセント','ローズクォーツ':'淡いピンクの水晶。やわらかな配色に','アクアマリン':'青〜淡い青のベリル。涼やかな配色に','ターコイズ':'青〜緑系の色合い。模様・加工の有無は現物確認'};
const meanings=["勇気・行動力・活力", "浄化・調和・開運", "癒し・浄化・安定", "知性・判断力・冷静", "金運・繁栄・希望", "愛情・魅力・幸福", "恋愛・自己愛・美", "恋愛・魅力・愛情", "潜在能力・開運・調和", "幸運・直感・厄除け", "癒し・直感・愛の守護", "癒し・安らぎ・調和", "金運・洞察力・仕事運", "整理・手放し・調和", "幸福・癒し・円満", "守護・勇気・旅の安全", "無償の愛・癒し・幸福", "愛情・前向き・心の解放", "安定・癒し・人間関係", "情熱・愛情・魅力", "金運・成功・繁栄", "仕事運・勝負運・成功", "活力・調和・リフレッシュ", "直感・集中力・思考整理", "浄化・清め・守護"].map(s=>s.split("・"));
const items=names.map((name,i)=>({id:'client-'+i,name,keywords:meanings[i],source:StoneSelector.STONES.find(s=>s.name===name)||null,brief:brief[name]||null}));
function recommend(customer){const palette={青:'ブルー',水色:'ブルー',緑:'グリーン',紫:'パープル',白:'ホワイト',透明:'クリア',桃:'ピンク',黄色:'イエロー',金:'ゴールド',黒:'ブラック',赤:'レッド',橙:'オレンジ'};const colors=customer.colors.map(c=>palette[c]||c);const known=items.filter(s=>(s.source||s.brief)&&(!root.MaterialInventory||root.MaterialInventory.available(s.id)));const score=item=>{const s=item.source||item.brief;return colors.reduce((n,c,i)=>n+(s.colors.includes(c)?100-i*10:0),0)*100+((s.wishes||[]).filter(w=>customer.wishes.includes(w)).length*10)+item.keywords.filter(k=>customer.future.includes(k)).length;};known.sort((a,b)=>score(b)-score(a)||names.indexOf(a.name)-names.indexOf(b.name));return known.slice(0,3).map(s=>s.id);}

function select(ids,mainId,customer){if(!ids.length)throw Error('リストから使う石・素材を選んでください。');if(new Set(ids).size!==ids.length||ids.some(id=>!items.some(item=>item.id===id)))throw Error('素材リストの選択を確認してください。');if(!ids.includes(mainId))throw Error('選んだ素材からメインを指定してください。');if(root.MaterialInventory&&ids.some(id=>!root.MaterialInventory.available(id)))throw Error('選んだ素材に在庫切れがあります。在庫を更新するか選択を外してください。');const ordered=[mainId,...ids.filter(id=>id!==mainId)];const stones=ordered.map((id,i)=>{const item=items.find(s=>s.id===id),source=item.source||item.brief;return {id,name:item.name,role:i===0?'メイン':'サブ',keywords:item.keywords,colors:source?source.colors:[],matches:source?(source.wishes||[]).filter(w=>customer.wishes.includes(w)):[],reasons:['本人の好きな色を優先した候補。鑑定士が確認・変更可能'],feature:features[item.name]||(source?'象徴のキーワードを制作テーマに取り入れる。色・透明度・加工は現物確認':'説明データ未登録。名称だけで組成・加工・効能を決めず、仕入れ情報を確認'),catalogKnown:Boolean(source)};});return {stones,uncovered:[],unmatchedColors:[]};}
root.ClientStones={items,recommend,select};
})(globalThis);
