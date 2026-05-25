import React, { useMemo, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { AnimatePresence, motion } from 'framer-motion'
import { Home, PenLine, CalendarDays, BarChart3 } from 'lucide-react'
import './styles/global.css'
import HomePage from './pages/HomePage.jsx'
import RecordPage from './pages/RecordPage.jsx'
import DiaryPage from './pages/DiaryPage.jsx'
import AnalysisPage from './pages/AnalysisPage.jsx'
import { loadEntries, saveEntries } from './utils/storage.js'

const tabs = [
  { key: 'home', label: '首頁', icon: Home },
  { key: 'record', label: '記錄', icon: PenLine },
  { key: 'diary', label: '日記', icon: CalendarDays },
  { key: 'analysis', label: '分析', icon: BarChart3 }
]

function App(){
  const [tab,setTab]=useState('home')
  const [entries,setEntries]=useState(()=>loadEntries())
  const [toast,setToast]=useState('')
  useEffect(()=>saveEntries(entries),[entries])
  useEffect(()=>{ if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{}) },[])
  const addEntry=(entry)=>{ setEntries(prev=>({...prev,[entry.date]:entry})); setToast('今天的情緒已被記下來。'); setTimeout(()=>setToast(''),2200) }
  const page=useMemo(()=>({
    home:<HomePage entries={entries} setTab={setTab}/>,
    record:<RecordPage entries={entries} onSave={addEntry}/>,
    diary:<DiaryPage entries={entries} onSave={addEntry}/>,
    analysis:<AnalysisPage entries={entries}/>
  }[tab]),[tab,entries])
  return <div className="min-h-screen bg-app text-stone-800 pb-28">
    <div className="fixed inset-0 pointer-events-none bg-orbs" />
    <main className="relative max-w-lg mx-auto px-4 pt-5 safe-top">
      <AnimatePresence mode="wait"><motion.div key={tab} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:.25}}>{page}</motion.div></AnimatePresence>
    </main>
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom"><div className="max-w-lg mx-auto px-4 pb-4"><div className="glass rounded-[2rem] p-2 grid grid-cols-4 shadow-soft border border-white/70">{tabs.map(t=>{const I=t.icon; const active=tab===t.key; return <button key={t.key} onClick={()=>setTab(t.key)} className="relative h-16 rounded-[1.5rem] flex flex-col items-center justify-center gap-1 text-xs transition"><AnimatePresence>{active&&<motion.span layoutId="tabbg" className="absolute inset-0 rounded-[1.5rem] bg-stone-900 shadow-lg"/>}</AnimatePresence><I size={21} className={active?'relative text-white':'relative text-stone-500'}/><span className={active?'relative text-white font-bold':'relative text-stone-500'}>{t.label}</span></button>})}</div></div></nav>
    <AnimatePresence>{toast && <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}} className="fixed left-1/2 -translate-x-1/2 bottom-28 z-[60] bg-stone-900 text-white px-5 py-3 rounded-full shadow-xl text-sm">{toast}</motion.div>}</AnimatePresence>
  </div>
}

createRoot(document.getElementById('root')).render(<App />)
