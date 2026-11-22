import {initializeApp,getApps,getApp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getAuth,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {getFirestore,doc,getDoc,setDoc,serverTimestamp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import {firebaseConfig} from './firebase-config.js';
const app=getApps().length?getApp():initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);
const classCode=()=>localStorage.getItem('sqJoinedClassV1');
const active=()=>window.SQChampions?.active?.();
const validGames=['runner','training','announcement','library','strategy','festival','arena'];
const waitAuth=()=>new Promise(resolve=>{const stop=onAuthStateChanged(auth,u=>{stop();resolve(u)},()=>resolve(null))});
async function membership(){const code=classCode(),champ=active(),user=await waitAuth();if(!code||!champ||!user?.isAnonymous)return null;const ref=doc(db,'classes',code,'students',user.uid),snap=await getDoc(ref);if(!snap.exists()||snap.data().championId!==champ.id)return null;return {code,champ,user}}
export async function syncScore(game,score){if(!validGames.includes(game)||!Number.isFinite(Number(score)))return false;try{const m=await membership();if(!m)return false;const value=Math.max(0,Math.min(1000000,Math.floor(Number(score))));await setDoc(doc(db,'classes',m.code,'students',m.user.uid,'scores',game),{game,score:value,updatedAt:serverTimestamp()});return true}catch(e){console.warn('SPORTS QUEST score sync:',e.code||e.message);return false}}
export async function syncReflection(data){try{const m=await membership();if(!m)return false;const allowed=['feeling','learned','activity','sentences','next'];const cleaned={};for(const key of allowed){cleaned[key]=String(data[key]||'').slice(0,1200)}await setDoc(doc(db,'classes',m.code,'students',m.user.uid,'reflections','latest'),{...cleaned,updatedAt:serverTimestamp()});return true}catch(e){console.warn('SPORTS QUEST reflection sync:',e.code||e.message);return false}}
window.addEventListener('sq-profile-updated',e=>{if(e.detail?.game)syncScore(e.detail.game,e.detail.score)});
window.SQFirebaseSync={syncScore,syncReflection};
