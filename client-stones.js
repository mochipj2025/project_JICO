/* 依頼者の制作素材。未登録の象徴・効果を推測しない。 */
(function(root){
'use strict';
const names=['MIXカーネリアン','水晶クリア','水晶ホワイト','ソーダライト','シトリン','ラズベリークォーツ','ローズクォーツ','ストロベリークォーツ','スーパーセブン','ラピスラズリ','アメジスト','アベンチュリン','タイガーアイ','プレナイト','アクアマリン','ターコイズ','クンツァイト','ピンクエピドート','アラゴナイト','ロードライトガーネット','ゴールドルチル','ブラックルチル','テラヘルツ','パープルフローライト','岩塩'];
const items=names.map((name,i)=>({id:'client-'+i,name,source:StoneSelector.STONES.find(s=>s.name===name)||null}));
function recommend(customer){const known=items.filter(s=>s.source);const set=MakerWorkflow.recommend(customer,known.map(s=>s.source.id),3)[0];return set.stones.map(s=>items.find(item=>item.source?.id===s.id).id);}
function select(ids,mainId,customer){if(!ids.length)throw Error('リストから使う石・素材を選んでください。');if(new Set(ids).size!==ids.length||ids.some(id=>!items.some(item=>item.id===id)))throw Error('素材リストの選択を確認してください。');if(!ids.includes(mainId))throw Error('選んだ素材からメインを指定してください。');const ordered=[mainId,...ids.filter(id=>id!==mainId)];const stones=ordered.map((id,i)=>{const item=items.find(s=>s.id===id),source=item.source;return {id,name:item.name,role:i===0?'メイン':'サブ',keywords:source?source.keywords:[],colors:source?source.colors:[],matches:source?source.wishes.filter(w=>customer.wishes.includes(w)):[],reasons:['依頼者の制作リストから鑑定士が選択'],catalogKnown:Boolean(source)};});return {stones,uncovered:[],unmatchedColors:[]};}
root.ClientStones={items,recommend,select};
})(globalThis);
