(() => {
"use strict";

// Submission/privacy build:
// This game is intentionally local-only. It contains no analytics, name entry,
// advertisements, or external communication. Progress is stored only in localStorage.

const $=id=>document.getElementById(id), SAVE_KEY="numberRushV1";

const fakeLeaderboard=[
{name:"brainblitz99",score:98450,icon:"🧠"},
{name:"xNeonSolver",score:96120,icon:"⚡"},
{name:"puzzlekid247",score:94880,icon:"🧩"},
{name:"ComboCrafter",score:93210,icon:"🔥"},
{name:"rizzynomics",score:91875,icon:"😎"},
{name:"AlphaAngles",score:90440,icon:"📐"},
{name:"midnightminus",score:89110,icon:"🌙"},
{name:"suddenSigma",score:88520,icon:"∑"},
{name:"NoSleepNerd",score:87330,icon:"💤"},
{name:"quickcalc.qt",score:86225,icon:"💫"},
{name:"lilbrainrot",score:85410,icon:"🌀"},
{name:"stackedstreak",score:84590,icon:"📈"},
{name:"orbitoracle",score:83370,icon:"🪐"},
{name:"VoltVortex",score:82540,icon:"🔋"},
{name:"glowupgamer",score:81720,icon:"✨"},
{name:"logiclatte",score:80810,icon:"☕"},
{name:"clutchcombo",score:79990,icon:"🎯"},
{name:"bytebandit",score:78830,icon:"💻"},
{name:"numnomad",score:77770,icon:"🔢"},
{name:"hyperhazel",score:76660,icon:"🌟"},
{name:"turbotofu",score:75400,icon:"🥢"},
{name:"sprintsolver",score:74225,icon:"🏃"},
{name:"equationera",score:73110,icon:"🧪"},
{name:"peakpattern",score:72480,icon:"🧠"},
{name:"FeverFlick",score:71750,icon:"🎮"},
{name:"quizquasar",score:70690,icon:"☄️"},
{name:"latticelegend",score:69540,icon:"👑"},
{name:"brainberry",score:68420,icon:"🫐"},
{name:"rapidroot",score:67310,icon:"🌱"},
{name:"chromecombo",score:66200,icon:"🚀"}
];

const achievements=[
{id:"a1",icon:"🔟",name:"Warm Up",desc:"Solve 10 problems total.",test:s=>s.totalCorrect>=10},
{id:"a2",icon:"🔥",name:"On Fire",desc:"Reach a 10-answer combo.",test:s=>s.bestCombo>=10},
{id:"a3",icon:"⚡",name:"Speed Thinker",desc:"Score 5,000 points in one game.",test:s=>s.bestScore>=5000},
{id:"a4",icon:"🧠",name:"Mental Math Machine",desc:"Solve 100 problems total.",test:s=>s.totalCorrect>=100},
{id:"a5",icon:"🎯",name:"Sharpshooter",desc:"Finish a game with 95% accuracy and at least 20 answers.",test:s=>s.bestAccuracy>=95},
{id:"a6",icon:"📈",name:"High Level",desc:"Reach level 10.",test:s=>s.highestLevel>=10}
];
function fresh(){return{bestScore:0,totalCorrect:0,totalWrong:0,bestCombo:0,bestAccuracy:0,gamesPlayed:0,highestLevel:1,sound:true}}
let stats=fresh(),mode="classic",running=false,score=0,combo=0,bestComboRun=0,correctRun=0,wrongRun=0,level=1,timeLeft=60,lives=3,currentAnswer=0,locked=false,timer=null,fever=false,feverTime=0,audioCtx=null;
function load(){try{const r=localStorage.getItem(SAVE_KEY);if(r)stats={...fresh(),...JSON.parse(r)}}catch(e){}}
function save(){localStorage.setItem(SAVE_KEY,JSON.stringify(stats))}
function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a}function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}function fmt(n){return Math.round(n).toLocaleString()}
function audio(){if(!audioCtx){const C=window.AudioContext||window.webkitAudioContext;if(C)audioCtx=new C()}if(audioCtx?.state==="suspended")audioCtx.resume()}
function tone(f,d=.05,v=.02,t="sine"){if(!stats.sound)return;audio();if(!audioCtx)return;const o=audioCtx.createOscillator(),g=audioCtx.createGain(),n=audioCtx.currentTime;o.type=t;o.frequency.value=f;g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.0001,n+d);o.connect(g);g.connect(audioCtx.destination);o.start(n);o.stop(n+d+.01)}
function goodSound(){tone(620,.05,.025,"triangle");setTimeout(()=>tone(820,.07,.025),40)}function badSound(){tone(180,.12,.025,"sawtooth")}
function makeProblem(){let ops=["+"];if(level>=2)ops.push("-");if(level>=3)ops.push("×");if(level>=5)ops.push("÷");const op=ops[rand(0,ops.length-1)],scale=Math.min(60,8+level*4);let a,b,ans;if(op==="+"){a=rand(2,scale);b=rand(2,scale);ans=a+b}else if(op==="-"){a=rand(5,scale+15);b=rand(1,a);ans=a-b}else if(op==="×"){const m=Math.min(15,5+Math.floor(level/2));a=rand(2,m);b=rand(2,m);ans=a*b}else{b=rand(2,Math.min(12,5+Math.floor(level/2)));ans=rand(2,Math.min(15,6+Math.floor(level/2)));a=b*ans}currentAnswer=ans;$("problem").textContent=`${a} ${op} ${b}`;const wrong=new Set();while(wrong.size<3){let d=rand(1,Math.max(3,Math.ceil(Math.abs(ans)*.2)+2));if(Math.random()<.5)d*=-1;const w=ans+d;if(w!==ans&&w>=0)wrong.add(w)}const vals=shuffle([ans,...wrong]);document.querySelectorAll(".answer").forEach((b,i)=>{b.textContent=vals[i];b.dataset.value=vals[i];b.disabled=!running;b.classList.remove("correct","wrong")})}
function mult(){return(1+Math.min(4,Math.floor(combo/5)*.5))*(fever?2:1)}
function burst(text,ok=true){const e=$("burst");e.textContent=text;e.style.color=ok?"var(--green)":"var(--red)";e.classList.remove("hidden");e.style.animation="none";void e.offsetWidth;e.style.animation="";setTimeout(()=>e.classList.add("hidden"),620)}
function hud(){$("score").textContent=fmt(score);$("combo").textContent="x"+Math.max(1,combo);$("level").textContent=level;if(mode==="classic"){$("timerLabel").textContent="Time";$("timer").textContent=timeLeft.toFixed(1)}else if(mode==="endless"){$("timerLabel").textContent="Lives";$("timer").textContent="❤".repeat(Math.max(0,lives))||"0"}else{$("timerLabel").textContent="Solved";$("timer").textContent=correctRun}$("feverText").textContent=(combo%10)+" / 10";$("feverFill").style.width=((combo%10)*10)+"%";$("feverBanner").classList.toggle("hidden",!fever)}
function answer(btn){if(!running||locked)return;locked=true;const ok=Number(btn.dataset.value)===currentAnswer;if(ok){btn.classList.add("correct");combo++;correctRun++;bestComboRun=Math.max(bestComboRun,combo);level=1+Math.floor(correctRun/5);const gain=Math.round((100+level*15)*mult());score+=gain;if(mode==="classic")timeLeft+=1;if(combo>=10&&!fever){fever=true;feverTime=6}goodSound();burst("+"+gain,true)}else{btn.classList.add("wrong");document.querySelectorAll(".answer").forEach(b=>{if(Number(b.dataset.value)===currentAnswer)b.classList.add("correct")});combo=0;wrongRun++;fever=false;feverTime=0;if(mode==="classic")timeLeft=Math.max(0,timeLeft-2);if(mode==="endless")lives--;badSound();burst("MISS",false)}hud();if(mode==="endless"&&lives<=0){setTimeout(endGame,430);return}setTimeout(()=>{locked=false;makeProblem()},330)}
function tick(){if(!running)return;if(mode==="classic"){timeLeft-=.1;if(timeLeft<=0){timeLeft=0;hud();endGame();return}}if(fever){feverTime-=.1;if(feverTime<=0){fever=false;feverTime=0}}hud()}
function start(){clearInterval(timer);running=true;score=0;combo=0;bestComboRun=0;correctRun=0;wrongRun=0;level=1;timeLeft=60;lives=3;fever=false;feverTime=0;locked=false;$("startBtn").textContent="RESTART GAME";$("status").textContent="Game in progress";document.querySelectorAll(".mode").forEach(b=>b.disabled=true);makeProblem();hud();timer=setInterval(tick,100)}
function endGame(){if(!running)return;running=false;clearInterval(timer);document.querySelectorAll(".answer").forEach(b=>b.disabled=true);document.querySelectorAll(".mode").forEach(b=>b.disabled=false);const attempts=correctRun+wrongRun,acc=attempts?Math.round(correctRun/attempts*100):0;const oldBest=stats.bestScore;stats.gamesPlayed++;stats.totalCorrect+=correctRun;stats.totalWrong+=wrongRun;stats.bestScore=Math.max(stats.bestScore,score);stats.bestCombo=Math.max(stats.bestCombo,bestComboRun);stats.bestAccuracy=Math.max(stats.bestAccuracy,acc);stats.highestLevel=Math.max(stats.highestLevel,level);save();$("finalTitle").textContent=score>oldBest?"New High Score!":"Nice Run!";$("finalScore").textContent=fmt(score);$("finalCorrect").textContent=correctRun;$("finalAccuracy").textContent=acc+"%";$("finalCombo").textContent=bestComboRun;$("gameOver").classList.remove("hidden");$("status").textContent="Round complete";renderStats()}

