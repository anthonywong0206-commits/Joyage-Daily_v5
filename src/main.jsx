import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const EMOTIONS = [
  { key: 'joy', zh: '喜', en: 'Joy', emoji: '😊', color: '#ffbf69', soft: '#fff2cf' },
  { key: 'anger', zh: '怒', en: 'Anger', emoji: '😡', color: '#ff7a72', soft: '#ffe0dc' },
  { key: 'sadness', zh: '哀', en: 'Sadness', emoji: '😢', color: '#76c7e8', soft: '#ddf3ff' },
  { key: 'fear', zh: '懼', en: 'Fear', emoji: '😨', color: '#a8a5ff', soft: '#e8e6ff' },
  { key: 'disgust', zh: '厭惡', en: 'Disgust', emoji: '🤢', color: '#8fd19e', soft: '#e4f8e8' },
  { key: 'surprise', zh: '驚訝', en: 'Surprise', emoji: '😲', color: '#ffd166', soft: '#fff3c4' }
]

const TABS = [
  { id: 'home', label: '首頁', icon: '⌂' },
  { id: 'record', label: '記錄', icon: '✎' },
  { id: 'diary', label: '日記', icon: '▣' },
  { id: 'analytics', label: '分析', icon: '⌘' }
]

const todayKey = () => new Date().toISOString().slice(0,10)
const pad = n => String(n).padStart(2, '0')
const getEmotion = key => EMOTIONS.find(e => e.key === key) || EMOTIONS[0]

function safeLoad(){
  try { return JSON.parse(localStorage.getItem('joyage-daily-records') || '[]') } catch { return [] }
}
function safeSave(records){
  try { localStorage.setItem('joyage-daily-records', JSON.stringify(records)) } catch {}
}

function App(){
  const [tab, setTab] = useState('home')
  const [records, setRecords] = useState(safeLoad)
  const [toast, setToast] = useState('')

  useEffect(() => safeSave(records), [records])
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}))
    }
  }, [])

  const addRecord = (record) => {
    setRecords(prev => {
      const next = prev.filter(r => r.date !== record.date)
      return [...next, record].sort((a,b)=>a.date.localeCompare(b.date))
    })
    setToast('今天的情緒已被記下來。')
    setTimeout(()=>setToast(''), 2200)
    setTab('home')
  }

  return <div className="app-shell">
    <div className="ambient a1"/><div className="ambient a2"/><div className="ambient a3"/>
    <main className="phone-frame">
      {tab === 'home' && <Home records={records} go={setTab}/>} 
      {tab === 'record' && <Record onSave={addRecord} records={records}/>} 
      {tab === 'diary' && <Diary records={records} onSave={addRecord}/>} 
      {tab === 'analytics' && <Analytics records={records}/>} 
    </main>
    <BottomNav tab={tab} setTab={setTab}/>
    {toast && <div className="toast">✓ {toast}</div>}
  </div>
}

function Header({title='Joyage Daily', sub='把每天的情緒，好好記下來。'}){
  return <header className="topbar">
    <div className="brand-mark">⌣</div>
    <div><h1>{title}</h1><p>{sub}</p></div>
  </header>
}

