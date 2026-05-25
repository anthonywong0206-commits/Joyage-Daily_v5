export const moods = [
  { key:'joy', zh:'喜', en:'Joy', emoji:'😊', color:'#f7c86f', soft:'#fff1c9', gradient:'from-amber-100 via-orange-50 to-white' },
  { key:'anger', zh:'怒', en:'Anger', emoji:'😡', color:'#f59b8e', soft:'#ffe0dc', gradient:'from-rose-100 via-orange-50 to-white' },
  { key:'sadness', zh:'哀', en:'Sadness', emoji:'😢', color:'#9bc4e2', soft:'#dff0fb', gradient:'from-blue-100 via-sky-50 to-white' },
  { key:'fear', zh:'懼', en:'Fear', emoji:'😨', color:'#b9a7ee', soft:'#ece6ff', gradient:'from-violet-100 via-indigo-50 to-white' },
  { key:'disgust', zh:'厭惡', en:'Disgust', emoji:'🤢', color:'#9bd8b1', soft:'#e0f7e8', gradient:'from-emerald-100 via-green-50 to-white' },
  { key:'surprise', zh:'驚訝', en:'Surprise', emoji:'😲', color:'#f2b7d7', soft:'#ffe2f1', gradient:'from-pink-100 via-fuchsia-50 to-white' }
]
export const moodMap = Object.fromEntries(moods.map(m=>[m.key,m]))
