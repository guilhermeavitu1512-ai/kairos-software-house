"use client";
import {useEffect,useRef,type RefObject} from "react";
import type {MotionValue} from "framer-motion";
import {rain,mobileIndices,rainPose,foregroundPose,cameraZ,type CopyBounds} from "./story-motion";
import styles from "./BrandProblemStory.module.css";
import {useOpeningProgress} from "./OpeningTransition";
import {memphisArrival} from "./hero-story-motion";

const colors=["#253d55","#71879d","#275777"];
function Shape({kind}:{kind:string}) {
 if(kind==='arc')return <path d="M.48 0 A.48 .48 0 1 0 -.22 -.428" fill="none" stroke="currentColor" strokeWidth=".28" strokeLinecap="round"/>;
 if(kind==='ring')return <circle r=".38" fill="none" stroke="currentColor" strokeWidth=".2"/>;
 if(kind==='disc')return <circle r=".4"/>;
 if(kind==='capsule')return <rect x="-.14" y="-.49" width=".28" height=".98" rx=".14"/>;
 return <path d={kind==='cut'?"M-.5 -.4 H.5 V.1 Q.1 .1 .1 .5 H-.5 Z":"M-.5 -.4 H.2 Q.6 -.4 .6 0 V.3 Q.6 .6 .2 .6 L-.3 .4 Q-.6 .3 -.5 -.4"}/>;
}
// Finished vector edition of the same composition; no loading/status UI.
export default function StoryFallback({progress,still,bounds,active}:{progress:MotionValue<number>;still:boolean;bounds:RefObject<CopyBounds>;active:boolean}) {
 const root=useRef<SVGSVGElement>(null);
 const arrivalProgress=useOpeningProgress();
 useEffect(()=>{
  const svg=root.current;if(!svg)return;
  let width=1,height=1,compact=false,frame=0;
  const draw=()=>{
   frame=0;const aspect=width/height,p=still?0:progress.get();
   svg.setAttribute('viewBox',`${-500*aspect} -500 ${1000*aspect} 1000`);
   const project=(node:Element,pose:ReturnType<typeof foregroundPose>|ReturnType<typeof rainPose>,index:number,wipe=false)=>{
    const entry=memphisArrival(index,still?1:arrivalProgress.get(),compact,wipe);
    const distance=cameraZ-pose.z+entry.z;
    if(distance<=.02){node.setAttribute('visibility','hidden');return;}
    node.removeAttribute('visibility');
    const unit=1000/(2*Math.tan(Math.PI/9)*distance);
    node.setAttribute('opacity',String(entry.gain));
    node.setAttribute('transform',`translate(${pose.x*unit} ${-(pose.y+entry.y)*unit}) rotate(${-pose.rz*180/Math.PI}) scale(${pose.s*unit})`);
   };
   svg.querySelectorAll('[data-rain]').forEach((node,i)=>{
    if(compact&&!mobileIndices.includes(i)){node.setAttribute('visibility','hidden');return;}
    project(node,rainPose(i,p,aspect,compact,bounds.current),i);
   });
   svg.querySelectorAll('[data-vector-wipe]').forEach((node,i)=>project(node,foregroundPose(p,i,aspect,compact),i,true));
  };
  const schedule=()=>{if(active&&!frame)frame=requestAnimationFrame(draw);};
  const resize=new ResizeObserver(([entry])=>{width=entry.contentRect.width;height=entry.contentRect.height;compact=width<=760;schedule();});
  resize.observe(svg);const unsubscribe=progress.on('change',schedule),unsubscribeArrival=arrivalProgress.on('change',schedule);schedule();
  return()=>{resize.disconnect();unsubscribe();unsubscribeArrival();cancelAnimationFrame(frame);};
 },[progress,arrivalProgress,still,bounds,active]);
 return <div className={styles.fallback} data-story-fallback>
  <svg ref={root} className={styles.shapes} viewBox="-800 -500 1600 1000" aria-hidden="true">
   {rain.map((piece,i)=><g key={i} data-rain={i} color={colors[piece.mat]} fill="currentColor" transform={`translate(${piece.x*1600} ${-piece.y*1000}) scale(120)`}><Shape kind={piece.kind}/></g>)}
   {!still&&<>
    <g data-vector-wipe="0" transform="translate(-540 -350) scale(120)" fill="none" stroke="#24567b" strokeWidth=".84" strokeLinecap="round"><path d="M.85 0 A.85 .85 0 1 0 .5 .688"/></g>
    <g data-vector-wipe="1" transform="translate(540 -580) scale(120)" fill="#39566d"><rect x="-.5" y="-1.35" width="1" height="2.7" rx=".5"/></g>
   </>}
  </svg>
 </div>;
}