function Home({records, go}){
  const now = new Date()
  const latest = [...records].sort((a,b)=>b.date.localeCompare(a.date))[0]
  const stats = useMemo(() => counts(records), [records])
  const streak = calcStreak(records)
  const total = Math.max(records.length, 1)
  return <section className="page fade-in">
    <Header />
    <div className="hero-card glass">
      <div><p className="eyebrow">今天過得還好嗎？</p><h2>記下情緒，也是在照顧自己。</h2></div>
      <div className="sun">☀</div>
      <div className="mini-grid">
        <Info label="今日日期" value={`${now.getMonth()+1}月${now.getDate()}日`} />
        <Info label="連續記錄" value={`${streak.current} 天`} />
      </div>
    </div>

    <Card title="情緒概況" action="本月">
      <div className="stat-list">
        {EMOTIONS.map(e => {
          const n = stats[e.key] || 0; const p = Math.round(n/total*100)
          return <div className="stat-row" key={e.key}>
            <span className="emoji-dot" style={{background:e.soft}}>{e.emoji}</span>
            <div className="stat-main"><b>{e.zh} <small>({e.en})</small></b><div className="bar"><i style={{width:`${p}%`, background:e.color}}/></div></div>
            <span className="count">{n}日<br/><small>{p}%</small></span>
          </div>
        })}
      </div>
    </Card>

    <div className="quick-grid">
      <button className="quick q1" onClick={()=>go('record')}><b>記錄心情</b><span>記下今天</span></button>
      <button className="quick q2" onClick={()=>go('diary')}><b>情緒日記</b><span>重看每一天</span></button>
      <button className="quick q3" onClick={()=>go('analytics')}><b>了解自己</b><span>分析情緒模式</span></button>
    </div>

    <Card title="今日情緒摘要">
      {latest ? <div className="summary-card" style={{background:getEmotion(latest.emotion).soft}}>
        <div className="big-emoji">{getEmotion(latest.emotion).emoji}</div>
        <div><h3>{getEmotion(latest.emotion).zh} ({getEmotion(latest.emotion).en})</h3><p>{latest.text || '今天沒有寫下文字，但情緒已被好好保存。'}</p><small>{latest.date} · {latest.time}</small></div>
      </div> : <Empty text="未有紀錄，先記下今天的心情吧。"/>}
    </Card>
  </section>
}

function Record({onSave, records}){
  const existing = records.find(r => r.date === todayKey())
  const [emotion, setEmotion] = useState(existing?.emotion || 'joy')
  const [text, setText] = useState(existing?.text || '')
  const chosen = getEmotion(emotion)
  const save = () => onSave({ date: todayKey(), emotion, text, time: new Date().toLocaleTimeString('zh-HK', {hour:'2-digit', minute:'2-digit'}), createdAt: Date.now() })
  return <section className="page fade-in record-page" style={{'--chosen': chosen.color, '--soft': chosen.soft}}>
    <div className="record-hero glass"><p>今天，你的心情是？</p><h2>選擇一種最接近的情緒</h2><div className="chosen-emoji">{chosen.emoji}</div><b>{chosen.zh} ({chosen.en})</b></div>
    <div className="emotion-grid">
      {EMOTIONS.map(e => <button key={e.key} className={`emotion-btn ${emotion===e.key?'active':''}`} onClick={()=>setEmotion(e.key)} style={{'--c':e.color,'--s':e.soft}}><span>{e.emoji}</span><b>{e.zh}</b><small>{e.en}</small></button>)}
    </div>
    <div className="journal-box glass"><textarea value={text} onChange={e=>setText(e.target.value.slice(0,500))} placeholder="今天發生了什麼事？"/><small>{text.length}/500</small></div>
    <button className="primary-btn" onClick={save}>記下每一天</button>
  </section>
}

function Diary({records, onSave}){
  const now = new Date()
  const [month, setMonth] = useState(new Date(now.getFullYear(), now.getMonth(), 1))
  const [selected, setSelected] = useState(todayKey())
  const rec = records.find(r=>r.date===selected)
  const days = calendarDays(month)
  return <section className="page fade-in">
    <div className="month-head"><button onClick={()=>setMonth(new Date(month.getFullYear(), month.getMonth()-1, 1))}>‹</button><h2>{month.getFullYear()}年{month.getMonth()+1}月</h2><button onClick={()=>setMonth(new Date(month.getFullYear(), month.getMonth()+1, 1))}>›</button></div>
    <div className="calendar glass">
      {['日','一','二','三','四','五','六'].map(d=><b className="weekday" key={d}>{d}</b>)}
      {days.map((d,i) => d ? <Day key={d} d={d} records={records} selected={selected} setSelected={setSelected}/> : <span key={'x'+i}/>) }
    </div>
    <Card title="日記詳情">
      {rec ? <Detail rec={rec}/> : <Empty text="這一天未有紀錄，可以在記錄頁新增或覆蓋今天紀錄。"/>}
    </Card>
    <ShareCard rec={rec}/>
  </section>
}

