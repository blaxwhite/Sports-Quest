const area=document.querySelector('#arcade-play-area'),content=document.querySelector('#game-content'),title=document.querySelector('#game-title');
let stars=Number(localStorage.getItem('sq-arcade-stars')||0),timer=null;
const starDisplay=document.querySelector('#arcade-stars');
function addStars(n){stars+=n;localStorage.setItem('sq-arcade-stars',String(stars));starDisplay.textContent=stars}
starDisplay.textContent=stars;
function showGame(name,html){clearTimeout(timer);title.textContent=name;content.innerHTML=html;area.hidden=false;area.scrollIntoView({behavior:'smooth',block:'start'})}
document.querySelectorAll('[data-launch]').forEach(b=>b.addEventListener('click',()=>launch(b.dataset.launch)));
document.querySelector('#close-game').onclick=()=>{clearTimeout(timer);area.hidden=true;content.innerHTML=''};
function launch(type){
if(type==='match')equipmentGame();
if(type==='quiz')quizGame();
if(type==='reaction')reactionGame();
}
function equipmentGame(){
const pairs=[['Football','⚽'],['Basketball','🏀'],['Tennis','🎾'],['Badminton','🏸']];
let chosen=null,matched=new Set(),seconds=35;
showGame('Equipment Rush','<p>Match all four sports with their equipment. You have <strong id="match-time">35</strong> seconds!</p><div class="arcade-match-grid"><div>'+pairs.map((p,i)=>'<button class="arcade-tile" data-side="sport" data-id="'+i+'">'+p[0]+'</button>').join('')+'</div><div>'+pairs.map((p,i)=>'<button class="arcade-tile" data-side="gear" data-id="'+i+'">'+p[1]+'</button>').sort(()=>Math.random()-.5).join('')+'</div></div><p class="arcade-feedback" id="game-feedback">Choose one sport, then its matching equipment.</p>');
content.querySelectorAll('.arcade-tile').forEach(btn=>btn.onclick=()=>{if(btn.disabled)return;if(!chosen){chosen=btn;btn.classList.add('picked');return}if(chosen.dataset.side===btn.dataset.side){chosen.classList.remove('picked');chosen=btn;btn.classList.add('picked');return}if(chosen.dataset.id===btn.dataset.id){chosen.disabled=btn.disabled=true;chosen.classList.add('matched');btn.classList.add('matched');matched.add(btn.dataset.id);content.querySelector('#game-feedback').textContent='Correct match!';chosen=null;if(matched.size===4){clearInterval(timer);content.querySelector('#game-feedback').textContent='Perfect set! You earned 30 Arcade Stars.';addStars(30)}}else{content.querySelector('#game-feedback').textContent='Not quite. Try another combination!';btn.classList.add('miss');setTimeout(()=>btn.classList.remove('miss'),450);chosen.classList.remove('picked');chosen=null}});
timer=setInterval(()=>{seconds--;const el=content.querySelector('#match-time');if(el)el.textContent=seconds;if(seconds<=0){clearInterval(timer);content.querySelector('#game-feedback').textContent=matched.size===4?'Challenge complete!':'Time is up. Play again to improve your score.'}},1000);
}
function quizGame(){
const qs=[['Which item helps protect your head when cycling?',['Helmet','Wristband','Whistle'],0],['What should you do before exercise?',['Skip warm-up','Warm up gently','Eat a large meal'],1],['Which phrase encourages a teammate?',['Give up!','You cannot do it.','Keep trying!'],2],['How many players are on court for one badminton singles match?',['One per side','Two per side','Three per side'],0],['What is good sportsmanship?',['Blaming others','Respecting everyone','Cheating to win'],1]];
let index=0,score=0;
function draw(){const q=qs[index];content.innerHTML='<div class="arcade-quiz-top">QUESTION '+(index+1)+' / '+qs.length+' <span>⭐ '+score+' correct</span></div><h3>'+q[0]+'</h3><div class="arcade-quiz-options">'+q[1].map((v,i)=>'<button class="arcade-option" data-answer="'+i+'">'+v+'</button>').join('')+'</div><p class="arcade-feedback" id="quiz-feedback">Choose the best answer.</p>';content.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{content.querySelectorAll('[data-answer]').forEach(x=>x.disabled=true);const correct=Number(b.dataset.answer)===q[2];if(correct){score++;b.classList.add('matched')}else{b.classList.add('miss');content.querySelector('[data-answer="'+q[2]+'"]').classList.add('matched')}content.querySelector('#quiz-feedback').textContent=correct?'Correct! Great work.':'Good try. The correct answer is '+q[1][q[2]]+'.';const next=document.createElement('button');next.className='btn btn-primary btn-small';next.textContent=index===qs.length-1?'See results':'Next question →';next.onclick=()=>{index++;if(index<qs.length)draw();else{const earned=score*5;content.innerHTML='<div class="arcade-result"><div>🏆</div><h3>'+score+' / '+qs.length+' correct!</h3><p>You earned '+earned+' Arcade Stars.</p><button class="btn btn-primary btn-small" id="again">Play again</button></div>';addStars(earned);content.querySelector('#again').onclick=quizGame}};content.appendChild(next)})}
showGame('Champion Quiz','');draw();
}
function reactionGame(){
showGame('Reflex Rally','<p>Press start. Wait until the target turns green, then tap it as quickly as possible. Do not tap early!</p><div class="reaction-stage"><button id="reaction-target" class="reaction-target">PRESS START</button></div><p class="arcade-feedback" id="reaction-feedback">Ready when you are.</p>');
const target=content.querySelector('#reaction-target'),feedback=content.querySelector('#reaction-feedback');let started=0,waiting=false,done=false;
target.onclick=()=>{if(done){reactionGame();return}if(!waiting&&!started){target.textContent='WAIT...';target.classList.add('waiting');const delay=1200+Math.random()*2800;waiting=true;timer=setTimeout(()=>{started=performance.now();target.textContent='TAP NOW!';target.classList.remove('waiting');target.classList.add('go')},delay);return}if(waiting&&!started){clearTimeout(timer);waiting=false;done=true;target.textContent='TOO SOON';feedback.textContent='False start! Tap the button to try again.';target.classList.remove('waiting');return}if(started){const ms=Math.round(performance.now()-started),earned=ms<300?20:ms<500?15:ms<800?10:5;done=true;target.textContent=ms+' ms';feedback.textContent='Nice reaction! You earned '+earned+' Arcade Stars. Tap to play again.';addStars(earned)}};
}

