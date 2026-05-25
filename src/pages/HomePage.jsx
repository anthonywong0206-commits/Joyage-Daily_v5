import { motion } from 'framer-motion'
import { BookHeart, CalendarHeart, Sparkles } from 'lucide-react'
import Header from '../components/Header.jsx'
import Card from '../components/Card.jsx'
import { moods, moodMap } from '../utils/mood.js'
import { calcStreak, todayISO } from '../utils/storage.js'

export default function HomePage({entries,setTab}){
  const list=Object.values(entries); const total=Math.max(list.length,1); const today=entries[todayISO()]; const streak=calcStreak(entries)
  const now=new Date(); const date=now.toLocaleDateString('zh-HK',{month:'long',day:'numeric',weekday:'long'}); const time=now.toLocaleTimeString('zh-HK',{hour:'2-digit',minute:'2-digit'})
  return <div><Header title="今天過得還好嗎？" subtitle="記下情緒，也是在照顧自己。" />
    <Card className="bg-gradient-to-br from-white/80 to-orange-50/70 mb-4"><div className="flex justify-between items-start"><div><p className="text-stone-500 text-sm">{date} · {time}</p><h2 className="text-5xl font-black mt-3">{streak}<span className="text-base ml-1 font-bold text-stone-500">天連續記錄</span></h2></div><div className="text-5xl">🌤️</div></div></Card>
    <Card className="mb-4"><div className="flex items-center justify-between mb-4"><h2 className="text-xl font-black">情緒概況</h2><span className="text-xs text-stone-500">共 {list.length} 日</span></div><div className="space-y-3">{moods.map(m=>{const count=list.filter(e=>e.mood===m.key).length; const pct=Math.round(count/total*100); return <div key={m.key}><div className="flex justify-between text-sm mb-1"><span className="font-bold">{m.emoji} {m.zh}</span><motion.span initial={{opacity:0}} animate={{opacity:1}}>{count}日 · {pct}%</motion.span></div><div className="h-3 bg-stone-100 rounded-full overflow-hidden"><motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:.7}} className="h-full rounded-full" style={{background:m.color}} /></div></div>})}</div></Card>
    <div className="grid grid-cols-3 gap-3 mb-4">{[{k:'record',t:'記錄心情',i:BookHeart},{k:'diary',t:'情緒日記',i:CalendarHeart},{k:'analysis',t:'了解自己',i:Sparkles}].map(x=>{const I=x.i; return <motion.button whileTap={{scale:.96}} key={x.k} onClick={()=>setTab(x.k)} className="glass rounded-[1.6rem] p-4 shadow-soft border border-white/60 text-left"><I size={24}/><p className="text-sm font-black mt-3">{x.t}</p></motion.button>})}</div>
    <Card className={`bg-gradient-to-br ${today?moodMap[today.mood].gradient:'from-stone-50 to-white'}`}><p className="text-sm text-stone-500 mb-2">今日情緒摘要</p>{today?<><div className="text-5xl mb-2">{moodMap[today.mood].emoji}</div><h3 className="font-black text-xl">{moodMap[today.mood].zh}</h3><p className="mt-2 text-stone-600 line-clamp-3">{today.note||'今天已經好好記下來。'}</p></>:<p className="text-stone-500">今天尚未記錄，給自己一分鐘吧。</p>}</Card>
  </div>
}
