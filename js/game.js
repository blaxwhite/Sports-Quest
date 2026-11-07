const missions=[
 {name:"Training Grounds",type:"VOCABULARY",title:"Sports Matcher",desc:"Choose the correct sport or equipment. Read each question carefully!",questions:[
  ["Which sport uses a racket and a shuttlecock?",["Tennis","Badminton","Football","Swimming"],1,"Badminton uses a racket to hit a shuttlecock over a net."],
  ["What equipment do you need to play football?",["A bat","A helmet","A ball","A racket"],2,"A football is played with a ball."],
  ["Which activity takes place in a swimming pool?",["Cycling","Swimming","Hockey","Running"],1,"Swimming takes place in water, usually in a pool."]
 ]},
 {name:"Announcement Hall",type:"LISTENING",title:"Listening Lane",desc:"Imagine you are hearing a school sports announcement. Read the announcement, then answer the questions.",passage:"Good morning, pupils! The school Sports Day will take place this Friday at 8.00 a.m. on the school field. Please bring your water bottle, sports shoes and a cap. The 100-metre race will begin first, followed by the long jump.",questions:[
  ["When will Sports Day take place?",["Monday","Wednesday","Friday","Sunday"],2,"The announcement says Sports Day is this Friday."],
  ["Where will the event take place?",["School hall","School field","Library","Swimming pool"],1,"The announcement says the event is on the school field."],
  ["What should pupils bring?",["A racket","A water bottle","A football","A swimsuit"],1,"Pupils should bring a water bottle, sports shoes and a cap."]
 ]},
 {name:"Knowledge Library",type:"READING",title:"Reading Detective",desc:"Read the short passage and answer the comprehension questions.",passage:"Aina loves playing badminton. She practises every Tuesday and Thursday after school. Her coach teaches her how to serve, move quickly and work with a partner. Last month, Aina joined a school competition. Although she did not win, she felt proud because she tried her best and encouraged her teammate.",questions:[
  ["How often does Aina practise?",["Every day","Once a week","Twice a week","Once a month"],2,"She practises every Tuesday and Thursday, which is twice a week."],
  ["Who teaches Aina to play?",["Her father","Her coach","Her teacher","Her friend"],1,"The passage says her coach teaches her."],
  ["Why did Aina feel proud?",["She won a medal","She played alone","She tried her best and encouraged her teammate","She skipped practice"],2,"Aina was proud of her effort and teamwork."]
 ]},
 {name:"Strategy Camp",type:"TEAM TACTICS",title:"Team Tactics",desc:"Think about the situation and choose the most suitable answer.",questions:[
  ["Your team has only one ball and a large open field. Which activity is most suitable?",["Football","Swimming","Badminton","Table tennis"],0,"Football is suitable for a team using a ball on an open field."],
  ["Your teammate feels tired during practice. What should you say?",["Hurry up!","You are not good.","Take a short rest. I can help you.","Go home now."],2,"Supportive language encourages teamwork and wellbeing."],
  ["Which sentence shows good teamwork?",["I want to play alone.","Let's practise together.","You cannot join us.","This is only my game."],1,"Working and practising together shows teamwork."]
 ]},
 {name:"Festival Grounds",type:"PLANNING",title:"Sports Day Architect",desc:"Help the kingdom organise its Sports Day programme.",questions:[
  ["The 100-metre race needs a running track. Where should it take place?",["Swimming pool","Running track","Library","Canteen"],1,"A running race should take place on a running track."],
  ["The event starts at 8.00 a.m. Which time comes next?",["7.00 a.m.","8.30 a.m.","6.00 a.m.","5.00 p.m."],1,"8.30 a.m. comes after 8.00 a.m."],
  ["Which item is important for pupils to bring on a hot sports day?",["A blanket","A water bottle","A storybook","A frying pan"],1,"A water bottle helps pupils stay hydrated."]
 ]},
 {name:"Champion Arena",type:"FINAL CHALLENGE",title:"Champion's Pitch",desc:"You have reached the final arena! Show what you have learned about sport and teamwork.",questions:[
  ["Which sentence is the best way to introduce a sports event?",["The event is boring.","Welcome to our school Sports Day!","I do not like this.","Go away."],1,"A friendly greeting is a suitable way to introduce an event."],
  ["Your team loses a match. What is the best response?",["Blame your teammates.","Stop being friends.","Congratulate the other team and keep practising.","Argue with the referee."],2,"Good sportsmanship means respecting others and learning from the experience."],
  ["Complete the sentence: We should _____ as a team.",["works","working","worked","work"],3,"After 'should', use the base form of the verb: work."]
 ]}
];
const state={xp:0,completed:new Set(),active:null,index:0,correct:0,answered:false};
const $=id=>document.getElementById(id);
$("start-button").addEventListener("click",()=>{$("title-screen").classList.add("hidden");$("game-screen").classList.remove("hidden");window.scrollTo(0,0)});
document.querySelectorAll(".location").forEach(button=>button.addEventListener("click",()=>openMission(Number(button.dataset.mission))));
$("close-modal").addEventListener("click",closeMission);
$("mission-modal").addEventListener("click",e=>{if(e.target===$("mission-modal"))closeMission()});
$("help-button").addEventListener("click",()=>toast("Choose any location. Complete its questions to earn an emblem!"));
function openMission(id){
 const mission=missions[id];state.active=id;state.index=0;state.correct=0;state.answered=false;
 if(state.completed.has(id)){showCompleted(mission);return}
 renderQuestion();
 $("mission-modal").classList.remove("hidden");
}
function renderQuestion(){
 const m=missions[state.active],q=m.questions[state.index];
 $("mission-content").innerHTML=`<p class="mission-tag">${m.type} · CHALLENGE ${state.active+1}/6</p><h2 id="mission-title">${m.title}</h2><p class="mission-desc">${m.desc}</p>${m.passage&&state.index===0?`<blockquote class="passage">${m.passage}</blockquote>`:""}<p class="question-count">QUESTION ${state.index+1} OF ${m.questions.length}</p><p class="question-text">${q[0]}</p><div class="answers">${q[1].map((a,i)=>`<button class="answer-button" data-answer="${i}">${String.fromCharCode(65+i)}. ${a}</button>`).join("")}</div><p id="feedback" class="feedback" aria-live="polite"></p><div class="modal-actions"><button id="next-button" class="small-button" disabled>${state.index===m.questions.length-1?"FINISH CHALLENGE":"NEXT QUESTION"} →</button></div>`;
 document.querySelectorAll("[data-answer]").forEach(b=>b.addEventListener("click",()=>answer(Number(b.dataset.answer))));
 $("next-button").addEventListener("click",nextQuestion);
}
function answer(choice){
 if(state.answered)return;state.answered=true;
 const q=missions[state.active].questions[state.index],correct=choice===q[2];
 if(correct){state.correct++;state.xp+=10}
 document.querySelectorAll("[data-answer]").forEach((b,i)=>{b.disabled=true;if(i===q[2])b.classList.add("correct");else if(i===choice)b.classList.add("wrong")});
 const f=$("feedback");f.className="feedback "+(correct?"good":"bad");f.textContent=(correct?"✓ Correct! ":"✗ Not quite. ")+q[3];
 $("next-button").disabled=false;updateHud();
}
function nextQuestion(){
 const m=missions[state.active];
 if(state.index<m.questions.length-1){state.index++;state.answered=false;renderQuestion();return}
 const passed=state.correct>=2;
 if(passed){state.completed.add(state.active);state.xp+=20;updateHud();showCompleted(m)}
 else{$("mission-content").innerHTML=`<p class="mission-tag">KEEP PRACTISING</p><h2>Almost there, champion!</h2><p class="mission-desc">You answered ${state.correct} out of ${m.questions.length} correctly. You need at least 2 correct answers to earn this emblem. Try the challenge again!</p><div class="modal-actions"><button id="retry-button" class="small-button">TRY AGAIN ↻</button></div>`;$("retry-button").addEventListener("click",()=>{state.index=0;state.correct=0;state.answered=false;renderQuestion()})}
}
function showCompleted(m){
 $("mission-modal").classList.remove("hidden");
 const all=state.completed.size===6;
 $("mission-content").innerHTML=`<p class="mission-tag">✦ EMBLEM ${state.completed.size} / 6 ${all?"· ALL COLLECTED": "UNLOCKED"} ✦</p><h2>${all?"The Festival Is Saved!":"Challenge Complete!"}</h2><p class="mission-desc">${all?"You restored the Sports Festival and became the Champion of the Kingdom!":"You earned the "+m.name+" Champion Emblem. Well done!"}</p><div style="font-size:64px;text-align:center;margin:24px">🏅</div><p class="mission-desc" style="text-align:center">Your total experience: <strong style="color:#f6c75b">${state.xp} XP</strong></p><div class="modal-actions"><button id="done-button" class="small-button">BACK TO KINGDOM →</button></div>`;
 $("done-button").addEventListener("click",closeMission);
}
function updateHud(){
 $("xp-value").textContent=state.xp+" XP";$("emblem-value").textContent=state.completed.size+" / 6";
 $("progress-fill").style.width=(state.completed.size/6*100)+"%";$("progress-label").textContent=state.completed.size+" of 6 challenges completed";
 $("emblem-row").innerHTML=missions.map((m,i)=>`<span class="${state.completed.has(i)?"earned":""}" title="${m.name}">${state.completed.has(i)?"✦":"◇"}</span>`).join("");
 document.querySelectorAll(".location").forEach(b=>b.classList.toggle("completed",state.completed.has(Number(b.dataset.mission))));
}
function closeMission(){$("mission-modal").classList.add("hidden");state.active=null}
function toast(message){const t=$("toast");t.textContent=message;t.classList.remove("hidden");setTimeout(()=>t.classList.add("hidden"),2600)}


