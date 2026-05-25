import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Header from '../components/Header.jsx'
import Card from '../components/Card.jsx'
import { moods, moodMap } from '../utils/mood.js'
import { todayISO } from '../utils/storage.js'

export default function RecordPage({entries,onSave}){
  const date=todayISO(); const existing=entries[date]
  const [mood,setMood]=useState(existing?.mood||'joy')
  const [note,setNote]=useState(localStorage.getItem('joyage_draft')||existing?.note||'')
  useEffect(()=>localStorage.setItem('joyage_draft',note),[note])
  const selected=moodMap[mood]
  function save(){ onSave({date,mood,note,createdAt:existing?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString(),timeBucket:getBucket()}); localStorage.removeItem('joyage_draft') }
  return <div><Header title="記錄心情" subtitle="像記帳一樣，簡單記下今天的情緒流向。" />
    <Card className={`mb-4 bg-gradient-to-br ${selected.gradient}`}><h2 className="font-black text-xl mb-4">選擇今天的主情緒</h2><div className="grid grid-cols-3 gap-3">{moods.map(m=><motion.button key={m.key} whileTap={{scale:.92}} onClick={()=>setMood(m.key)} className={`rounded-[1.6rem] p-4 text-center transition border ${mood===m.key?'bg-white shadow-xl scale-105 border-stone-900':'bg-white/50 border-white/60'}`} style={mood===m.key?{boxShadow:`0 0 0 5px ${m.soft}, 0 18px 35px ${m.color}55`}:{}}><div className="text-4xl">{m.emoji}</div><p className="text-sm font-black mt-2">{m.zh}</p></motion.button>)}</div></Card>
    <Card className="mb-4"><div className="flex justify-between mb-3"><h2 className="font-black text-xl">今天發生了什麼事？</h2><span className="text-xs text-stone-500">{note.length} 字</span></div><textarea value={note} onChange={e=>setNote(e.target.value)} rows={8} placeholder="今天發生了什麼事？" className="w-full resize-none rounded-[1.5rem] bg-white/70 p-4 text-base border border-white/80 focus:ring-4 focus:ring-orange-100" /></Card>
    <motion.button whileTap={{scale:.98}} onClick={save} className="w-full h-16 rounded-[1.7rem] bg-stone-900 text-white font-black text-lg shadow-soft">記下每一天</motion.button>
  </div>
}
function getBucket(){ const h=new Date().getHours(); if(h<6)return '深夜'; if(h<12)return '上午'; if(h<18)return '下午'; return '晚上' }
