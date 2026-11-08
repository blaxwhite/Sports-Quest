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