/* SIDE-SCROLLER COLLECTION — four distinct arcade mechanics */
function sideScroller(type){
  let raf=0,keys={},score=0,lives=3,ended=false,frame=0,player={x:105,y:300,vy:0,ground:true,duck:0},items=[],hazards=[],goal=0,aim=0,power=0,keeper=0;
  const W=900,H=420,ground=350,canvas=document.createElement('canvas');canvas.id='sidegame-canvas';canvas.width=W;canvas.height=H;
  const wrap=document.createElement('div');wrap.className='arcade-canvas-wrap';wrap.appendChild(canvas);
  const hud=document.createElement('div');hud.className='sidegame-hud';hud.innerHTML='<span id="sg-score">SCORE 000</span><span id="sg-status">LIVES ♥♥♥</span>';
  const instructions=document.createElement('p');instructions.className='sidegame-instructions';
  const controls=document.createElement('div');controls.className='sidegame-controls';
  const ctx=canvas.getContext('2d');let world=0,ballX=0,ballY=0,shot=false,shotTimer=0;
  const configs={
    kingdom:['Kingdom Runner','Jump over rocks and gaps. Collect 12 golden coins to finish.','← → move · SPACE / ↑ jump'],
    dash:['Champion Dash','Keep moving! Jump over hurdles and duck under banners. Survive 45 seconds.','SPACE / ↑ jump · ↓ duck'],
    treasure:['Treasure of Champions','Explore the valley. Collect 3 keys and reach the treasure chest.','← → move · SPACE / ↑ jump'],
    showdown:['Sports Showdown','Move your aim, charge your kick and score 5 goals past the goalkeeper.','← → aim · hold SPACE / KICK to charge, release to shoot']
  };
  instructions.textContent=configs[type][1]+'  Controls: '+configs[type][2];
  controls.innerHTML=type==='showdown'?'<button data-key="left">◀</button><button data-key="right">▶</button><button class="action" data-key="kick">KICK</button>':
  '<button data-key="left">◀</button><button data-key="jump">▲ JUMP</button><button data-key="right">▶</button>'+(type==='dash'?'<button data-key="duck">▼ DUCK</button>':'');
  content.append(hud,wrap,instructions,controls);
  const scoreEl=hud.querySelector('#sg-score'),statusEl=hud.querySelector('#sg-status');
  function setHud(){scoreEl.textContent='SCORE '+String(score).padStart(3,'0');statusEl.textContent=type==='dash'?'TIME '+Math.max(0,45-Math.floor(frame/60))+'s':type==='showdown'?'GOALS '+score+'/5':'LIVES '+'♥'.repeat(lives)}
  function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h)}
  function text(t,x,y,size=18,c='#fff0d2'){ctx.fillStyle=c;ctx.font='bold '+size+'px monospace';ctx.fillText(t,x,y)}
  function background(){
    const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,type==='showdown'?'#497b99':'#315b62');sky.addColorStop(1,type==='treasure'?'#b5bd7b':'#b78a59');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
    for(let i=0;i<7;i++){let x=((i*180-world*.22)%1100+1100)%1100-100;rect(x,210,90,140,'#284b48');rect(x+20,170,50,55,'#416b52');rect(x+32,150,28,35,'#5b8056')}
    rect(0,ground,W,70,type==='showdown'?'#397b52':'#345b42');for(let x=0;x<W;x+=32)rect(x,ground+8,16,4,'#71945b');
  }
  function drawPlayer(){
    const px=player.x,py=player.y+(player.duck?17:0);rect(px,py,25,34,'#f0bd70');rect(px+4,py-13,18,16,'#e9b879');rect(px+8,py-8,4,4,'#263b42');rect(px-3,py+30,13,8,'#283e54');rect(px+14,py+30,13,8,'#283e54');rect(px+1,py+7,23,16,'#397c91');rect(px+3,py+12,19,5,'#f5d27b');
  }
  function draw(){
    background();
    if(type==='showdown'){
      rect(690,170,12,180,'#f3e6c7');rect(690,170,120,12,'#f3e6c7');rect(800,182,10,168,'#f3e6c7');for(let y=200;y<340;y+=25)rect(700,y,100,2,'#d9e5d0');
      rect(keeper,255,22,48,'#e0b56e');rect(keeper+3,263,16,17,'#f0c78b');rect(keeper-5,298,32,10,'#d65f4f');
      rect(100,320,90,4,'#f2d48c');rect(130,310,25,25,'#f7f0d8');rect(aim,290,3,45,'#f3d16f');text('AIM',aim-10,280,12);
      if(shot){let bx=ballX,by=ballY;ctx.fillStyle='#f4f0df';ctx.beginPath();ctx.arc(bx,by,12,0,Math.PI*2);ctx.fill();rect(bx-4,by-3,8,6,'#253b4c')}
      else{ctx.fillStyle='#f4f0df';ctx.beginPath();ctx.arc(165,330,12,0,Math.PI*2);ctx.fill();rect(161,327,8,6,'#253b4c')}
      text('GOAL ZONE',680,145,15);
    }else{
      rect(0,ground+58,W,12,'#243e35');
      if(type==='kingdom'||type==='dash'){
        hazards.forEach(h=>{rect(h.x,ground-h.h,h.w,h.h,'#6f4a3c');rect(h.x+4,ground-h.h+4,h.w-8,5,'#a36d4d')});
      }
      if(type==='treasure'){
        items.forEach(it=>{if(it.kind==='key'){text('⚿',it.x,ground-20,28,'#ffdc70')}else{text('◆',it.x,ground-22,24,'#80e5e3')}});
        rect(790,ground-50,55,50,'#a46b38');rect(786,ground-56,63,12,'#e5bd63');rect(811,ground-33,12,18,'#493b36');
      }else{
        items.forEach(it=>{text('★',it.x,ground-22,24,'#ffdb70')});
      }
      drawPlayer();
    }
    if(ended){ctx.fillStyle='#081722bb';ctx.fillRect(0,0,W,H);text('CHALLENGE COMPLETE!',250,175,28);text('SCORE '+score,370,220,22,'#ffda80');text('Tap PLAY AGAIN below',315,260,16)}
  }
  function finish(win){
    if(ended)return;ended=true;cancelAnimationFrame(raf);let earned=Math.max(5,score*2)+(win?20:0);if(type==='showdown')earned=score*8+(win?20:0);addStars(earned);draw();
    const result=document.createElement('div');result.className='sidegame-result';result.innerHTML=(win?'🏆 Victory!':'✨ Run finished!')+' You earned '+earned+' Arcade Stars.<br><button class="btn btn-primary btn-small" id="sg-again">PLAY AGAIN</button>';content.appendChild(result);result.querySelector('#sg-again').onclick=()=>sideScroller(type);
  }
  function jump(){if(player.ground){player.vy=-12;player.ground=false}}
  function press(k){keys[k]=true;if(k==='jump'&&type!=='showdown')jump();if(k==='kick'&&type==='showdown')power=Math.min(100,power+12)}
  function release(k){keys[k]=false;if(k==='kick'&&type==='showdown'&&!shot){shot=true;shotTimer=0;ballX=175;ballY=325;}}
  controls.querySelectorAll('button').forEach(b=>{let k=b.dataset.key;b.addEventListener('pointerdown',e=>{e.preventDefault();press(k)});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>release(k)))});
  function keydown(e){let k=e.key.toLowerCase();if(['arrowleft','arrowright','arrowup','arrowdown',' '].includes(k))e.preventDefault();if(k==='arrowleft'||k==='a')press('left');if(k==='arrowright'||k==='d')press('right');if(k==='arrowup'||k==='w'||k===' ')press(type==='showdown'?'kick':'jump');if(k==='arrowdown'||k==='s')press('duck')}
  function keyup(e){let k=e.key.toLowerCase();if(k==='arrowleft'||k==='a')release('left');if(k==='arrowright'||k==='d')release('right');if(k==='arrowup'||k==='w'||k===' ')release(type==='showdown'?'kick':'jump');if(k==='arrowdown'||k==='s')release('duck')}
  window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);
  function cleanup(){cancelAnimationFrame(raf);window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup)}
  const oldClose=document.querySelector('#close-game');oldClose.addEventListener('click',cleanup,{once:true});
  function tick(){
    if(ended)return;frame++;
    if(type==='showdown'){
      if(keys.left)aim=Math.max(240,aim-5);if(keys.right)aim=Math.min(650,aim+5);
      if(shot){shotTimer++;ballX+=10;ballY+=(aim-450)*.012;if(ballX>690){if(Math.abs(ballY-keeper-20)<42){score++;}else{lives--}shot=false;power=0;if(score>=5){setHud();finish(true);return}if(lives<=0){setHud();finish(false);return}keeper=240+Math.random()*390}}
    }else{
      if(keys.left)player.x=Math.max(35,player.x-4);if(keys.right)player.x=Math.min(500,player.x+4);
      if(type==='dash')player.x=105;
      if(keys.duck&&type==='dash')player.duck=1;else player.duck=0;
      player.y+=player.vy;player.vy+=.62;if(player.y>=ground-34){player.y=ground-34;player.vy=0;player.ground=true}
      world+=type==='dash'?6:2.2;
      if(frame%75===0){if(type==='treasure'){items.push({x:W+20,kind:goal<3?'key':'gem'});goal++}else if(type==='kingdom'){items.push({x:W+20,kind:'coin'})}else{hazards.push({x:W+20,w:25+Math.random()*25,h:25+Math.random()*25})}}
      if(type==='dash'&&frame%45===0)hazards.push({x:W+20,w:24,h:keys.duck?24:40});
      items.forEach(it=>it.x-=type==='dash'?6:2.2);hazards.forEach(h=>h.x-=type==='dash'?6:2.2);
      items=items.filter(it=>it.x>-40);hazards=hazards.filter(h=>h.x>-60);
      items.forEach(it=>{if(Math.abs(it.x-player.x)<28&&Math.abs(player.y-(ground-34))<42){score++;it.x=-100}});
      hazards.forEach(h=>{let hit=player.x+24>h.x&&player.x<h.x+h.w&&player.y+34>ground-h.h;if(hit){h.x=-100;lives--;if(lives<=0){setHud();finish(false)}}});
      if(type==='kingdom'&&score>=12){setHud();finish(true);return}
      if(type==='treasure'&&score>=3){setHud();finish(true);return}
      if(type==='dash'&&frame>=2700){setHud();finish(true);return}
    }
    setHud();draw();raf=requestAnimationFrame(tick);
  }
  if(type==='showdown')aim=450;
  setHud();draw();raf=requestAnimationFrame(tick);
}
const oldLaunch=launch;
launch=function(type){if(['kingdom','dash','treasure','showdown'].includes(type)){sideScroller(type);return}oldLaunch(type)};
