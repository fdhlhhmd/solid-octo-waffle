const KEY="petal-habits-v1",ICONS=["droplet","leaf","book","moon","heart","coffee","music","star","sun"];
const DEFAULTS=[{id:"h1",name:"Drink water",icon:"droplet"},{id:"h2",name:"Stretch it out",icon:"leaf"},{id:"h3",name:"Read a few pages",icon:"book"},{id:"h4",name:"Sleep before midnight",icon:"moon"}];
let S={habits:DEFAULTS,log:{}};
try{const r=localStorage.getItem(KEY);if(r){const p=JSON.parse(r);if(p&&Array.isArray(p.habits)&&p.log)S=p}}catch(e){}
S.habits.forEach((h,i)=>{if(!h.icon)h.icon=ICONS[i%ICONS.length]});
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const $=id=>document.getElementById(id);
const ic=n=>`<svg class="ic" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const k=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const today=new Date();today.setHours(0,0,0,0);
let sel=new Date(today),ei=0,animKey=null;
const mobile=()=>matchMedia("(max-width:759px)").matches;
const doneOn=(d,id)=>(S.log[k(d)]||[]).includes(id);
const ratio=d=>{const n=S.habits.length;return n?S.habits.filter(h=>doneOn(d,h.id)).length/n:0};
const perfectDay=d=>S.habits.length>0&&ratio(d)>=1;
function streakFor(test){let d=new Date(today);if(!test(d))d.setDate(d.getDate()-1);let n=0;while(test(d)){n++;d.setDate(d.getDate()-1)}return n}
function perfectKeys(){return Object.keys(S.log).filter(x=>perfectDay(new Date(x+"T00:00:00"))).sort()}
function bestStreak(){let best=0,run=0,prev=null;for(const s of perfectKeys()){const d=new Date(s+"T00:00:00");run=(prev&&Math.round((d-prev)/864e5)===1)?run+1:1;prev=d;best=Math.max(best,run)}return best}
function render(){
 const n=S.habits.length,isToday=k(sel)===k(today),r=ratio(sel),cnt=S.habits.filter(h=>doneOn(sel,h.id)).length;
 $("dayTitle").textContent=isToday?"Today's habits":sel.toLocaleDateString(undefined,{weekday:"long",month:"short",day:"numeric"});
 $("todayBtn").hidden=isToday;$("fill").style.width=(r*100)+"%";
 const full=r===1&&n;
 $("mouth").setAttribute("d",full?"M50 80 Q60 96 70 80 Z":r>=.5?"M52 82 Q60 91 68 82":r>0?"M54 82 Q60 88 66 82":"M55 85 Q60 82 65 85");
 $("mouth").setAttribute("fill",full?"#ff6f9c":"none");
 $("msg").textContent=!n?"Add your first habit to begin.":full?"All done. A new flower bloomed.":cnt?`${cnt} of ${n} done. Keep watering.`:`0 of ${n} done. Plant today's seed.`;
 $("sNow").textContent=streakFor(perfectDay);$("sBest").textContent=bestStreak();$("sTotal").textContent=perfectKeys().length;
 const H=$("habits");H.innerHTML="";
 if(!n)H.innerHTML='<div class="hint">No habits yet. Add one below.</div>';
 S.habits.forEach(h=>{const on=doneOn(sel,h.id),s=streakFor(d=>doneOn(d,h.id)),el=document.createElement("div");
  el.className="habit"+(on?" done":"");
  el.innerHTML=`<button class="tick" aria-pressed="${on}" aria-label="Mark done">${ic("check")}</button><span class="hic">${ic(h.icon)}</span><span class="name"></span><span class="streak${s?"":" off"}">${ic("flame")}${s}</span><button class="del" aria-label="Delete habit">${ic("trash")}</button>`;
  el.querySelector(".name").textContent=h.name;el.querySelector(".tick").setAttribute("aria-label","Mark "+h.name+" done");
  el.querySelector(".tick").onclick=()=>toggle(h.id);
  el.querySelector(".del").onclick=()=>ask("Delete habit?",'"'+h.name+'" will be removed from your list.',"Delete",()=>{S.habits=S.habits.filter(x=>x.id!==h.id);save();render()});
  H.appendChild(el)});
 renderGarden();renderCal()}
