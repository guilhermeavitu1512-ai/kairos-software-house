import {mix,smooth,localProgress,wipeProgress,wipeTravel} from "./story-timeline";
export const cameraZ=8;
const tangent=Math.tan(Math.PI/9);
export type Kind="arc"|"ring"|"disc"|"capsule"|"block"|"cut";
export const rain=[
 {kind:"ring",x:-.38,y:.42,z:-4,s:.58,speed:.65,drift:.025,turn:.18,phase:.3,mat:0},
 {kind:"disc",x:.24,y:.61,z:-3.5,s:.6,speed:.36,drift:-.018,turn:.12,phase:1.2,mat:0},
 {kind:"cut",x:.4,y:-.18,z:-2.8,s:.55,speed:.38,drift:.024,turn:-.2,phase:2.2,mat:0},
 {kind:"arc",x:-.16,y:.79,z:-4.2,s:.65,speed:.46,drift:.02,turn:.16,phase:3.1,mat:0},
 {kind:"capsule",x:-.32,y:.28,z:-.7,s:.8,speed:.6,drift:.035,turn:-.35,phase:.8,mat:1},
 {kind:"block",x:.36,y:.37,z:0,s:.8,speed:.85,drift:-.045,turn:.45,phase:1.9,mat:2},
 {kind:"disc",x:.17,y:.83,z:-1,s:.86,speed:.72,drift:.035,turn:-.35,phase:2.6,mat:1},
 {kind:"ring",x:-.41,y:1.02,z:.3,s:.75,speed:.96,drift:.04,turn:.4,phase:3.5,mat:2},
 {kind:"cut",x:.41,y:.98,z:1,s:.78,speed:1.1,drift:-.025,turn:-.55,phase:4.2,mat:1},
 {kind:"block",x:-.05,y:-.34,z:.7,s:.64,speed:.84,drift:.025,turn:.3,phase:5,mat:2},
 {kind:"arc",x:.33,y:.18,z:-2.2,s:.64,speed:.45,drift:-.02,turn:.24,phase:1.6,mat:1},
 {kind:"ring",x:-.22,y:.67,z:-3.2,s:.65,speed:.4,drift:.02,turn:-.25,phase:2.8,mat:0},
 {kind:"disc",x:-.36,y:-.22,z:-1.8,s:.52,speed:.3,drift:.015,turn:.2,phase:4.5,mat:1},
 {kind:"cut",x:.29,y:.73,z:-.6,s:.58,speed:.42,drift:-.02,turn:-.3,phase:5.6,mat:2},
] as const;
export const mobileIndices=[0,4,6,8,10];
export type CopyBounds={halfWidth:number;halfHeight:number;marginX:number;marginY:number;registerInvalidate?:(render:()=>void)=>()=>void};
export function rainPose(index:number,p:number,aspect:number,compact:boolean,bounds?:CopyBounds){
 const item=rain[index],z=item.z+.35*p;
 const h=2*tangent*(cameraZ-z);
 const front=index===4||(!compact&&index===8);
 const s=item.s*(compact?.68:1);
 let nx=item.x+item.drift*Math.sin(item.phase+p*2);
 const ny=item.y-item.speed*p;
 if(bounds){
  // Work in viewport fractions. Bounds are measured on resize/text changes,
  // never in the render loop. Background silhouettes bypass the entire copy.
  const radius=.9*s/h;
  const influence=1-smooth(localProgress(Math.abs(ny),bounds.halfHeight,bounds.halfHeight+bounds.marginY+radius));
  const edge=front?bounds.halfWidth+radius/aspect*.9:bounds.halfWidth+bounds.marginX+radius/aspect;
  nx=mix(nx,Math.sign(item.x)*(front?edge:Math.max(Math.abs(nx),edge)),influence);
 }
 return {x:nx*h*aspect,y:ny*h,z,rx:item.phase*.3+item.turn*p*.3,ry:item.phase*.2+item.turn*p*.4,rz:item.phase+item.turn*p,s};
}
// Already-large foreground silhouettes translate across the viewport.
// Fixed depth, scale and rotation: no perspective growth at any wipe progress.
export function foregroundPose(p:number,index:number,aspect:number,compact:boolean){
 const t=wipeProgress(p,index),scale=compact?.72:1;
 // Fit the solid part over the entire viewport at the midpoint, including
 // portrait and ultrawide screens. Depth stays fixed throughout the wipe.
 const distance=(index===0?.68:.85)*scale;
 const stretch=Math.max(1,aspect);
 const ry=0,rz=index===0?(compact?Math.PI/2+.12:.12):compact?Math.PI/2-.1:-.2;
 const h=2*tangent*distance;
 const travel=h*aspect/2+2.5*scale*stretch;
 const direction=index===0?1:-1;
 let tx=-direction*travel*wipeTravel(t);
 let ty=0;
 const z=cameraZ-distance;
 if(index===0){
  // Track a point on the arc's left-hand tube, rather than aiming its empty hole.
  tx+=.85*scale*Math.cos(rz)*stretch;
  ty+=.85*scale*Math.sin(rz);
 }
 return {x:tx,y:ty,z,ry,rz,s:scale,stretch,t};
}
