import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
const engine=read('../統合版ソース確認/sanmeigaku/engine.js');
const end=engine.lastIndexOf('calc.addEventListener(');
if(end<0)throw Error('エンジン起動境界が見つかりません');
// 正本を変更せず、通常UI起動を除外した閉包から入口だけ公開する。
const bundle=`/* 自動生成: build-data.mjs。算命学正本は変更しない。 */\n(()=>{\n${engine.slice(0,end)}\nglobalThis.SanmeiEngine={calculate:calc08};\n})();\n`+read('../凛の開運ナビ-鑑定書統合版/maker/stone-selector.js');
fs.writeFileSync(new URL('./engine-data.js',import.meta.url),bundle);
console.log('engine-data.js generated');