let onYes=null;
function ask(title,text,yes,fn){$("mTitle").textContent=title;$("mText").textContent=text;$("mYes").textContent=yes;onYes=fn;$("modal").hidden=false;$("mNo").focus()}
function closeAsk(){$("modal").hidden=true;onYes=null}
$("mNo").onclick=closeAsk;
$("mYes").onclick=()=>{const f=onYes;closeAsk();if(f)f()};
$("modal").addEventListener("click",e=>{if(e.target===$("modal"))closeAsk()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("modal").hidden)closeAsk()});
$("resetBtn").onclick=()=>ask("Wipe everything?","This deletes all your habits, progress, streaks and flowers. It can't be undone.","Wipe all",()=>{S={habits:[],log:{}};sel=new Date(today);animKey=null;save();render()});
function toggle(id){const key=k(sel),was=perfectDay(sel),l=S.log[key]||[];
 S.log[key]=l.includes(id)?l.filter(x=>x!==id):[...l,id];
 if(!was&&perfectDay(sel))animKey=key;else animKey=null;
 save();render()}
function hash(s){let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))%100003;return h}
function flower(key,full,r,anim){
 const h=hash(key),rnd=i=>{const t=Math.sin(h*12.9898+i*78.233)*43758.5453;return t-Math.floor(t)};
 const cols=["#ff7fb0","#ff9bbb","#ffffff","#ffc2d6","#ff5c9a","#e3b8ff"],c=cols[Math.floor(rnd(3)*cols.length)];
 const st=full?46+rnd(1)*34:r>=.5?40:r>0?22:0,sw=(rnd(2)-.5)*10;
 let g="";
 if(st){g+=`<path d="M0 0C${sw} ${-st*.4} ${-sw} ${-st*.7} 0 ${-st}" stroke="var(--leaf)" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  g+=`<path d="M0 ${-st*.3}q14 -4 16 -16q-14 0 -16 16z" fill="var(--leaf)"/>`;
  if(!full&&r<.5)g+=`<path d="M0 ${-st}q-12 -2 -13 -12q12 0 13 12z" fill="var(--leaf)"/>`}
 if(full){g+=`<g transform="translate(0 ${-st})" stroke="var(--stroke)" stroke-width="1.2" fill="${c}">`;for(let a=0;a<6;a++)g+=`<ellipse cx="0" cy="-9" rx="5.500" ry="9" transform="rotate(${a*60})"/>`;g+=`<circle r="5" fill="#ffd36e" stroke="none"/></g>`}
 else if(r>=.5)g+=`<ellipse cx="0" cy="${-st-6}" rx="5" ry="8" fill="#ff9bbb" stroke="var(--stroke)" stroke-width="1.200"/>`;
 else g+=`<ellipse cx="0" cy="1" rx="14" ry="5" fill="var(--dirt)"/>`;
 return `<g class="${anim?"grow":""}">${g}</g>`}
function renderGarden(){
 const G=$("garden"),keys=perfectKeys(),tk=k(today),tp=keys.includes(tk);
 const GW=mobile()?600:1280,per=Math.round(GW/50),gap=(GW-72)/(per-1);
 G.setAttribute("viewBox",`0 0 ${GW} 240`);
 let items=keys.slice(-(per*3-1)).map(x=>({key:x,full:true}));
 if(!tp)items.push({key:tk,full:false,r:ratio(today)});
 const place=items.map((it,i)=>{const row=Math.floor(i/per),col=i%per,j=hash(it.key);
  return{...it,row,x:36+col*gap+((j%14)-7),y:214-row*18,s:1-row*.12}}).sort((a,b)=>b.row-a.row);
 let svg=`<circle cx="${GW-55}" cy="48" r="22" fill="var(--sun)"/><ellipse cx="${GW*.22}" cy="52" rx="42" ry="12" fill="var(--cloud)"/><ellipse cx="${GW*.22+28}" cy="42" rx="26" ry="12" fill="var(--cloud)"/><ellipse cx="${GW*.62}" cy="80" rx="34" ry="9" fill="var(--cloud)"/><ellipse cx="${GW*.4}" cy="38" rx="30" ry="8" fill="var(--cloud)"/>`;
 svg+=`<path d="M0 185Q${GW/4} 160 ${GW/2} 182T${GW} 172V240H0Z" fill="var(--hill2)"/><path d="M0 206Q${GW/3} 182 ${GW*2/3} 204T${GW} 196V240H0Z" fill="var(--hill1)"/>`;
 place.forEach(p=>{svg+=`<g transform="translate(${p.x} ${p.y}) scale(${p.s})">${flower(p.key,p.full,p.r||0,p.key===animKey)}</g>`});
 G.innerHTML=svg;
 const total=keys.length;
 $("gardenNote").textContent=total+(total===1?" flower":" flowers")+" grown";
}
function renderCal(){
 const W=26,v=mobile(),C=$("cal"),M=$("months");C.innerHTML="";M.innerHTML="";
 const start=new Date(today);start.setDate(start.getDate()-today.getDay()-(W-1)*7);
 let perfect=0,lastM=-1;
 for(let n=0;n<W;n++){
  const w=v?W-1-n:n;
  const wk=new Date(start);wk.setDate(start.getDate()+w*7);const sp=document.createElement("span");
  const md=v?new Date(wk.getTime()+3*864e5):wk;
  const show=v?md.getMonth()!==lastM:(md.getMonth()!==lastM&&(w<W-1||wk.getDate()<=7||lastM===-1));
  if(show){sp.textContent=md.toLocaleDateString(undefined,{month:"short"});lastM=md.getMonth()}
  M.appendChild(sp);
  for(let i=0;i<7;i++){
   const d=new Date(wk);d.setDate(wk.getDate()+i);const r=ratio(d),b=document.createElement("button"),f=perfectDay(d);
   b.className="cell"+(f?" l3":r>=.5?" l2":r>0?" l1":"")+(k(d)===k(today)?" today":"")+(k(d)===k(sel)?" sel":"")+(d>today?" fut":"");
   if(f)perfect++;
   b.title=d.toDateString()+": "+Math.round(r*100)+"% done";b.setAttribute("aria-label",b.title);
   if(d<=today)b.onclick=()=>{sel=d;animKey=null;render();if(mobile())setTab("today")};else b.disabled=true;
   C.appendChild(b)}}
 $("logSum").textContent=perfect+(perfect===1?" perfect day":" perfect days");
 const sc=$("logScroll");if(!v&&!renderCal.done){sc.scrollLeft=sc.scrollWidth;renderCal.done=1}}
function setTab(t){document.body.dataset.tab=t;document.querySelectorAll(".tabs button").forEach(b=>b.setAttribute("aria-selected",b.dataset.tab===t));window.scrollTo(0,0);if(t==="log"){const sc=$("logScroll");sc.scrollLeft=sc.scrollWidth}}
document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
matchMedia("(max-width:759px)").addEventListener("change",()=>{renderGarden();renderCal()});
$("todayBtn").onclick=()=>{sel=new Date(today);animKey=null;render()};
$("pick").innerHTML=ic(ICONS[0]);
$("pick").onclick=()=>{ei=(ei+1)%ICONS.length;$("pick").innerHTML=ic(ICONS[ei])};
function add(){const v=$("newName").value.trim();if(!v){$("newName").focus();return}
 S.habits.push({id:"h"+Date.now(),name:v,icon:ICONS[ei]});$("newName").value="";save();render()}
$("addBtn").onclick=add;$("newName").addEventListener("keydown",e=>{if(e.key==="Enter")add()});
const mq=matchMedia("(prefers-color-scheme: dark)");
function applyTheme(t){document.documentElement.setAttribute("data-theme",t);const d=t==="dark";$("theme").innerHTML=ic(d?"sun":"moon");$("theme").setAttribute("aria-label",d?"Switch to light mode":"Switch to dark mode")}
let saved=null;try{saved=localStorage.getItem("petal-theme")}catch(e){}
applyTheme(saved==="dark"||saved==="light"?saved:(mq.matches?"dark":"light"));
$("theme").onclick=()=>{const n=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";applyTheme(n);try{localStorage.setItem("petal-theme",n)}catch(e){}};
render();