/* 依頼者の制作素材。未登録の象徴・効果を推測しない。 */
(function(root){
'use strict';
const names=['MIXカーネリアン','水晶クリア','水晶ホワイト','ソーダライト','シトリン','ラズベリークォーツ','ローズクォーツ','ストロベリークォーツ','スーパーセブン','ラピスラズリ','アメジスト','アベンチュリン','タイガーアイ','プレナイト','アクアマリン','ターコイズ','クンツァイト','ピンクエピドート','アラゴナイト','ロードライトガーネット','ゴールドルチル','ブラックルチル','テラヘルツ','パープルフローライト','岩塩'];
const brief={
'水晶クリア':{keywords:['調和','クリア'],colors:['クリア'],feature:'透明感を活かした配色のつなぎ役。天然・加工の別は現物確認'},
'水晶ホワイト':{keywords:['調和','やわらかさ'],colors:['ホワイト'],feature:'白色を活かして全体を明るくまとめる制作テーマ。透明度は現物確認'}
};
const features={'アメジスト':'紫色の水晶。落ち着いた配色のアクセント','シトリン':'黄〜オレンジ系の水晶。明るい配色のアクセント','ローズクォーツ':'淡いピンクの水晶。やわらかな配色に','アクアマリン':'青〜淡い青のベリル。涼やかな配色に','ターコイズ':'青〜緑系の色合い。模様・加工の有無は現物確認'};
const items=names.map((name,i)=>({id:'client-'+i,name,source:StoneSelector.STONES.find(s=>s.name===name)||null,brief:brief[name]||null}));
function recommend(customer){const known=items.filter(s=>s.source&&(!root.MaterialInventory||root.MaterialInventory.available(s.id)));const set=MakerWorkflow.recommend(customer,known.map(s=>s.source.id),3)[0];return set.stones.map(s=>items.find(item=>item.source?.id===s.id).id);}
function select(ids,mainId,customer){if(!ids.length)throw Error('リストから使う石・素材を選んでください。');if(new Set(ids).size!==ids.length||ids.some(id=>!items.some(item=>item.id===id)))throw Error('素材リストの選択を確認してください。');if(!ids.includes(mainId))throw Error('選んだ素材からメインを指定してください。');if(root.MaterialInventory&&ids.some(id=>!root.MaterialInventory.available(id)))throw Error('選んだ素材に在庫切れがあります。在庫を更新するか選択を外してください。');const ordered=[mainId,...ids.filter(id=>id!==mainId)];const stones=ordered.map((id,i)=>{const item=items.find(s=>s.id===id),source=item.source||item.brief;return {id,name:item.name,role:i===0?'メイン':'サブ',keywords:source?source.keywords:[],colors:source?source.colors:[],matches:source?(source.wishes||[]).filter(w=>customer.wishes.includes(w)):[],reasons:['依頼者の制作リストから鑑定士が選択'],feature:features[item.name]||(source?'象徴のキーワードを制作テーマに取り入れる。色・透明度・加工は現物確認':'説明データ未登録。名称だけで組成・加工・効能を決めず、仕入れ情報を確認'),catalogKnown:Boolean(source)};});return {stones,uncovered:[],unmatchedColors:[]};}
root.ClientStones={items,recommend,select};
})(globalThis);
