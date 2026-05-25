import { useMemo, useRef } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts'
import { Download, Share2 } from 'lucide-react'
import Header from '../components/Header.jsx'
import Card from '../components/Card.jsx'
import { moods, moodMap } from '../utils/mood.js'
import { calcStreak, longestStreak } from '../utils/storage.js'
import { exportNode } from '../utils/share.js'

export default function AnalysisPage({entries}){
  const ref=useRef(null); const list=Object.values(entries)
  const data=useMemo(()=>moods.map(m=>({name:m.zh,key:m.key,value:list.filter(e=>e.mood===m.key).length,color:m.color,emoji:m.emoji})),[entries])
  const top=[...data].sort((a,b)=>b.value-a.value)[0] || data[0]; const total=Math.max(list.length,1)
  const bucket=['上午','下午','晚上','深夜','補記'].map(b=>({name:b,...Object.fromEntries(moods.map(m=>[m.zh,list.filter(e=>e.timeBucket===b&&e.mood===m.key).length]))}))
  const months=monthCompare(list)
  const rate=monthlyRate(entries)
  return <div><Header title="了解自己" subtitle="把分散的情緒，整理成你看得懂的節奏。" />
    <div ref={ref} className="space-y-4 rounded-[2rem]">
      <Card className={`bg-gradient-to-br ${moodMap[top.key]?.gradient||'from-white to-orange-50'}`}><p className="text-sm text-stone-500">最近最常感受到的是</p><div className="flex items-center justify-between mt-3"><div><h2 className="text-4xl font-black">{top.emoji} {top.name}</h2><p className="mt-2 text-stone-600">佔全部記錄 {Math.round(top.value/total*100)}%</p></div><div className="text-7xl">{top.emoji}</div></div></Card>
      <Card><h2 className="font-black text-xl mb-3">情緒日數分佈</h2><div className="h-64"><ResponsiveContainer><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={98} paddingAngle={4}>{data.map(d=><Cell key={d.key} fill={d.color}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div><div className="grid grid-cols-3 gap-2">{data.map(d=><div key={d.key} className="rounded-2xl bg-white/60 p-3 text-center"><div>{d.emoji}</div><b>{d.value}</b><p className="text-xs text-stone-500">{d.name}</p></div>)}</div></Card>
      <Card><h2 className="font-black text-xl mb-3">情緒時間分佈</h2><div className="h-64"><ResponsiveContainer><BarChart data={bucket}><XAxis dataKey="name"/><Tooltip/>{moods.map(m=><Bar key={m.key} dataKey={m.zh} stackId="a" fill={m.color} radius={[8,8,0,0]}/>)}</BarChart></ResponsiveContainer></div></Card>
      <Card><h2 className="font-black text-xl mb-3">連續記錄</h2><div className="grid grid-cols-3 gap-3"><Metric label="目前 streak" value={`${calcStreak(entries)}天`}/><Metric label="最長 streak" value={`${longestStreak(entries)}天`}/><Metric label="月度記錄率" value={`${rate}%`}/></div></Card>
      <Card><h2 className="font-black text-xl mb-3">月份比較</h2><div className="h-56"><ResponsiveContainer><AreaChart data={months}><CartesianGrid strokeDasharray="3 3" opacity={0.25}/><XAxis dataKey="name"/><Tooltip/><Area type="monotone" dataKey="記錄日數" stroke="#8f7cf7" fill="#d9d1ff" strokeWidth={3}/></AreaChart></ResponsiveContainer></div><p className="text-sm text-stone-500">本月 vs 上月：用記錄日數作初步比較，之後可預留 AI 情緒分析。</p></Card>
    </div>
    <div className="flex gap-3 mt-4"><button onClick={()=>exportNode(ref.current,'joyage-analysis.png')} className="flex-1 h-14 rounded-[1.5rem] bg-stone-900 text-white font-black flex items-center justify-center gap-2"><Share2 size={18}/>分享分析</button><button onClick={()=>exportNode(ref.current,'joyage-analysis.png')} className="h-14 px-5 rounded-[1.5rem] glass"><Download size={18}/></button></div>
  </div>
}
function Metric({label,value}){return <div className="rounded-[1.5rem] bg-white/65 p-3 text-center"><p className="text-xs text-stone-500">{label}</p><b className="text-xl">{value}</b></div>}
function monthlyRate(entries){const now=new Date(); const prefix=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`; const days=new Date(now.getFullYear(),now.getMonth()+1,0).getDate(); return Math.round(Object.keys(entries).filter(d=>d.startsWith(prefix)).length/days*100)}
function monthCompare(list){const map={}; list.forEach(e=>{const k=e.date.slice(0,7); map[k]=(map[k]||0)+1}); const now=new Date(); const arr=[]; for(let i=5;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1); const k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`; arr.push({name:`${d.getMonth()+1}月`,'記錄日數':map[k]||0})} return arr}