function Day({d, records, selected, setSelected}){
  const date = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
  const rec = records.find(r=>r.date===date)
  const emo = rec ? getEmotion(rec.emotion) : null
  return <button className={`day ${selected===date?'selected':''}`} onClick={()=>setSelected(date)} style={{background: emo?.soft || 'rgba(255,255,255,.45)'}}><small>{d.getDate()}</small>{emo && <span>{emo.emoji}</span>}</button>
}

function Detail({rec}){
  const e = getEmotion(rec.emotion)
  return <div className="detail-card" style={{background:e.soft}}><div className="big-emoji">{e.emoji}</div><div><h3>{e.zh} ({e.en})</h3><p>{rec.text || '沒有文字紀錄。'}</p><small>{rec.date} · {rec.time}</small></div></div>
}

function ShareCard({rec}){
  const download = () => {
    if (!rec) return
    const e = getEmotion(rec.emotion)
    const canvas = document.createElement('canvas')
    canvas.width = 1080; canvas.height = 1920
    const ctx = canvas.getContext('2d')
    const grd = ctx.createLinearGradient(0,0,1080,1920)
    grd.addColorStop(0, '#ffd6c9'); grd.addColorStop(.5, '#d9ecff'); grd.addColorStop(1, '#e8ddff')
    ctx.fillStyle = grd; ctx.fillRect(0,0,1080,1920)
    ctx.fillStyle='rgba(255,255,255,.45)'; roundRect(ctx,100,180,880,1480,70); ctx.fill()
    ctx.font='120px Arial'; ctx.textAlign='center'; ctx.fillText(e.emoji,540,520)
    ctx.fillStyle='#25304f'; ctx.font='bold 64px Arial'; ctx.fillText(`${e.zh} (${e.en})`,540,650)
    ctx.font='36px Arial'; wrap(ctx, rec.text || '今天的情緒，被我好好記下來。', 540, 800, 720, 58)
    ctx.font='30px Arial'; ctx.fillText(rec.date,540,300)
    ctx.font='bold 42px Arial'; ctx.fillText('Joyage Daily',540,1540)
    const a = document.createElement('a'); a.href = canvas.toDataURL('image/png'); a.download = 'joyage-daily-story.png'; a.click()
  }
  return <Card title="情緒分享卡（IG Story）"><div className="story-preview"><div>{rec ? getEmotion(rec.emotion).emoji : '😊'}</div><b>{rec ? `${getEmotion(rec.emotion).zh} (${getEmotion(rec.emotion).en})` : '喜 (Joy)'}</b><p>{rec?.text || '選擇一篇日記後，可生成精美分享卡。'}</p><small>Joyage Daily</small></div><button className="outline-btn" disabled={!rec} onClick={download}>儲存圖片 PNG</button></Card>
}

function Analytics({records}){
  const stats = counts(records)
  const total = Math.max(records.length,1)
  const top = EMOTIONS.map(e=>({ ...e, n: stats[e.key]||0 })).sort((a,b)=>b.n-a.n)[0]
  const streak = calcStreak(records)
  return <section className="page fade-in">
    <Header title="了解自己" sub="你最近最常感受到的是" />
    <div className="top-emotion glass" style={{background:`linear-gradient(135deg, ${top.soft}, rgba(255,255,255,.82))`}}><div className="big-emoji">{top.emoji}</div><h2>{top.zh} ({top.en})</h2><p>{Math.round(top.n/total*100)}%</p></div>
    <Card title="情緒分佈"><Donut stats={stats}/></Card>
    <Card title="情緒時間分佈"><Heatmap /></Card>
    <Card title="連續記錄"><div className="three-stats"><Info label="目前連續" value={`${streak.current}天`}/><Info label="最長連續" value={`${streak.longest}天`}/><Info label="本月記錄率" value={`${monthRate(records)}%`}/></div><SparkLine records={records}/></Card>
    <Card title="本月 vs 上月比較"><Bars stats={stats}/></Card>
  </section>
}

