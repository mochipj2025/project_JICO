/* ブラウザ内の素材在庫。未登録とゼロを区別し、保存成功後だけ状態を更新。 */
(function(root){
'use strict';
const key='jico.material-inventory.v1',units=['g','個','袋'];
function empty(){return {format:'jico-inventory-v1',materials:{},history:[]};}
function number(value,label){if(value===''||value==null||!Number.isFinite(Number(value))||Number(value)<0||Number(value)>1e9)throw Error(label+'は0以上の数値を入力してください。');const n=Number(value);if(Math.abs(n*1000-Math.round(n*1000))>1e-5)throw Error(label+'は小数第3位までです。');return n;}
function validate(data){if(!data||data.format!=='jico-inventory-v1'||!data.materials||typeof data.materials!=='object'||Array.isArray(data.materials)||!Array.isArray(data.history))throw Error('このサイトで保存した在庫JSONを選んでください。');const ids=new Set(ClientStones.items.map(s=>s.id));for(const [id,m] of Object.entries(data.materials)){if(!ids.has(id)||!m||!units.includes(m.unit))throw Error('素材・単位が不正です。');number(m.quantity,'在庫');number(m.low,'補充目安');if(m.unit!=='g'&&(!Number.isInteger(m.quantity)||!Number.isInteger(m.low)))throw Error('個・袋の在庫は整数で指定してください。');}for(const h of data.history){if(!h||!ids.has(h.id)||!['set','in','out','settings'].includes(h.action)||!units.includes(h.unit)||typeof h.at!=='string'||typeof h.note!=='string')throw Error('履歴の形式が不正です。');number(h.before??0,'変更前');number(h.after,'変更後');}return JSON.parse(JSON.stringify(data));}
function create(storage){let raw=null,data=empty(),error='';try{raw=storage.getItem(key);if(raw)data=validate(JSON.parse(raw));}catch(e){error='在庫を読み込めませんでした。保存データを上書きせず、JSONを確認してください。';}
function get(id){return data.materials[id]||null;}
function save(next){if(error)throw Error(error);try{if(storage.getItem(key)!==raw)throw Error('別のタブで在庫が変更されています。ページを再読み込みしてください。');const text=JSON.stringify(next);storage.setItem(key,text);raw=text;data=next;}catch(e){throw Error('保存できませんでした：'+e.message);}return data;}
function change(id,action,value,unit,low,note=''){if(!ClientStones.items.some(s=>s.id===id)||!units.includes(unit)||!['set','in','out','settings'].includes(action))throw Error('素材・操作・単位を確認してください。');const old=get(id);if(old&&old.quantity>0&&old.unit!==unit)throw Error('在庫がある素材の単位は変更できません。換算後の数量を確認し、在庫0の状態で変更してください。');if(!old&&action!=='set')throw Error('初回は「現在数を登録・棚卸し」で在庫を登録してください。');const amount=action==='settings'?0:number(value,'数量'),threshold=number(low,'補充目安');if(unit!=='g'&&(!Number.isInteger(amount)||!Number.isInteger(threshold)))throw Error('個・袋の数量と補充目安は整数で入力してください。');if((action==='in'||action==='out')&&amount===0)throw Error('入荷・使用量は0より大きくしてください。');const before=old?old.quantity:null;let after=action==='set'?amount:action==='settings'?before:action==='in'?before+amount:before-amount;after=Math.round(after*1000)/1000;if(after<0)throw Error('在庫が不足しています。使用量を確認してください。');number(after,'在庫');if(String(note).length>200)throw Error('メモは200文字以下にしてください。');const next=JSON.parse(JSON.stringify(data));next.materials[id]={quantity:after,unit,low:threshold};next.history.push({id,action,amount,before,after,unit,at:new Date().toISOString(),note:String(note).trim()});save(next);return get(id);}
function available(id){return !get(id)||get(id).quantity>0;}
function snapshot(){return JSON.parse(JSON.stringify(data));}
function restore(value){const next=validate(value);if(error){throw Error(error);}return save(next);}
return {get,change,available,snapshot,restore,error};}
root.InventoryStore={create,validate,units};
try{root.MaterialInventory=create(root.localStorage);}catch{root.MaterialInventory=create({getItem(){throw Error('保存不可')},setItem(){throw Error('保存不可')}});}
})(globalThis);
