const KEY='joyage_daily_entries_v1'
export function loadEntries(){
  try{ return JSON.parse(localStorage.getItem(KEY)||'{}') }catch{ return {} }
}
export function saveEntries(entries){ localStorage.setItem(KEY, JSON.stringify(entries)) }
export const todayISO=()=> new Date().toISOString().slice(0,10)
export function calcStreak(entries){
  const dates=new Set(Object.keys(entries)); let n=0; const d=new Date();
  while(dates.has(d.toISOString().slice(0,10))){ n++; d.setDate(d.getDate()-1) }
  return n
}
export function longestStreak(entries){
  const dates=Object.keys(entries).sort(); if(!dates.length)return 0; let best=1,cur=1;
  for(let i=1;i<dates.length;i++){ const a=new Date(dates[i-1]); a.setDate(a.getDate()+1); if(a.toISOString().slice(0,10)===dates[i]) cur++; else cur=1; best=Math.max(best,cur)}
  return best
}
