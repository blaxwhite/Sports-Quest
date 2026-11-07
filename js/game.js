(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const missions = [
    {name:"Training Grounds",type:"SPORTS VOCABULARY",icon:"🏟️",x:205,y:185,color:"#c58b4f",description:"Warm up your sporting knowledge! Match sports with their equipment and discover the words every champion should know.",objective:"Match sports, equipment and vocabulary."},
    {name:"Announcement Hall",type:"LISTENING CHALLENGE",icon:"📯",x:600,y:145,color:"#c5a45f",description:"A special announcement is coming from the kingdom. Listen carefully for the event, time, location and equipment.",objective:"Listen for key details in a sports announcement."},
    {name:"Knowledge Library",type:"READING CHALLENGE",icon:"📚",x:1000,y:205,color:"#9b82b5",description:"Every champion needs knowledge. Explore a short sports story and uncover the important details hidden inside.",objective:"Read a passage and answer comprehension questions."},
    {name:"Strategy Camp",type:"TEAMWORK CHALLENGE",icon:"⛺",x:190,y:675,color:"#8caa70",description:"Great teams win together. Think through sporting situations and choose words and actions that show teamwork.",objective:"Make smart decisions and use supportive language."},
    {name:"Festival Grounds",type:"EVENT PLANNING",icon:"🎪",x:600,y:735,color:"#d28a75",description:"The Sports Festival needs a brilliant organiser. Help plan the activities, times, venues and equipment.",objective:"Plan a school Sports Day programme."},
    {name:"Champion Arena",type:"FINAL CHALLENGE",icon:"🏆",x:1010,y:665,color:"#d2ae55",description:"The final test awaits! Bring together your sports knowledge, communication skills and champion mindset.",objective:"Present your sports event plan and show good sportsmanship."}
  ];
  const world={w:1200,h:900};
  const canvas=$("game-canvas"),ctx=canvas.getContext("2d");
  const viewport=$("world-viewport");
  const player={x:600,y:450,dir:"down",moving:false,walk:0,speed:205};
  const camera={x:0,y:0};
  const held=new Set();
  let activeMission=null,lastTime=0,toastTimer=null,nearby=null,scale=1,viewW=960,viewH=640;
  const trees=[
    [75,100],[365,90],[445,215],[760,75],[1120,105],[1125,355],[1070,510],[920,815],[780,830],[410,835],[70,790],[55,510],[330,510],[850,370],[320,330],[740,575],[1080,810],[490,95],[900,100],[75,300]
  ];
  const rocks=[[325,260],[835,270],[340,610],[850,590],[500,390],[720,420],[1050,440],[120,430]];
  function resize(){
    const rect=viewport.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);
    scale=Math.min(rect.width/760,rect.height/520);
    viewW=rect.width/scale;viewH=rect.height/scale;
  }
  function rounded(x,y,w,h,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}
  function drawGrass(){
    ctx.fillStyle="#73ad70";ctx.fillRect(0,0,world.w,world.h);
    for(let y=12;y<world.h;y+=34){for(let x=10+(y%3)*8;x<world.w;x+=38){
      ctx.fillStyle=(Math.sin(x*2+y*7)>0)?"#83b978":"#629e68";ctx.fillRect(x,y,3,2);
    }}
    ctx.fillStyle="#91c47a";ctx.globalAlpha=.28;
    for(let i=0;i<18;i++){ctx.beginPath();ctx.ellipse(120+i*63,270+Math.sin(i*2)*35,40,13,0,0,Math.PI*2);ctx.fill()}
    ctx.globalAlpha=1;
  }
  function drawRiver(t){
    ctx.save();ctx.translate(0,0);
    ctx.beginPath();ctx.moveTo(-40,385);ctx.bezierCurveTo(210,300,300,500,505,440);ctx.bezierCurveTo(720,370,820,480,1240,365);ctx.lineTo(1240,485);ctx.bezierCurveTo(840,600,720,485,500,555);ctx.bezierCurveTo(280,620,180,430,-40,520);ctx.closePath();
    ctx.fillStyle="#4c9fc0";ctx.fill();ctx.strokeStyle="#a4d7d8";ctx.lineWidth=12;ctx.stroke();
    ctx.strokeStyle="#80c4d2";ctx.lineWidth=3;
    for(let i=0;i<12;i++){let x=((i*117+t*.025)%(world.w+100))-50,y=435+Math.sin(i*2+t*.001)*52;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+22,y-4);ctx.stroke()}
    ctx.restore();
  }
  function drawPath(){
    ctx.save();ctx.lineCap="round";ctx.lineJoin="round";
    ctx.beginPath();ctx.moveTo(600,450);ctx.bezierCurveTo(520,360,380,320,205,185);ctx.moveTo(600,450);ctx.bezierCurveTo(610,340,610,245,600,145);ctx.moveTo(600,450);ctx.bezierCurveTo(770,360,875,275,1000,205);ctx.moveTo(600,450);ctx.bezierCurveTo(440,520,290,600,190,675);ctx.moveTo(600,450);ctx.bezierCurveTo(610,550,605,640,600,735);ctx.moveTo(600,450);ctx.bezierCurveTo(770,510,910,600,1010,665);
    ctx.strokeStyle="#b99563";ctx.lineWidth=37;ctx.stroke();ctx.strokeStyle="#e2c68e";ctx.lineWidth=27;ctx.stroke();
    ctx.setLineDash([7,13]);ctx.strokeStyle="#c6a777";ctx.lineWidth=2;ctx.stroke();ctx.restore();
  }
  function drawTree(x,y,i,t){
    ctx.save();ctx.translate(x,y);const sway=Math.sin(t*.001+i)*1.5;ctx.translate(sway,0);
    ctx.fillStyle="#75543b";ctx.fillRect(-5,7,10,19);ctx.fillStyle="#4b774d";ctx.beginPath();ctx.arc(0,-3,19,0,Math.PI*2);ctx.fill();ctx.fillStyle="#5c9457";ctx.beginPath();ctx.arc(-8,-10,12,0,Math.PI*2);ctx.fill();ctx.fillStyle="#80b76b";ctx.fillRect(-7,-17,7,6);ctx.fillStyle="#376b4a";ctx.fillRect(8,-4,6,6);ctx.restore();
  }
  function drawBush(x,y){ctx.fillStyle="#477b4d";ctx.beginPath();ctx.arc(x,y,11,0,Math.PI*2);ctx.arc(x+10,y+3,9,0,Math.PI*2);ctx.fill();ctx.fillStyle="#94c16e";ctx.fillRect(x-5,y-5,4,3)}
  function drawFlowers(){
    for(let i=0;i<34;i++){const x=35+(i*83)%1120,y=30+(i*137)%830;if(missions.some(m=>Math.hypot(x-m.x,y-m.y)<90))continue;ctx.fillStyle=["#ffe6a2","#f6c9ce","#f6f0d2"][i%3];ctx.fillRect(x,y,4,4);ctx.fillStyle="#477b4d";ctx.fillRect(x+1,y+4,2,5)}
  }
  function drawBuilding(m,i,t){
    const x=m.x,y=m.y;ctx.save();ctx.translate(x,y);
    ctx.fillStyle="#1d483d55";ctx.beginPath();ctx.ellipse(0,45,75,20,0,0,Math.PI*2);ctx.fill();
    // foundation and walls
    ctx.fillStyle="#8c704d";ctx.fillRect(-57,-25,114,78);ctx.fillStyle="#e3c995";ctx.fillRect(-52,-29,104,73);ctx.fillStyle="#f0d9a7";ctx.fillRect(-48,-25,96,63);
    // roof
    ctx.fillStyle="#684a39";ctx.beginPath();ctx.moveTo(-68,-26);ctx.lineTo(0,-83);ctx.lineTo(68,-26);ctx.closePath();ctx.fill();
    ctx.fillStyle=m.color;ctx.beginPath();ctx.moveTo(-61,-30);ctx.lineTo(0,-78);ctx.lineTo(61,-30);ctx.closePath();ctx.fill();
    ctx.fillStyle="#ffffff25";ctx.beginPath();ctx.moveTo(-48,-34);ctx.lineTo(0,-72);ctx.lineTo(0,-34);ctx.closePath();ctx.fill();
    // roof ridge and windows
    ctx.fillStyle="#5c4735";ctx.fillRect(-42,-17,18,18);ctx.fillRect(24,-17,18,18);ctx.fillStyle="#b9e0d8";ctx.fillRect(-38,-13,10,10);ctx.fillRect(28,-13,10,10);
    ctx.fillStyle="#805b3b";ctx.fillRect(-13,4,26,40);ctx.fillStyle="#d7ae6d";ctx.fillRect(-9,8,18,36);ctx.fillStyle="#f6d98e";ctx.fillRect(4,24,3,3);
    // signboard
    ctx.fillStyle="#6e5136";ctx.fillRect(-50,52,100,22);ctx.fillStyle="#fff0ce";ctx.fillRect(-47,54,94,17);
    ctx.fillStyle="#3a3528";ctx.textAlign="center";ctx.textBaseline="middle";ctx.font="7px 'Press Start 2P', monospace";
    const label=m.name.toUpperCase().split(" ");ctx.fillText(label[0],0,61);
    if(label.length>1)ctx.fillText(label.slice(1).join(" "),0,68);
    // floating marker
    const bob=Math.sin(t*.003+i)*3;ctx.fillStyle="#fff0c4";ctx.beginPath();ctx.arc(0,-91+bob,10,0,Math.PI*2);ctx.fill();ctx.fillStyle="#73532f";ctx.font="12px sans-serif";ctx.fillText(m.icon,0,-90+bob);
    if(activeMission===i){ctx.strokeStyle="#ffe08b";ctx.lineWidth=3;ctx.strokeRect(-72,-87,144,166)}
    ctx.restore();
  }
  function drawPlayer(t){
    const x=player.x,y=player.y,bob=player.moving?Math.sin(player.walk)*2:Math.sin(t*.003)*1.4;
    ctx.save();ctx.translate(Math.round(x),Math.round(y+bob));
    ctx.fillStyle="#24473b66";ctx.beginPath();ctx.ellipse(0,16,14,5,0,0,Math.PI*2);ctx.fill();
    // backpack
    ctx.fillStyle="#70472e";ctx.fillRect(-12,-8,7,16);ctx.fillStyle="#a66b3e";ctx.fillRect(-11,-6,5,11);
    // legs, animated
    const step=player.moving?Math.sin(player.walk)*3:0;
    ctx.fillStyle="#34465c";ctx.fillRect(-8,5+step,6,10);ctx.fillRect(2,5-step,6,10);
    ctx.fillStyle="#69472f";ctx.fillRect(-9,14+step,8,4);ctx.fillRect(1,14-step,8,4);
    // torso
    ctx.fillStyle="#1c6464";ctx.fillRect(-10,-10,20,17);ctx.fillStyle="#42a89a";ctx.fillRect(-8,-10,16,12);ctx.fillStyle="#f3c965";ctx.fillRect(-3,-9,6,4);
    // arms
    ctx.fillStyle="#d99a69";ctx.fillRect(-13,-7,4,11);ctx.fillRect(9,-7,4,11);
    // head
    ctx.fillStyle="#d99a69";ctx.fillRect(-8,-25,16,15);ctx.fillStyle="#563a2d";ctx.fillRect(-9,-28,18,7);ctx.fillRect(-11,-24,4,7);ctx.fillRect(7,-24,4,7);
    ctx.fillStyle="#302a2a";if(player.dir==="left"){ctx.fillRect(-5,-19,3,3)}else if(player.dir==="right"){ctx.fillRect(3,-19,3,3)}else{ctx.fillRect(-5,-19,3,3);ctx.fillRect(3,-19,3,3)}
    ctx.fillStyle="#a85f4c";ctx.fillRect(-2,-13,4,2);
    ctx.restore();
  }
  function drawWorld(t){
    const rect=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,rect.width,rect.height);
    ctx.fillStyle="#6ca66b";ctx.fillRect(0,0,rect.width,rect.height);
    const targetX=Math.max(0,Math.min(world.w-viewW,player.x-viewW/2));
    const targetY=Math.max(0,Math.min(world.h-viewH,player.y-viewH/2));
    camera.x+=(targetX-camera.x)*.12;camera.y+=(targetY-camera.y)*.12;
    ctx.save();ctx.scale(scale,scale);ctx.translate(-Math.round(camera.x),-Math.round(camera.y));
    drawGrass();drawRiver(t);drawPath();
    trees.forEach((p,i)=>drawTree(p[0],p[1],i,t));rocks.forEach(p=>drawBush(p[0],p[1]));drawFlowers();
    // decorative bridge
    ctx.fillStyle="#806044";ctx.fillRect(475,438,78,16);ctx.fillStyle="#c5a16d";ctx.fillRect(475,440,78,5);ctx.fillRect(475,449,78,5);
    // sort entities by y for top-down depth
    const entities=missions.map((m,i)=>({y:m.y+20,draw:()=>drawBuilding(m,i,t)}));entities.push({y:player.y,draw:()=>drawPlayer(t)});entities.sort((a,b)=>a.y-b.y).forEach(e=>e.draw());
    // small path-side props
    for(let i=0;i<8;i++){let x=420+i*48,y=350+Math.sin(i)*25;ctx.fillStyle="#a6c77b";ctx.fillRect(x,y,5,3)}
    ctx.restore();
  }
  function findNearby(){
    let best=null,dist=Infinity;
    missions.forEach((m,i)=>{const d=Math.hypot(player.x-m.x,player.y-(m.y+5));if(d<dist){dist=d;best=i}});
    const next=dist<108?best:null;
    if(next!==nearby){nearby=next;if(nearby!==null){$("nearby-name").textContent=missions[nearby].name;$("nearby-card").classList.remove("hidden");showToast("You discovered "+missions[nearby].name+"!")}else $("nearby-card").classList.add("hidden")}
  }
  function showToast(message){
    const el=$("world-toast");el.textContent=message;el.classList.remove("fade");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.add("fade"),3200);
  }
  function openLocation(index){
    activeMission=index;const m=missions[index];
    $("modal-art").textContent=m.icon;$("modal-type").textContent="CHALLENGE LOCATION 0"+(index+1)+" · "+m.type;
    $("modal-title").textContent=m.name;$("modal-description").textContent=m.description;$("modal-objective").textContent=m.objective;
    $("location-modal").classList.remove("hidden");held.clear();
  }
  function closeLocation(){$("location-modal").classList.add("hidden");activeMission=null}
  function interact(){if(nearby!==null)openLocation(nearby);else showToast("Walk closer to a challenge building first!")}
  function update(dt){
    let dx=0,dy=0;
    if(held.has("up")||held.has("w")||held.has("arrowup"))dy--;
    if(held.has("down")||held.has("s")||held.has("arrowdown"))dy++;
    if(held.has("left")||held.has("a")||held.has("arrowleft"))dx--;
    if(held.has("right")||held.has("d")||held.has("arrowright"))dx++;
    const len=Math.hypot(dx,dy);
    player.moving=len>0;
    if(len){dx/=len;dy/=len;player.x=Math.max(24,Math.min(world.w-24,player.x+dx*player.speed*dt));player.y=Math.max(35,Math.min(world.h-25,player.y+dy*player.speed*dt));player.walk+=dt*15;if(Math.abs(dx)>Math.abs(dy))player.dir=dx<0?"left":"right";else player.dir=dy<0?"up":"down";findNearby()}
  }
  function loop(time){
    const dt=Math.min((time-lastTime)/1000||0,0.04);lastTime=time;
    if($("game-screen").classList.contains("hidden")===false && $("location-modal").classList.contains("hidden") && $("help-modal").classList.contains("hidden"))update(dt);
    drawWorld(time);requestAnimationFrame(loop);
  }
  function begin(){ $("title-screen").classList.add("hidden");$("game-screen").classList.remove("hidden");resize();showToast("Welcome, champion! Explore the kingdom.");findNearby();window.scrollTo({top:0,behavior:"smooth"}) }
  $("start-button").addEventListener("click",begin);
  $("nearby-enter").addEventListener("click",interact);$("touch-enter").addEventListener("click",interact);
  $("modal-close").addEventListener("click",closeLocation);$("modal-action").addEventListener("click",closeLocation);
  $("location-modal").addEventListener("click",e=>{if(e.target===$("location-modal"))closeLocation()});
  $("help-button").addEventListener("click",()=>$("help-modal").classList.remove("hidden"));
  $("help-close").addEventListener("click",()=>$("help-modal").classList.add("hidden"));
  $("help-done").addEventListener("click",()=>$("help-modal").classList.add("hidden"));
  $("help-modal").addEventListener("click",e=>{if(e.target===$("help-modal"))$("help-modal").classList.add("hidden")});
  document.addEventListener("keydown",e=>{
    const key=e.key.toLowerCase();
    if(key==="escape"){closeLocation();$("help-modal").classList.add("hidden");return}
    if(["arrowup","arrowdown","arrowleft","arrowright"," "].includes(key)&&!$("game-screen").classList.contains("hidden"))e.preventDefault();
    if(key==="e"&&!$("location-modal").classList.contains("hidden"))return;
    if(key==="e"&&$("help-modal").classList.contains("hidden")){interact();return}
    if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"].includes(key))held.add(key);
  });
  document.addEventListener("keyup",e=>held.delete(e.key.toLowerCase()));
  window.addEventListener("blur",()=>held.clear());
  document.querySelectorAll("[data-direction]").forEach(btn=>{
    const dir=btn.dataset.direction;
    const start=e=>{e.preventDefault();held.add(dir);btn.setPointerCapture?.(e.pointerId)};
    const stop=e=>{e.preventDefault();held.delete(dir)};
    btn.addEventListener("pointerdown",start);btn.addEventListener("pointerup",stop);btn.addEventListener("pointercancel",stop);btn.addEventListener("lostpointercapture",stop);
  });
  canvas.addEventListener("click",e=>{
    const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/scale+camera.x,y=(e.clientY-r.top)/scale+camera.y;
    let nearest=-1,dist=Infinity;missions.forEach((m,i)=>{const d=Math.hypot(x-m.x,y-(m.y+5));if(d<dist){dist=d;nearest=i}});
    if(dist<100)openLocation(nearest);
  });
  window.addEventListener("resize",resize);
  document.addEventListener("visibilitychange",()=>{if(document.hidden)held.clear()});
  resize();requestAnimationFrame(loop);
})();