function renderLeaderboard(){$("leaderboardList").innerHTML=fakeLeaderboard.map((player,i)=>`<div class="leaderboardRow"><div><span class="rankBadge">#${i+1}</span></div><div class="userWrap"><div class="userAvatar">${player.icon}</div><div class="userMeta"><strong>${player.name}</strong><span>${i<3?"Top tier rush player":i<10?"Combo specialist":"Leaderboard grinder"}</span></div></div><div class="scorePill">${fmt(player.score)}</div></div>`).join("")}

function renderStats(){$("bestScore").textContent=fmt(stats.bestScore);$("statBest").textContent=fmt(stats.bestScore);$("statSolved").textContent=fmt(stats.totalCorrect);$("statCombo").textContent=stats.bestCombo;const total=stats.totalCorrect+stats.totalWrong;$("statAccuracy").textContent=(total?Math.round(stats.totalCorrect/total*100):0)+"%";$("statGames").textContent=stats.gamesPlayed;$("statLevel").textContent=stats.highestLevel;$("soundBtn").textContent="Sound: "+(stats.sound?"On":"Off");renderLeaderboard();$("achievementGrid").innerHTML=achievements.map(a=>{const done=a.test(stats);return`<article class="${done?"complete":"locked"}"><div class="icon">${done?"✅":a.icon}</div><h3>${a.name}</h3><p>${a.desc}</p></article>`}).join("")}
function switchPanel(name){["play","leaderboard","stats","achievements","help"].forEach(n=>$(n+"Panel").classList.toggle("hidden",n!==name));document.querySelectorAll(".navBtn").forEach(b=>b.classList.toggle("active",b.dataset.panel===name))}
document.querySelectorAll(".answer").forEach(b=>b.addEventListener("click",()=>answer(b)));$("startBtn").onclick=start;$("againBtn").onclick=()=>{$("gameOver").classList.add("hidden");start()};$("soundBtn").onclick=()=>{stats.sound=!stats.sound;save();renderStats()};$("resetBtn").onclick=()=>{if(confirm("Reset all Number Rush stats and high scores?")){stats=fresh();save();renderStats()}};document.querySelectorAll(".navBtn").forEach(b=>b.onclick=()=>switchPanel(b.dataset.panel));document.querySelectorAll(".mode").forEach(b=>b.onclick=()=>{if(running)return;mode=b.dataset.mode;document.querySelectorAll(".mode").forEach(x=>x.classList.toggle("active",x===b));hud()});document.addEventListener("keydown",e=>{if(!running)return;const n=Number(e.key);if(n>=1&&n<=4){const b=document.querySelectorAll(".answer")[n-1];if(b&&!b.disabled)answer(b)}});
load();renderStats();hud();makeProblem();document.querySelectorAll(".answer").forEach(b=>b.disabled=true);switchPanel("play");
})();
