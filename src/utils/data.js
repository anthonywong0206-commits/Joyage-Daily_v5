export const moods=[
 {id:'joy',zh:'喜',en:'Joy',emoji:'😊',color:'#FDBA74',soft:'#FFF1D8',grad:'linear-gradient(135deg,#fff5d7,#ffc2cf)'},
 {id:'anger',zh:'怒',en:'Anger',emoji:'😡',color:'#FB7185',soft:'#FFE4E6',grad:'linear-gradient(135deg,#ffe5db,#ff8ea3)'},
 {id:'sad',zh:'哀',en:'Sadness',emoji:'😢',color:'#7DD3FC',soft:'#E0F2FE',grad:'linear-gradient(135deg,#e0f7ff,#9ed7ff)'},
 {id:'fear',zh:'懼',en:'Fear',emoji:'😨',color:'#A5B4FC',soft:'#EEF2FF',grad:'linear-gradient(135deg,#f1edff,#c4b5fd)'},
 {id:'disgust',zh:'厭惡',en:'Disgust',emoji:'🤢',color:'#86EFAC',soft:'#DCFCE7',grad:'linear-gradient(135deg,#e8ffe9,#a7f3d0)'},
 {id:'surprise',zh:'驚訝',en:'Surprise',emoji:'😲',color:'#FCD34D',soft:'#FEF3C7',grad:'linear-gradient(135deg,#fff7c5,#fed7aa)'}
]
export const moodMap=Object.fromEntries(moods.map(m=>[m.id,m]))
const KEY='joyage_daily_records_v2'
const seed=()=>{const now=new Date();return Array.from({length:35},(_,i)=>{const d=new Date(now);d.setDate(now.getDate()-i);const m=moods[[0,0,2,1,0,5,3,4,0,2][i%10]];return{date:d.toISOString().slice(0,10),mood:m.id,text:['今天過得不錯，和朋友聊天讓我很開心！','有點累，但仍然完成了重要的小事。','情緒有點波動，想給自己多一點空間。'][i%3],createdAt:d.toISOString()}})}
export function loadRecords(){try{const raw=localStorage.getItem(KEY);if(raw)return JSON.parse(raw)}catch(e){} const s=seed(); saveRecords(s); return s}
export function saveRecords(records){localStorage.setItem(KEY,JSON.stringify(records))}
export function upsertRecord(item){const records=loadRecords().filter(r=>r.date!==item.date); records.push(item); saveRecords(records); return records}
export function todayKey(){return new Date().toISOString().slice(0,10)}
export function counts(records){return moods.map(m=>({ ...m, count:records.filter(r=>r.mood===m.id).length}))}
export function streak(records){const set=new Set(records.map(r=>r.date));let n=0,d=new Date();while(set.has(d.toISOString().slice(0,10))){n++;d.setDate(d.getDate()-1)}return n}
export function longestStreak(records){const dates=[...new Set(records.map(r=>r.date))].sort();let best=0,cur=0,last=null;dates.forEach(x=>{const d=new Date(x); if(last&&((d-last)/86400000===1)) cur++; else cur=1; best=Math.max(best,cur); last=d});return best}
