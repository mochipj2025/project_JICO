const STEMS=["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"],BRANCHES=["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const META=[["木","陽"],["木","陰"],["火","陽"],["火","陰"],["土","陽"],["土","陰"],["金","陽"],["金","陰"],["水","陽"],["水","陰"]],VOID=[["戌","亥"],["申","酉"],["午","未"],["辰","巳"],["寅","卯"],["子","丑"]];
const JIE=[["小寒",285,"丑"],["立春",315,"寅"],["啓蟄",345,"卯"],["清明",15,"辰"],["立夏",45,"巳"],["芒種",75,"午"],["小暑",105,"未"],["立秋",135,"申"],["白露",165,"酉"],["寒露",195,"戌"],["立冬",225,"亥"],["大雪",255,"子"]];
const L=[
[[175347046,0,0],[3341656,4.6692568,6283.07585],[34894,4.6261,12566.1517],[3497,2.7441,5753.3849],[3418,2.8289,3.5231],[3136,3.6277,77713.7715],[2676,4.4181,7860.4194],[2343,6.1352,3930.2097],[1324,.7425,11506.7698],[1273,2.0371,529.691],[1199,1.1096,1577.3435],[990,5.233,5884.927],[902,2.045,26.298],[857,3.508,398.149],[780,1.179,5223.694],[753,2.533,5507.553],[505,4.583,18849.228],[492,4.205,775.523],[357,2.920,.067],[317,5.849,11790.629],[284,1.899,796.298],[271,.315,10977.079],[243,.345,5486.778],[206,4.806,2544.314],[205,1.869,5573.143],[202,2.458,6069.777],[156,.833,213.299],[132,3.411,2942.463],[126,1.083,20.775],[115,.645,.980],[103,.636,4694.003],[102,.976,15720.839],[102,4.267,7.114],[99,6.21,2146.17],[98,.68,155.42],[86,5.98,161000.69],[85,1.30,6275.96],[85,3.67,71430.70],[80,1.81,17260.15],[79,3.04,12036.46],[75,1.76,5088.63],[74,3.50,3154.69],[74,4.68,801.82],[70,.83,9437.76],[62,3.98,8827.39],[61,1.82,7084.90],[57,2.78,6286.60],[56,4.39,14143.50],[56,3.47,6279.55],[52,.19,12139.55],[52,1.33,1748.02],[51,.28,5856.48],[49,.49,1194.45],[41,5.37,8429.24],[41,2.40,19651.05],[39,6.17,10447.39],[37,6.04,10213.29],[37,2.57,1059.38],[36,1.71,2352.87],[36,1.78,6812.77],[33,.59,17789.85],[30,.44,83996.85],[30,2.74,1349.87],[25,3.16,4690.48]],
[[628331966747,0,0],[206059,2.678235,6283.07585],[4303,2.6351,12566.1517],[425,1.590,3.523],[119,5.796,26.298],[109,2.966,1577.344],[93,2.59,18849.23],[72,1.14,529.69],[68,1.87,398.15],[67,4.41,5507.55],[59,2.89,5223.69],[56,2.17,155.42],[45,.40,796.30],[36,.47,775.52],[29,2.65,7.11],[21,5.34,.98],[19,1.85,5486.78],[19,4.97,213.30],[17,2.99,6275.96],[16,.03,2544.31],[16,1.43,2146.17],[15,1.21,10977.08],[12,2.83,1748.02],[12,3.26,5088.63],[12,5.27,1194.45],[12,2.08,4694],[11,.77,553.57],[10,1.30,6286.60],[10,4.24,1349.87],[9,2.70,242.73],[9,5.64,951.72],[8,5.30,2352.87],[6,2.65,9437.76],[6,4.67,4690.48]],
[[52919,0,0],[8720,1.0721,6283.0758],[309,.867,12566.152],[27,.05,3.52],[16,5.19,26.30],[16,3.68,155.42],[10,.76,18849.23],[9,2.06,77713.77],[7,.83,775.52],[5,4.66,1577.34],[4,1.03,7.11],[4,3.44,5573.14],[3,5.14,796.30],[3,6.05,5507.55],[3,1.19,242.73],[3,6.12,529.69],[3,.31,398.15],[3,2.28,553.57],[2,4.38,5223.69],[2,3.75,.98]],
[[289,5.844,6283.076],[35,0,0],[17,5.49,12566.15],[3,5.20,155.42],[1,4.72,3.52],[1,5.30,18849.23],[1,5.97,242.73]],[[114,3.142,0],[8,4.13,6283.08],[1,3.84,12566.15]],[[1,3.14,0]]];
const R=[
[[100013989,0,0],[1670700,3.0984635,6283.07585],[13956,3.05525,12566.1517],[3084,5.1985,77713.7715],[1628,1.1739,5753.3849],[1576,2.8469,7860.4194],[925,5.453,11506.770],[542,4.564,3930.210],[472,3.661,5884.927],[346,.964,5507.553],[329,5.900,5223.694],[307,.299,5573.143],[243,4.273,11790.629],[212,5.847,1577.344],[186,5.022,10977.079],[175,3.012,18849.228],[110,5.055,5486.778],[98,.89,6069.78],[86,5.69,15720.84],[86,1.27,161000.69],[65,.27,17260.15],[63,.92,529.69],[57,2.01,83996.85],[56,5.24,71430.70],[49,3.25,2544.31],[47,2.58,775.52],[45,5.54,9437.76],[43,6.01,6275.96],[39,5.36,4694],[38,2.39,8827.39],[37,.83,19651.05],[37,4.90,12139.55],[36,1.67,12036.46],[35,1.84,2942.46],[33,.24,7084.90],[32,.18,5088.63],[32,1.78,398.15],[28,1.21,6286.60],[28,1.90,6279.55],[26,4.59,10447.39]],
[[103019,1.10749,6283.07585],[1721,1.0644,12566.1517],[702,3.142,0],[32,1.02,18849.23],[31,2.84,5507.55],[25,1.32,5223.69],[18,1.42,1577.34],[10,5.91,10977.08],[9,1.42,6275.96],[9,.27,5486.78]],[[4359,5.7846,6283.0758],[124,5.579,12566.152],[12,3.14,0],[9,3.63,77713.77],[6,1.87,5573.14],[3,5.47,18849.23]],[[145,4.273,6283.076],[7,3.92,12566.15]],[[4,2.56,6283.08]]];
const OFFICIAL={"1987-立春":"1987-02-04T17:52","1987-清明":"1987-04-05T16:44","1987-立夏":"1987-05-06T10:06","2020-立春":"2020-02-04T18:03","2020-清明":"2020-04-04T16:38","2020-立夏":"2020-05-05T09:51","2025-立春":"2025-02-03T23:10","2025-清明":"2025-04-04T21:49","2025-立夏":"2025-05-05T14:57","2026-立春":"2026-02-04T05:02","2026-清明":"2026-04-05T03:40","2026-立夏":"2026-05-05T20:49","2027-立春":"2027-02-04T10:46","2027-清明":"2027-04-05T09:17","2027-立夏":"2027-05-06T02:25"};
function norm(x){x%=360;return x<0?x+360:x} function jdUTC(d){return d.getTime()/86400000+2440587.5}
function deltaT(y){let t;if(y>=2005&&y<2050){t=y-2000;return 62.92+.32217*t+.005589*t*t}if(y>=1986&&y<2005){t=y-2000;return 63.86+.3345*t-.060374*t*t+.0017275*t**3+.000651814*t**4+.00002373599*t**5}if(y>=1961&&y<1986){t=y-1975;return 45.45+1.067*t-t*t/260-t**3/718}if(y>=2050&&y<2150)return -20+32*((y-1820)/100)**2-.5628*(2150-y);t=(y-1820)/100;return -20+32*t*t}
function sumSeries(S,t){let total=0,p=1;for(const terms of S){let s=0;for(const q of terms)s+=q[0]*Math.cos(q[1]+q[2]*t);total+=s*p;p*=t}return total/1e8}
function apparentLongitude(d){let jd=jdUTC(d),jde=jd+deltaT(d.getUTCFullYear())/86400,tau=(jde-2451545)/365250,T=(jde-2451545)/36525;
 let lh=norm(sumSeries(L,tau)*180/Math.PI),rv=sumSeries(R,tau),om=125.04452-1934.136261*T+.0020708*T*T+T**3/450000,ls=280.4665+36000.7698*T,lm=218.3165+481267.8813*T;
 let dpsi=(-17.20*Math.sin(om*Math.PI/180)-1.32*Math.sin(2*ls*Math.PI/180)-.23*Math.sin(2*lm*Math.PI/180)+.21*Math.sin(2*om*Math.PI/180))/3600;
 return norm(lh+180+dpsi-20.4898/(3600*rv))}
function ad(a,b){return ((a-b+540)%360)-180} function roughMonth(t){return t===285?1:t===315?2:t===345?3:t===15?4:t===45?5:t===75?6:t===105?7:t===135?8:t===165?9:t===195?10:t===225?11:12}
function solarTerm(y,target){let m=roughMonth(target),lo=new Date(Date.UTC(y,m-1,1)),hi=new Date(Date.UTC(y,m-1,10));for(let i=0;i<60;i++){let mid=new Date((lo.getTime()+hi.getTime())/2);if(ad(apparentLongitude(mid),target)<0)lo=mid;else hi=mid}return new Date((lo.getTime()+hi.getTime())/2)}
function jst(d){let x=new Date(d.getTime()+32400000);return {y:x.getUTCFullYear(),m:x.getUTCMonth()+1,d:x.getUTCDate(),h:x.getUTCHours(),mi:x.getUTCMinutes()}}
function fmt(d){let p=jst(d);return `${p.y}-${String(p.m).padStart(2,"0")}-${String(p.d).padStart(2,"0")} ${String(p.h).padStart(2,"0")}:${String(p.mi).padStart(2,"0")}`}
function ganzhi(i){i=(i%60+60)%60;return STEMS[i%10]+BRANCHES[i%12]} function jdn(y,m,d){let a=Math.floor((14-m)/12),yy=y+4800-a,mm=m+12*a-3;return d+Math.floor((153*mm+2)/5)+365*yy+Math.floor(yy/4)-Math.floor(yy/100)+Math.floor(yy/400)-32045}
function dayData(y,m,d){let J=jdn(y,m,d),i=((J+49)%60+60)%60,s=i%10;return {index:i,label:ganzhi(i),stem:STEMS[s],element:META[s][0],polarity:META[s][1]}} function voidName(i){return VOID[Math.floor(i/10)].join("")+"天中殺"}
function inputUTC(ds,ts){
 let dm=/^(\d{4})-(\d{2})-(\d{2})$/.exec(ds||""),tm=/^(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/.exec(ts||"00:00");
 if(!dm||!tm)return null;
 let y=+dm[1],m=+dm[2],d=+dm[3],h=+tm[1],mi=+tm[2],s=+(tm[3]||0),ms=+(tm[4]||"").padEnd(3,"0");
 if(m<1||m>12||h>23||mi>59||s>59)return null;
 let civil=new Date(Date.UTC(y,m-1,d,h,mi,s,ms));
 if(civil.getUTCFullYear()!==y||civil.getUTCMonth()!==m-1||civil.getUTCDate()!==d)return null;
 return new Date(civil.getTime()-9*3600000);
}
function latestJie(utc,y){let a=[];for(let yy of [y-1,y])for(const x of JIE)a.push({name:x[0],branch:x[2],utc:solarTerm(yy,x[1])});return a.filter(x=>x.utc<=utc).sort((a,b)=>b.utc-a.utc)[0]}
function monthPillar(ys,b){let start={"甲":2,"己":2,"乙":4,"庚":4,"丙":6,"辛":6,"丁":8,"壬":8,"戊":0,"癸":0}[ys],off=(BRANCHES.indexOf(b)-2+12)%12;return STEMS[(start+off)%10]+b}
function calculate(ds,ts){
 let utc=inputUTC(ds,ts);
 if(!utc)return {error:"生年月日または出生時刻が正しくありません。"};
 let local=jst(utc),y=local.y,m=local.m,d=local.d;
 if(y<1900||y>2099)return {error:"検証範囲は1900〜2099年です。"};
 let day=dayData(y,m,d),lc=solarTerm(y,315),ay=utc<lc?y-1:y,yp=ganzhi(ay-4),jie=latestJie(utc,y),mp=monthPillar(yp[0],jie.branch);
 return {input:{date:ds,time:ts||"00:00",timezone:"Asia/Tokyo"},yearPillar:yp,monthPillar:mp,dayPillar:day.label,dayMaster:day.stem,dayMasterElement:day.polarity+day.element,tenchusatsu:voidName(day.index),boundaries:{lichunJST:fmt(lc),latestJie:jie.name,latestJieJST:fmt(jie.utc),monthBranch:jie.branch},engine:"VSOP87 abridged + ΔT + nutation + aberration"}
}
function parseOfficial(s){let [da,ti]=s.split("T"),[y,m,d]=da.split("-").map(Number),[h,mi]=ti.split(":").map(Number);return new Date(Date.UTC(y,m-1,d,h-9,mi))}
function verify(){document.getElementById("tests").innerHTML=Object.entries(OFFICIAL).map(([k,v])=>{let [ys,n]=k.split("-"),t=JIE.find(x=>x[0]===n)[1],c=solarTerm(+ys,t),o=parseOfficial(v),e=(c-o)/60000,ok=Math.abs(e)<=1;return `<tr><td>${ys} ${n}</td><td>${v.replace("T"," ")}</td><td>${fmt(c)}</td><td>${e>=0?"+":""}${e.toFixed(1)}分</td><td class="${ok?"ok":"warn"}">${ok?"合格":"要確認"}</td></tr>`}).join("")}
function render(){let r=calculate(birth.value,time.value);if(r.error){summary.innerHTML=`<p class="warn">${r.error}</p>`;return}summary.innerHTML=`<p><b>年柱：</b>${r.yearPillar}</p><p><b>月柱：</b>${r.monthPillar}</p><p><b>日柱：</b>${r.dayPillar}</p><p><b>日干：</b>${r.dayMaster} ／ ${r.dayMasterElement}</p><p><b>天中殺：</b>${r.tenchusatsu}</p>`;trace.innerHTML=`<p><span class="pill">立春</span>${r.boundaries.lichunJST}</p><p><span class="pill">直前の節</span>${r.boundaries.latestJie} ${r.boundaries.latestJieJST}</p><p><span class="pill">月支</span>${r.boundaries.monthBranch}月 → ${r.monthPillar}</p>`;json.textContent=JSON.stringify(r,null,2)}


// v0.6 二十八元（算命学）
const NIJUHACHIGEN={
"子":[["本元","癸",null]],"丑":[["初元","癸",9],["中元","辛",3],["本元","己",null]],
"寅":[["初元","戊",7],["中元","丙",7],["本元","甲",null]],"卯":[["本元","乙",null]],
"辰":[["初元","乙",9],["中元","癸",3],["本元","戊",null]],"巳":[["初元","戊",5],["中元","庚",9],["本元","丙",null]],
"午":[["中元","己",19],["本元","丁",null]],"未":[["初元","丁",9],["中元","乙",3],["本元","己",null]],
"申":[["初元","戊",10],["中元","壬",3],["本元","庚",null]],"酉":[["本元","辛",null]],
"戌":[["初元","辛",9],["中元","丁",3],["本元","戊",null]],"亥":[["中元","甲",12],["本元","壬",null]]};
function jieDayNo(u,j){let a=jst(u),b=jst(j);return Math.floor((Date.UTC(a.y,a.m-1,a.d)-Date.UTC(b.y,b.m-1,b.d))/86400000)+1}
function hidden(branch,n){let total=0;for(const [phase,stem,len] of NIJUHACHIGEN[branch]){let start=total+1;if(len===null)return{phase,stem,start,end:null};total+=len;if(n<=total)return{phase,stem,start,end:total}}}
function detail(branch,n){let total=0;return NIJUHACHIGEN[branch].map(([phase,stem,len])=>{let start=total+1;if(len!==null)total+=len;let end=len===null?null:total;return{phase,stem,start,end,active:end===null?n>=start:n>=start&&n<=end}})}
function calc06(ds,ts){let r=calculate(ds,ts);if(r.error)return r;let y=+ds.slice(0,4),u=inputUTC(ds,ts),j=latestJie(u,y),n=jieDayNo(u,j.utc);r.nijuhachigen={branch:j.branch,dayNumber:n,countRule:"節入り当日を1日目（JST暦日）",active:hidden(j.branch,n),table:detail(j.branch,n)};return r}
function render06(){let r=calc06(birth.value,time.value);if(r.error){summary.innerHTML=`<p class="warn">${r.error}</p>`;return}
summary.innerHTML=`<p><b>年柱：</b>${r.yearPillar}</p><p><b>月柱：</b>${r.monthPillar}</p><p><b>日柱：</b>${r.dayPillar}</p><p><b>日干：</b>${r.dayMaster} ／ ${r.dayMasterElement}</p><p><b>天中殺：</b>${r.tenchusatsu}</p>`;
trace.innerHTML=`<p><span class="pill">立春</span>${r.boundaries.lichunJST}</p><p><span class="pill">直前の節</span>${r.boundaries.latestJie} ${r.boundaries.latestJieJST}</p><p><span class="pill">月支</span>${r.boundaries.monthBranch}月 → ${r.monthPillar}</p>`;
let n=r.nijuhachigen,a=n.active;nij.innerHTML=`<p><b>月支：</b>${n.branch}　<b>節入りから：</b>${n.dayNumber}日目</p><p class="big"><b>採用二十八元：</b>${a.stem}（${a.phase}）</p><table><thead><tr><th>区分</th><th>干</th><th>適用日</th><th>判定</th></tr></thead><tbody>${n.table.map(x=>`<tr><td>${x.phase}</td><td>${x.stem}</td><td>${x.end?x.start+"〜"+x.end+"日目":x.start+"日目以降"}</td><td class="${x.active?"ok":""}">${x.active?"採用":"—"}</td></tr>`).join("")}</tbody></table>`;json.textContent=JSON.stringify(r,null,2)}
function ntests(){let T=[["丑",9,"癸"],["丑",10,"辛"],["丑",13,"己"],["寅",7,"戊"],["寅",8,"丙"],["寅",15,"甲"],["辰",9,"乙"],["辰",10,"癸"],["辰",13,"戊"],["巳",5,"戊"],["巳",6,"庚"],["巳",15,"丙"],["午",19,"己"],["午",20,"丁"],["亥",12,"甲"],["亥",13,"壬"]];nijtests.innerHTML=T.map(t=>{let a=hidden(t[0],t[1]),ok=a.stem===t[2];return `<tr><td>${t[0]} ${t[1]}日目</td><td>${t[2]}</td><td>${a.stem}（${a.phase}）</td><td class="${ok?"ok":"warn"}">${ok?"一致":"不一致"}</td></tr>`}).join("")}



const SM={"甲":["木",1],"乙":["木",0],"丙":["火",1],"丁":["火",0],"戊":["土",1],"己":["土",0],"庚":["金",1],"辛":["金",0],"壬":["水",1],"癸":["水",0]};
const GEN={"木":"火","火":"土","土":"金","金":"水","水":"木"},CTL={"木":"土","土":"水","水":"火","火":"金","金":"木"};
const MAIN={"子":"癸","丑":"己","寅":"甲","卯":"乙","辰":"戊","巳":"丙","午":"丁","未":"己","申":"庚","酉":"辛","戌":"戊","亥":"壬"};
function shusei(d,t){let[a,pa]=SM[d],[b,pb]=SM[t],same=pa===pb;if(a===b)return same?"貫索星":"石門星";if(GEN[a]===b)return same?"鳳閣星":"調舒星";if(CTL[a]===b)return same?"禄存星":"司禄星";if(CTL[b]===a)return same?"車騎星":"牽牛星";if(GEN[b]===a)return same?"龍高星":"玉堂星"}
function calc07(ds,ts){let r=calc06(ds,ts);if(r.error)return r;let ys=r.yearPillar[0],yb=r.yearPillar[1],ms=r.monthPillar[0],db=r.dayPillar[1],d=r.dayMaster;
let x={north:["北","年干",ys],south:["南","月干",ms],east:["東","年支本元",MAIN[yb]],center:["中央","月支二十八元",r.nijuhachigen.active.stem],west:["西","日支本元",MAIN[db]]};
for(let k in x)x[k]={label:x[k][0],source:x[k][1],stem:x[k][2],star:shusei(d,x[k][2])};r.judaiShusei={dayMaster:d,targets:x,centerStar:x.center.star};return r}
function render07(){let r=calc07(birth.value,time.value);if(r.error)return;render06();let t=r.judaiShusei.targets;
star.innerHTML=`<p>基準日干：<b>${r.dayMaster}</b></p><div class="chart"><div class="north">北<br><b>${t.north.star}</b><small>${t.north.source} ${t.north.stem}</small></div><div class="west">西<br><b>${t.west.star}</b><small>${t.west.source} ${t.west.stem}</small></div><div class="center">中央<br><b>${t.center.star}</b><small>${t.center.source} ${t.center.stem}</small></div><div class="east">東<br><b>${t.east.star}</b><small>${t.east.source} ${t.east.stem}</small></div><div class="south">南<br><b>${t.south.star}</b><small>${t.south.source} ${t.south.stem}</small></div></div><p class="big"><b>中心星：</b>${r.judaiShusei.centerStar}</p>`;
json.textContent=JSON.stringify(r,null,2)}
const ST=["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const EX={
"甲":["貫索星","石門星","鳳閣星","調舒星","禄存星","司禄星","車騎星","牽牛星","龍高星","玉堂星"],"乙":["石門星","貫索星","調舒星","鳳閣星","司禄星","禄存星","牽牛星","車騎星","玉堂星","龍高星"],
"丙":["龍高星","玉堂星","貫索星","石門星","鳳閣星","調舒星","禄存星","司禄星","車騎星","牽牛星"],"丁":["玉堂星","龍高星","石門星","貫索星","調舒星","鳳閣星","司禄星","禄存星","牽牛星","車騎星"],
"戊":["車騎星","牽牛星","龍高星","玉堂星","貫索星","石門星","鳳閣星","調舒星","禄存星","司禄星"],"己":["牽牛星","車騎星","玉堂星","龍高星","石門星","貫索星","調舒星","鳳閣星","司禄星","禄存星"],
"庚":["禄存星","司禄星","車騎星","牽牛星","龍高星","玉堂星","貫索星","石門星","鳳閣星","調舒星"],"辛":["司禄星","禄存星","牽牛星","車騎星","玉堂星","龍高星","石門星","貫索星","調舒星","鳳閣星"],
"壬":["鳳閣星","調舒星","禄存星","司禄星","車騎星","牽牛星","龍高星","玉堂星","貫索星","石門星"],"癸":["調舒星","鳳閣星","司禄星","禄存星","牽牛星","車騎星","玉堂星","龍高星","石門星","貫索星"]};
function stest(){let n=0,rows="";for(let d of ST)for(let i=0;i<10;i++){let g=shusei(d,ST[i]),ok=g===EX[d][i];if(ok)n++;rows+=`<tr><td>${d}×${ST[i]}</td><td>${EX[d][i]}</td><td>${g}</td><td class="${ok?"ok":"warn"}">${ok?"一致":"不一致"}</td></tr>`}starcount.textContent=n+" / 100 一致";startests.innerHTML=rows}



// v0.8 十二大従星
const BR=["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const JUSEI_TABLE={
"甲":["天恍星","天南星","天禄星","天将星","天堂星","天胡星","天極星","天庫星","天馳星","天報星","天印星","天貴星"],
"乙":["天胡星","天堂星","天将星","天禄星","天南星","天恍星","天貴星","天印星","天報星","天馳星","天庫星","天極星"],
"丙":["天報星","天印星","天貴星","天恍星","天南星","天禄星","天将星","天堂星","天胡星","天極星","天庫星","天馳星"],
"丁":["天馳星","天庫星","天極星","天胡星","天堂星","天将星","天禄星","天南星","天恍星","天貴星","天印星","天報星"],
"戊":["天報星","天印星","天貴星","天恍星","天南星","天禄星","天将星","天堂星","天胡星","天極星","天庫星","天馳星"],
"己":["天馳星","天庫星","天極星","天胡星","天堂星","天将星","天禄星","天南星","天恍星","天貴星","天印星","天報星"],
"庚":["天極星","天庫星","天馳星","天報星","天印星","天貴星","天恍星","天南星","天禄星","天将星","天堂星","天胡星"],
"辛":["天貴星","天印星","天報星","天馳星","天庫星","天極星","天胡星","天堂星","天将星","天禄星","天南星","天恍星"],
"壬":["天将星","天堂星","天胡星","天極星","天庫星","天馳星","天報星","天印星","天貴星","天恍星","天南星","天禄星"],
"癸":["天禄星","天南星","天恍星","天貴星","天印星","天報星","天馳星","天庫星","天極星","天胡星","天堂星","天将星"]};
const ENERGY={"天報星":3,"天印星":6,"天貴星":9,"天恍星":7,"天南星":10,"天禄星":11,"天将星":12,"天堂星":8,"天胡星":4,"天極星":2,"天庫星":5,"天馳星":1};
function jusei(dm,b){return JUSEI_TABLE[dm][BR.indexOf(b)]}
function calc08(ds,ts){let r=calc07(ds,ts);if(r.error)return r;let yb=r.yearPillar[1],mb=r.monthPillar[1],db=r.dayPillar[1],d=r.dayMaster;
r.junidaiJusei={dayMaster:d,early:{period:"初年期",source:"年支",branch:yb,star:jusei(d,yb)},middle:{period:"中年期",source:"月支",branch:mb,star:jusei(d,mb)},late:{period:"晩年期",source:"日支",branch:db,star:jusei(d,db)}};
for(let k of ["early","middle","late"])r.junidaiJusei[k].energy=ENERGY[r.junidaiJusei[k].star];return r}
function render08(){let r=calc08(birth.value,time.value);if(r.error)return;render07();let j=r.junidaiJusei;
jusei.innerHTML=`<p>基準日干：<b>${j.dayMaster}</b></p><div class="jcards">${["early","middle","late"].map(k=>{let x=j[k];return `<div><small>${x.period}／${x.source} ${x.branch}</small><b>${x.star}</b><span>エネルギー ${x.energy}</span></div>`}).join("")}</div>
<table><thead><tr><th>時期</th><th>計算</th><th>十二大従星</th><th>エネルギー</th></tr></thead><tbody>${["early","middle","late"].map(k=>{let x=j[k];return `<tr><td>${x.period}</td><td>${j.dayMaster} × ${x.branch}</td><td><b>${x.star}</b></td><td>${x.energy}</td></tr>`}).join("")}</tbody></table>`;
json.textContent=JSON.stringify(r,null,2)}
function jtests(){let rows="",n=0,total=0;for(let d of ST)for(let i=0;i<12;i++){total++;let got=jusei(d,BR[i]),exp=JUSEI_TABLE[d][i],ok=got===exp;if(ok)n++;rows+=`<tr><td>${d}×${BR[i]}</td><td>${exp}</td><td>${got}</td><td class="${ok?"ok":"warn"}">${ok?"一致":"不一致"}</td></tr>`}jcount.textContent=`${n} / ${total} 一致`;jtestbody.innerHTML=rows}



// v0.9.3 監査版: v0.8実装の solarTerm(year, longitude) を直接利用
const AUDIT_FIXED=[
 {date:"1987-04-25",time:"06:00",year:"丁卯",month:"甲辰",day:"甲辰",void:"寅卯天中殺",note:"通常命式"}
];
function p2(n){return String(n).padStart(2,"0")}
function jstInput(ms){
 let d=new Date(ms+9*3600000);
 return {date:`${d.getUTCFullYear()}-${p2(d.getUTCMonth()+1)}-${p2(d.getUTCDate())}`,
 time:`${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}:${p2(d.getUTCSeconds())}.${String(d.getUTCMilliseconds()).padStart(3,"0")}`};
}
function audit093(){
 let rows="",okn=0,total=0,res=[];
 function add(dt,label,item,ref,got,source){
  total++;let ok=ref===got;if(ok)okn++;
  rows+=`<tr><td>${dt}</td><td>${label}</td><td>${item}</td><td>${ref}</td><td>${got}</td><td class="${ok?"ok":"warn"}">${ok?"一致":"不一致"}</td></tr>`;
  res.push({datetime:dt,label,item,reference:ref,engine:got,match:ok,source});
 }
 try{
  for(const c of AUDIT_FIXED){
   let r=calc08(c.date,c.time);
   add(c.date+" "+c.time,c.note,"年柱",c.year,r.yearPillar,"外部命式資料");
   add(c.date+" "+c.time,c.note,"月柱",c.month,r.monthPillar,"外部命式資料");
   add(c.date+" "+c.time,c.note,"日柱",c.day,r.dayPillar,"外部命式資料");
   add(c.date+" "+c.time,c.note,"天中殺",c.void,r.tenchusatsu,"外部命式資料");
  }
  const q=solarTerm(1987,15); // 清明 = apparent solar longitude 15°
  rawboundary.textContent=fmtSec(q);
  for(const [delta,label,expected] of [[-1000,"清明 -1秒","癸卯"],[0,"清明 ちょうど","甲辰"],[1000,"清明 +1秒","甲辰"]]){
   const x=jstInput(q.getTime()+delta),r=calc08(x.date,x.time);
   add(x.date+" "+x.time,label,"月柱",expected,r.monthPillar,"solarTerm(1987,15) 生timestamp");
  }
  auditcount.textContent=`${okn} / ${total} 一致`;
  auditbody.innerHTML=rows;
  auditjson.textContent=JSON.stringify({qingmingRawJST:fmtSec(q),results:res},null,2);
 }catch(e){
  rawboundary.textContent="取得失敗";auditcount.textContent="監査エラー";
  auditbody.innerHTML=`<tr><td colspan="6" class="warn">${e.message}</td></tr>`;
  auditjson.textContent=String(e.stack||e);
 }
}
function fmtSec(utc){
 let d=new Date(utc.getTime()+9*3600000);
 return `${d.getUTCFullYear()}-${p2(d.getUTCMonth()+1)}-${p2(d.getUTCDate())} ${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}:${p2(d.getUTCSeconds())} JST`;
}
calc.addEventListener("click",()=>{render08();audit093()});
render08();verify();ntests();stest();jtests();audit093();
