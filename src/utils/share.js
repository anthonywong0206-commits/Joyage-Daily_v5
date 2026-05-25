import { toPng } from 'html-to-image'
export async function exportNode(node, filename='joyage-daily.png'){
  if(!node) return
  const dataUrl = await toPng(node,{cacheBust:true,pixelRatio:2,backgroundColor:'#fff7ed'})
  const blob = await (await fetch(dataUrl)).blob()
  const file = new File([blob], filename, {type:'image/png'})
  if(navigator.canShare?.({files:[file]})) await navigator.share({files:[file], title:'Joyage Daily'})
  else { const a=document.createElement('a'); a.href=dataUrl; a.download=filename; a.click() }
}
