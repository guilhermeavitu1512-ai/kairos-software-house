// One scroll clock shared by HTML, fallback and WebGL.
export const clamp01=(v:number)=>Math.max(0,Math.min(1,v));
export const localProgress=(p:number,start:number,end:number)=>clamp01((p-start)/(end-start));
export const smooth=(v:number)=>{const t=clamp01(v);return t*t*(3-2*t);};
export const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
export const wipeStart=[.25,.57] as const;
export const wipeEnd=[.45,.77] as const;
export const wipeProgress=(p:number,index:number)=>localProgress(p,wipeStart[index],wipeEnd[index]);
// Content changes halfway through the verified solid-coverage plateau.
// Pure mapping: seeking/reversing never depends on a previous chapter.
export const activeChapter=(p:number)=>wipeProgress(p,1)>=.91?2:wipeProgress(p,0)>=.91?1:0;
export function wipeTravel(t:number){
  if(t<.78)return mix(-1,0,smooth(t/.78));
  if(t<.88)return 0;
  return smooth((t-.88)/.12);
}
export const covered=(p:number)=>{const a=wipeProgress(p,0),b=wipeProgress(p,1);return (a>=.88&&a<=.94)||(b>=.88&&b<=.94);};
export const stable=(p:number)=>p<.22||(p>.47&&p<.54)||p>.79;
// Same normalized envelope in both directions. The exit window fits the
// existing (shorter) departure phase; neither window changes object timing.
export function textOpacity(p:number,index:number,reduced:boolean){
  // The live heading stays fully opaque; only the solid mesh conceals it.
  // Reduced-motion static nodes select the same chapter without a crossfade.
  return reduced?(index===activeChapter(p)?1:0):1;
}
export function copyStack(p:number,reduced:boolean):0|2{
  // Discrete, never interpolated. Both boundary neighborhoods lie entirely
  // inside the zero-opacity plateau, including when scrolling backwards.
  const invisible=textOpacity(p,0,reduced)===0&&textOpacity(p,1,reduced)===0&&textOpacity(p,2,reduced)===0;
  return !reduced&&covered(p)&&invisible?0:2;
}
