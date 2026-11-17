(function(){
'use strict';
const host=document.getElementById('sports-learning-lab');if(!host)return;
const modules=[
{title:'Find the Sport',desc:'Look at the picture. Choose the correct sport.',items:[
{scene:['⚽','🥅'],q:'Which sport uses this ball and goal?',options:[['⚽','Football'],['🏸','Badminton'],['🏊','Swimming']],correct:0,why:'Football players kick a ball towards the goal.'},
{scene:['🏸','🥅'],q:'Which sport uses a shuttlecock?',options:[['🏀','Basketball'],['🏸','Badminton'],['🚴','Cycling']],correct:1,why:'Badminton players hit a shuttlecock using a racket.'},
{scene:['🏀','⛹️'],q:'Which sport uses a hoop?',options:[['🏊','Swimming'],['🎾','Tennis'],['🏀','Basketball']],correct:2,why:'Basketball players shoot a ball into a hoop.'},
{scene:['🏊','💦'],q:'Which sport takes place in water?',options:[['🏊','Swimming'],['⚽','Football'],['🏃','Running']],correct:0,why:'Swimming takes place in water.'}]},
{title:'Equipment Match',desc:'Choose the equipment needed for each sport.',items:[
{scene:['🚴','❓'],q:'What protects your head when cycling?',options:[['🪖','Helmet'],['🏸','Shuttlecock'],['⚽','Football']],correct:0,why:'A helmet helps protect a cyclist’s head.'},
{scene:['🏸','❓'],q:'What do you use to hit a shuttlecock?',options:[['🥅','Goalpost'],['🎾','Racket'],['🏀','Basketball']],correct:1,why:'A badminton racket is used to hit the shuttlecock.'},
{scene:['⚽','❓'],q:'What do you need to play football?',options:[['🎾','Tennis racket'],['🏸','Shuttlecock'],['⚽','Football']],correct:2,why:'Football players use a football.'},
{scene:['🏊','❓'],q:'What helps protect your eyes while swimming?',options:[['🥽','Goggles'],['🪖','Helmet'],['🏀','Basketball']],correct:0,why:'Swimming goggles help protect your eyes in the water.'}]},
{title:'Action Words',desc:'Read the sentence and choose the correct action verb.',items:[
{scene:['🧒','⚽'],q:'I ___ the football with my foot.',options:[['🏃','run'],['⚽','kick'],['🏊','swim']],correct:1,why:'We kick a football with our feet.'},
{scene:['⛹️','🏀'],q:'I ___ the ball to my teammate.',options:[['🤝','pass'],['🛌','sleep'],['🚴','cycle']],correct:0,why:'Pass means to send the ball to another player.'},
{scene:['🧒','🏀'],q:'I ___ the ball with my hands.',options:[['🏊','swim'],['🚴','cycle'],['🙌','catch']],correct:2,why:'Catch means to receive a moving ball with your hands.'},
{scene:['🏃','🚧'],q:'I ___ over the hurdle.',options:[['🦘','jump'],['🛌','sleep'],['🪑','sit']],correct:0,why:'Jump means to push yourself off the ground.'}]},
{title:'Sports Day Detective',desc:'Read the notice and find the important details.',items:[
{scene:['📣','🏟️'],q:'SPORTS DAY: Friday, 8:00 a.m., school field. Where is it?',options:[['🏫','School field'],['📚','Library'],['🏠','Home']],correct:0,why:'The notice says Sports Day is at the school field.'},
{scene:['📅','⏰'],q:'SPORTS DAY: Friday, 8:00 a.m., school field. What day is it?',options:[['📅','Monday'],['📅','Friday'],['📅','Sunday']],correct:1,why:'The notice says Friday.'},
{scene:['⏰','🏟️'],q:'SPORTS DAY: Friday, 8:00 a.m., school field. What time?',options:[['🕛','12:00 p.m.'],['🕙','10:00 a.m.'],['🕗','8:00 a.m.']],correct:2,why:'The notice says 8:00 a.m.'},
{scene:['💧','👟'],q:'What should you bring for outdoor Sports Day?',options:[['💧','Water bottle'],['🎮','Game controller'],['🧸','Teddy bear']],correct:0,why:'Water helps you stay hydrated during sports.'}]}
];
let moduleIndex=0,step=0,score=0,answered=false;
host.innerHTML='<div class="sq-lab"><div class="sq-lab-head"><div><div class="kicker">INTERACTIVE TRAINING · YEAR 5</div><h2>🏆 Champion Practice Lab</h2><p>Tap the pictures, choose an answer and learn as you play.</p></div><div class="sq-lab-status" aria-live="polite">0 / 4 stars ⭐</div></div><div class="sq-lab-tabs" role="tablist" aria-label="Choose a sports lesson"></div><div class="sq-lab-stage" role="tabpanel" aria-live="off"></div></div>';
const tabs=host.querySelector('.sq-lab-tabs'),stage=host.querySelector('.sq-lab-stage'),status=host.querySelector('.sq-lab-status');
modules.forEach((mod,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('role','tab');b.textContent=(i+1)+'. '+mod.title;b.onclick=()=>selectModule(i);tabs.appendChild(b)});
function selectModule(i){moduleIndex=i;step=0;score=0;answered=false;tabs.querySelectorAll('button').forEach((b,j)=>{b.setAttribute('aria-selected',String(i===j));b.tabIndex=i===j?0:-1});render()}
function render(){const mod=modules[moduleIndex],item=mod.items[step];status.textContent=score+' / '+mod.items.length+' stars ⭐';
stage.replaceChildren();
const title=document.createElement('h3');title.textContent=mod.title+' · '+(step+1)+' of '+mod.items.length;stage.appendChild(title);
const description=document.createElement('p');description.textContent=mod.desc;stage.appendChild(description);
const scene=document.createElement('div');scene.className='sq-lab-scene';scene.setAttribute('role','img');scene.setAttribute('aria-label','Sports picture clues');item.scene.forEach(emoji=>{const span=document.createElement('span');span.textContent=emoji;scene.appendChild(span)});stage.appendChild(scene);
const question=document.createElement('h3');question.textContent=item.q;question.style.marginTop='14px';stage.appendChild(question);
const options=document.createElement('div');options.className='sq-lab-options';stage.appendChild(options);
const feedback=document.createElement('div');feedback.className='sq-lab-feedback';feedback.setAttribute('role','status');feedback.textContent='Choose one answer to check your knowledge.';const next=document.createElement('button');next.className='sq-lab-next';next.type='button';next.textContent=step===mod.items.length-1?'See my results →':'Next challenge →';next.disabled=true;
item.options.forEach(([emoji,label],i)=>{const b=document.createElement('button');b.type='button';const pict=document.createElement('span');pict.className='sq-icon';pict.textContent=emoji;b.appendChild(pict);b.appendChild(document.createTextNode(label));b.onclick=()=>{if(answered)return;answered=true;const correct=i===item.correct;if(correct)score++;status.textContent=score+' / '+mod.items.length+' stars ⭐';options.querySelectorAll('button').forEach((btn,j)=>{btn.disabled=true;if(j===item.correct)btn.classList.add('sq-right');else if(j===i)btn.classList.add('sq-wrong')});feedback.textContent=(correct?'🌟 Correct! ':'💡 Good try! ')+item.why;next.disabled=false};options.appendChild(b)});
stage.appendChild(feedback);stage.appendChild(next);
const bar=document.createElement('div');bar.className='sq-lab-progress';const fill=document.createElement('span');fill.style.width=(step/mod.items.length*100)+'%';bar.appendChild(fill);stage.appendChild(bar);
next.onclick=()=>{if(step<mod.items.length-1){step++;answered=false;render()}else showResults()};
}
function showResults(){const mod=modules[moduleIndex];stage.replaceChildren();const title=document.createElement('h3');title.textContent='🎉 Training complete!';stage.appendChild(title);const p=document.createElement('p');p.textContent='You earned '+score+' out of '+mod.items.length+' stars. '+(score===mod.items.length?'Perfect score, champion!':'Well done for practising. Try again to earn more stars!');stage.appendChild(p);const next=document.createElement('button');next.className='sq-lab-next';next.textContent='Try again ↻';next.onclick=()=>selectModule(moduleIndex);stage.appendChild(next);const another=document.createElement('button');another.className='sq-lab-next';another.style.marginLeft='8px';another.textContent='Next lesson →';another.onclick=()=>selectModule((moduleIndex+1)%modules.length);stage.appendChild(another)}
selectModule(0);
})();
