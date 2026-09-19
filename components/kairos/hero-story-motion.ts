// Handoff only. The story's progress, rain trajectories and wipes are untouched.
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const ramp=(t:number,a:number,b:number)=>{const p=clamp((t-a)/(b-a));return p*p*(3-2*p);};
export function handoffState(t:number){
 return {
  heading:1-ramp(t,.4,.92),
  support:1-ramp(t,.36,.78),
  action:1-ramp(t,.3,.7),
  architecture:1-ramp(t,.55,1),
  departure:ramp(t,.3,1),
  scene:ramp(t,.18,.82),
  copy:ramp(t,.58,.92),
 };
}
export function memphisArrival(index:number,t:number,compact:boolean,wipe=false){
 const early=index===0||index===10;
 const start=wipe?.58:early?.18:.36+(index%3)*.06;
 const end=wipe?1:early?.52:.82+(index%3)*.06;
 const gain=ramp(t,start,end);
 return {gain,z:(1-gain)*(wipe?5:early?3:4),y:(1-gain)*(compact?.35:.7)};
}
