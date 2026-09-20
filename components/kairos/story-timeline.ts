// One scroll clock shared by HTML, fallback and WebGL.
export const clamp01=(v:number)=>Math.max(0,Math.min(1,v));
export const localProgress=(p:number,start:number,end:number)=>clamp01((p-start)/(end-start));
export const smooth=(v:number)=>{const t=clamp01(v);return t*t*(3-2*t);};
export const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
export const wipeStart=[.24,.56] as const;
export const wipeEnd=[.48,.8] as const;
export const coverStart=.44;
export const coverEnd=.56;
export const wipeProgress=(p:number,index:number)=>localProgress(p,wipeStart[index],wipeEnd[index]);
// Content changes halfway through the verified solid-coverage plateau.
// Pure mapping: seeking/reversing never depends on a previous chapter.
export const activeChapter=(p:number)=>wipeProgress(p,1)>=.5?2:wipeProgress(p,0)>=.5?1:0;
export function wipeTravel(t:number){
  // Equal entrance/exit windows, with zero velocity and acceleration at
  // the edges. The solid hold hides the copy change in either direction.
  const ease=(v:number)=>{const u=clamp01(v);return u*u*u*(u*(u*6-15)+10);};
  if(t<coverStart)return mix(-1,0,ease(t/coverStart));
  if(t<=coverEnd)return 0;
  return ease((t-coverEnd)/(1-coverEnd));
}
export const covered=(p:number)=>[0,1].some(i=>{const t=wipeProgress(p,i);return t>=coverStart&&t<=coverEnd;});
export const stable=(p:number)=>p<.22||(p>.49&&p<.54)||p>.82;
// Copy stays still while the foreground Memphis shape conceals the swap.
export function textOpacity(p:number,index:number,reduced:boolean){
  // The live heading stays fully opaque; only the solid mesh conceals it.
  // Reduced-motion static nodes select the same chapter without a crossfade.
  return reduced?(index===activeChapter(p)?1:0):1;
}
export function copyStack(p:number,reduced:boolean):0|2{
  // Retained for older consumers; opaque copy always stays on its own layer.
  const invisible=textOpacity(p,0,reduced)===0&&textOpacity(p,1,reduced)===0&&textOpacity(p,2,reduced)===0;
  return !reduced&&covered(p)&&invisible?0:2;
}