// --- PLAYER EXPLORATION ---
const player = { x: 50, y: 57, step: 2.2 };
const playerMarker = document.querySelector(".player-marker");
const kingdomMap = document.querySelector(".kingdom-map");
const nearbyHint = $("nearby-hint");
let nearbyMission = null;

function updatePlayerPosition() {
  playerMarker.style.left = player.x + "%";
  playerMarker.style.top = player.y + "%";
  findNearbyMission();
}

function findNearbyMission() {
  const mapRect = kingdomMap.getBoundingClientRect();
  const px = mapRect.left + (player.x / 100) * mapRect.width;
  const py = mapRect.top + (player.y / 100) * mapRect.height;
  let closest = null;
  let closestDistance = Infinity;

  document.querySelectorAll(".location").forEach(button => {
    const r = button.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const distance = Math.hypot(px - cx, py - cy);
    if (distance < closestDistance) {
      closestDistance = distance;
      closest = Number(button.dataset.mission);
    }
  });

  nearbyMission = closestDistance < 105 ? closest : null;
  if (nearbyHint) {
    nearbyHint.textContent = nearbyMission !== null
      ? "Press E to enter " + missions[nearbyMission].name + "!"
      : "Explore the kingdom and find a building.";
  }
}

document.addEventListener("keydown", event => {
  if ($("game-screen").classList.contains("hidden") || !$("mission-modal").classList.contains("hidden")) return;
  const key = event.key.toLowerCase();
  const movement = {
    arrowup: [0, -1], w: [0, -1],
    arrowdown: [0, 1], s: [0, 1],
    arrowleft: [-1, 0], a: [-1, 0],
    arrowright: [1, 0], d: [1, 0]
  };

  if (movement[key]) {
    event.preventDefault();
    player.x = Math.max(3, Math.min(97, player.x + movement[key][0] * player.step));
    player.y = Math.max(5, Math.min(95, player.y + movement[key][1] * player.step));
    updatePlayerPosition();
  } else if (key === "e" && nearbyMission !== null) {
    openMission(nearbyMission);
  }
});

window.addEventListener("resize", findNearbyMission);
updatePlayerPosition();