function Donut({stats}){
  const total = Math.max(Object.values(stats).reduce((a,b)=>a+b,0),1)
  let offset=0
  return <div className="donut-wrap"><svg viewBox="0 0 42 42" className="donut">{EMOTIONS.map(e=>{const val=(stats[e.key]||0)/total*100; const dash=`${val} ${100-val}`; const item=<circle key={e.key} cx="21" cy="21" r="15.9" fill="transparent" stroke={e.color} strokeWidth="7" strokeDasharray={dash} strokeDashoffset={-offset}/>; offset+=val; return item})}</svg><div className="legend">{EMOTIONS.map(e=><span key={e.key}><i style={{background:e.color}}/> {e.zh} {stats[e.key]||0}</span>)}</div></div>
}
function Heatmap(){return <div className="heatmap">{Array.from({length:24}).map((_,i)=><i key={i} style={{opacity:.25+(i%6)*.12}} />)}</div>}
function SparkLine(){return <svg className="spark" viewBox="0 0 300 80"><polyline fill="none" stroke="currentColor" strokeWidth="4" points="0,60 30,48 60,55 90,30 120,40 150,22 180,34 210,18 240,28 270,16 300,24"/></svg>}
function Bars({stats}){return <div className="bars">{EMOTIONS.map(e=><div key={e.key}><b style={{height:`${28+(stats[e.key]||0)*10}px`, background:e.color}}/><span>{e.emoji}</span></div>)}</div>}

function BottomNav({tab,setTab}){return <nav className="bottom-nav">{TABS.map(t=><button key={t.id} className={tab===t.id?'on':''} onClick={()=>setTab(t.id)}><span>{t.icon}</span><small>{t.label}</small></button>)}</nav>}
function Card({title, action, children}){return <section className="card glass"><div className="card-head"><h2>{title}</h2>{action&&<small>{action}</small>}</div>{children}</section>}
function Info({label,value}){return <div className="info"><small>{label}</small><b>{value}</b></div>}
function Empty({text}){return <p className="empty">{text}</p>}

function counts(records){const s={}; records.forEach(r=>{s[r.emotion]=(s[r.emotion]||0)+1}); return s}
function calendarDays(month){const first=new Date(month.getFullYear(),month.getMonth(),1); const last=new Date(month.getFullYear(),month.getMonth()+1,0); const arr=Array(first.getDay()).fill(null); for(let i=1;i<=last.getDate();i++) arr.push(new Date(month.getFullYear(),month.getMonth(),i)); return arr}
function calcStreak(records){const set=new Set(records.map(r=>r.date)); let cur=0; let d=new Date(); while(set.has(d.toISOString().slice(0,10))){cur++; d.setDate(d.getDate()-1)} let longest=0, run=0, last=null; [...set].sort().forEach(ds=>{const x=new Date(ds); if(last && (x-last)/86400000===1) run++; else run=1; longest=Math.max(longest,run); last=x}); return {current:cur,longest}}
function monthRate(records){const n=new Date(); const days=new Date(n.getFullYear(),n.getMonth()+1,0).getDate(); const c=records.filter(r=>r.date.startsWith(`${n.getFullYear()}-${pad(n.getMonth()+1)}`)).length; return Math.round(c/days*100)}
function roundRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function wrap(ctx,text,x,y,maxWidth,lineHeight){let words=String(text).split(''), line=''; for(let n=0;n<words.length;n++){let test=line+words[n]; if(ctx.measureText(test).width>maxWidth&&n>0){ctx.fillText(line,x,y); line=words[n]; y+=lineHeight}else line=test} ctx.fillText(line,x,y)}

createRoot(document.getElementById('root')).render(<App />)
