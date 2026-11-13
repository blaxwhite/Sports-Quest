(function(){
'use strict';
if(document.getElementById('sports-buddy-root'))return;
const root=document.createElement('div');root.id='sports-buddy-root';
root.innerHTML="<button class=\"sb-launch\" type=\"button\" aria-expanded=\"false\" aria-controls=\"sb-panel\"><span class=\"sb-mascot\" aria-hidden=\"true\"><span class=\"sb-crown\"></span><span class=\"sb-face\"><span class=\"sb-eye left\"></span><span class=\"sb-eye right\"></span><span class=\"sb-mouth\"></span></span><span class=\"sb-arm left\"></span><span class=\"sb-arm right\"></span><span class=\"sb-foot left\"></span><span class=\"sb-foot right\"></span></span><span class=\"sb-launch-label\"><strong>SPORTS BUDDY</strong><small>Ask your companion ✨</small></span></button><section class=\"sb-panel\" id=\"sb-panel\" aria-label=\"Sports Buddy learning chat\" hidden><header class=\"sb-head\"><div class=\"sb-head-title\"><span class=\"sb-mascot\" aria-hidden=\"true\"><span class=\"sb-crown\"></span><span class=\"sb-face\"><span class=\"sb-eye left\"></span><span class=\"sb-eye right\"></span><span class=\"sb-mouth\"></span></span><span class=\"sb-arm left\"></span><span class=\"sb-arm right\"></span><span class=\"sb-foot left\"></span><span class=\"sb-foot right\"></span></span><div><strong>SPORTS BUDDY</strong><small>Your friendly Sports Kingdom guide</small></div></div><button class=\"sb-close\" type=\"button\" aria-label=\"Close Sports Buddy\">×</button></header><div class=\"sb-categories\" aria-label=\"Choose a topic\"></div><div class=\"sb-log\" role=\"log\" aria-live=\"polite\" aria-relevant=\"additions\"></div><div class=\"sb-suggestions\"></div><form class=\"sb-form\"><input type=\"text\" aria-label=\"Ask Sports Buddy\" maxlength=\"180\" placeholder=\"Ask about sports...\" required autocomplete=\"off\"><button type=\"submit\">Ask</button></form><div class=\"sb-note\">Sports-topic helper with prepared answers. No personal details needed.</div></section>";
document.body.appendChild(root);
const panel=root.querySelector('.sb-panel'),launch=root.querySelector('.sb-launch'),log=root.querySelector('.sb-log'),input=root.querySelector('input'),suggestions=root.querySelector('.sb-suggestions');
function add(message,user){const bubble=document.createElement('div');bubble.className='sb-message'+(user?' sb-user':'');bubble.textContent=message;log.appendChild(bubble);log.scrollTop=log.scrollHeight}
const facts=[
{words:['badminton','shuttlecock'],answer:'Badminton is played with a racket and a shuttlecock. Hit the shuttlecock over the net!'},
{words:['football','soccer'],answer:'Football is a team sport. Players kick a ball and try to score goals. Be fair and work together!'},
{words:['basketball','hoop'],answer:'In basketball, players bounce, pass and shoot the ball into a hoop.'},
{words:['tennis'],answer:'Tennis uses a racket, a ball and a net. Players hit the ball over the net.'},
{words:['swim','swimming','pool'],answer:'Swimming is moving through water using your arms and legs. Always swim with an adult or lifeguard nearby.'},
{words:['cycling','bicycle','bike','helmet'],answer:'Cycling means riding a bicycle. Wear a helmet to protect your head.'},
{words:['relay','baton'],answer:'A relay race is a team running race. Each runner passes a baton to the next teammate.'},
{words:['hurdle','jump'],answer:'A hurdle is a barrier runners jump over. Bend your knees and practise safely.'},
{words:['warm up','warm-up','stretch'],answer:'A warm-up prepares your body for exercise. Try gentle jogging and easy stretches.'},
{words:['water','drink','thirst','hydration'],answer:'Drink water before and after exercise. Take water breaks when you need them.'},
{words:['sportsmanship','fair','respect','teamwork','teammate'],answer:'Good sportsmanship means playing fairly, following rules and respecting others. Say “Good game!” after playing.'},
{words:['equipment','racket','ball'],answer:'Sports equipment means the things we use to play. Football uses a ball. Badminton uses a racket and shuttlecock. Cycling uses a bicycle and helmet.'},
{words:['quiz','questions','arcade'],answer:'Open Arcade Zone and choose a quiz. Read or listen carefully, pick an answer, then check your work. It is okay to try again!'},
{words:['runner','run game','lane','controls','obstacle','wisdom gate','play game'],answer:'In Sports Kingdom Runner, move left or right to change lanes and avoid obstacles. Jump over hurdles, collect stars and answer easy sports questions at Wisdom Gates. On a computer, use arrow keys or A/D.'},
{words:['website','home','lesson','knowledge guide','sports quest','navigate'],answer:'On the homepage, read the sports lessons first. Then visit Arcade Zone for four quizzes and Sports Kingdom Runner. You can return to the Knowledge Guide using the top menu.'},
{words:['xp','score','star','points'],answer:'You earn points and XP by completing challenges. Collect golden stars during your run to increase your score.'}
];
function answer(text){const q=text.toLowerCase().replace(/[^a-z0-9 -]/g,' ').trim();
if(/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(q))return 'Hello, champion! 🏅 Ask me about a sport, equipment, teamwork or how to use SPORTS QUEST.';
if(/thank/.test(q))return 'You are welcome, champion! Keep learning and have fun! 🌟';
if(/hint|help me answer|give me answer/.test(q))return 'Here is a hint: Look for the key word in the question. Think about the equipment or action used in that sport. Tell me which sport you are learning about!';
const found=facts.find(f=>f.words.some(w=>q.includes(w)));
return found?found.answer:'I can help with Year 5 sports! Try asking “What is a relay race?”, “What is sportsmanship?” or “How do I play the runner?”';
}
function ask(text){const q=text.trim();if(!q)return;add(q,true);input.value='';const typing=document.createElement('div');typing.className='sb-typing';typing.textContent='Sports Buddy is thinking •••';log.appendChild(typing);log.scrollTop=log.scrollHeight;setTimeout(()=>{typing.remove();add(answer(q),false)},Math.min(650,180+q.length*8))}
const categories=[
{label:'⚽ Sports',questions:['What is a relay race?','How do you play badminton?','What is basketball?']},
{label:'🏅 Equipment',questions:['What equipment do I need?','Why do cyclists wear helmets?','What is a shuttlecock?']},
{label:'💛 Teamwork',questions:['What is sportsmanship?','How can I be a good teammate?','Why should we warm up?']},
{label:'🎮 Website',questions:['How do I play the runner?','Where are the quizzes?','How do I earn points?']}
];
const categoryBar=root.querySelector('.sb-categories');
function showCategory(index){
 categoryBar.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
 suggestions.replaceChildren();
 categories[index].questions.forEach(q=>{const b=document.createElement('button');b.type='button';b.textContent=q;b.addEventListener('click',()=>ask(q));suggestions.appendChild(b)});
}
categories.forEach((cat,i)=>{const b=document.createElement('button');b.type='button';b.textContent=cat.label;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>showCategory(i));categoryBar.appendChild(b)});
showCategory(0);
add('Hey, champion! 🌟 I am Sports Buddy, your guide through the Sports Kingdom. Pick a topic above or ask me a question!');
function toggle(open){panel.hidden=!open;launch.setAttribute('aria-expanded',String(open));if(open)input.focus();else launch.focus()}
launch.addEventListener('click',()=>toggle(panel.hidden));root.querySelector('.sb-close').addEventListener('click',()=>toggle(false));
root.querySelector('form').addEventListener('submit',e=>{e.preventDefault();ask(input.value)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)toggle(false)});
})();
