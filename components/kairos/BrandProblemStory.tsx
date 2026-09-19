"use client";
import { m, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import useReducedMotionPreference from "./useReducedMotionPreference";
import styles from "./BrandProblemStory.module.css";
import StoryVisual from "./StoryVisual";
import { activeChapter, textOpacity } from "./story-timeline";
import type { CopyBounds } from "./story-motion";

const chapters = ["Organize o que hoje está espalhado.","Automatize o que se repete.","Construa apenas o que faz sentido."];
const subscribe = () => () => {};
const client = () => true;
const server = () => false;
function Chapter({ index, progress, reduced }: { index:number; progress:MotionValue<number>; reduced:boolean }) {
  const opacity=useTransform(progress,p=>textOpacity(p,index,reduced));
  return <m.div className={styles.chapter} style={{opacity}}><h2>{chapters[index]}</h2></m.div>;
}
export default function BrandProblemStory() {
  const ref=useRef<HTMLElement>(null);
  const heading=useRef<HTMLHeadingElement>(null);
  const invalidateRef=useRef<(()=>void)|undefined>(undefined);
  const bounds=useRef<CopyBounds>({halfWidth:.4,halfHeight:.12,marginX:.04,marginY:.06,registerInvalidate:(render)=>{
    invalidateRef.current=render;
    return()=>{if(invalidateRef.current===render)invalidateRef.current=undefined;};
  }});
  const presented=useRef(false);
  const reduced=useReducedMotionPreference();
  const enhanced=useSyncExternalStore(subscribe,client,server);
  const {scrollYProgress}=useScroll({target:ref,offset:["start start","end end"]});
  const progress=scrollYProgress;
  const paintCopy=useCallback((p:number)=>{
    const title=heading.current;
    if(!title)return;
    const index=activeChapter(p);
    // A single stable heading. No entering/exiting copies, reparenting, or
    // React state per frame. WebGL commits after drawing the matching frame.
    if(title.textContent!==chapters[index])title.textContent=chapters[index];
    const opacity=String(textOpacity(p,index,false));
    if(title.parentElement!.style.opacity!==opacity)title.parentElement!.style.opacity=opacity;
    if(title.dataset.chapter!==String(index))title.dataset.chapter=String(index);
  },[]);
  const onFrame=useCallback((p:number)=>paintCopy(p),[paintCopy]);
  const onPresentation=useCallback((physical:boolean)=>{
    presented.current=physical;
    if(!physical)paintCopy(progress.get());
  },[paintCopy,progress]);
  useEffect(()=>{
    const update=(p:number)=>{if(!presented.current)paintCopy(p);};
    update(progress.get());return progress.on('change',update);
  },[paintCopy,progress,enhanced,reduced]);
  useEffect(()=>{
    const title=heading.current,stage=title?.parentElement;
    if(!title||!stage)return;
    const measure=()=>{
      const margin=matchMedia('(max-width:760px)').matches?24:48;
      const width=stage.clientWidth,height=stage.clientHeight;
      if(width&&height){
        const range=document.createRange();
        range.selectNodeContents(title);
        const ink=range.getBoundingClientRect();
        bounds.current={...bounds.current,halfWidth:ink.width/width/2,halfHeight:ink.height/height/2,marginX:margin/width,marginY:margin/height};
        invalidateRef.current?.();
      }
    };
    const observer=new ResizeObserver(measure);observer.observe(title);observer.observe(stage);
    const copyObserver=new MutationObserver(measure);copyObserver.observe(title,{childList:true,characterData:true,subtree:true});measure();
    return()=>{observer.disconnect();copyObserver.disconnect();};
  },[enhanced,reduced]);
  return <section ref={ref} id="sobre" className={styles.story} data-enhanced={enhanced} aria-label="Organizar, automatizar e construir com a KAIROS">
    <div className={styles.sticky}>
      <StoryVisual key={reduced?'reduced':'motion'} progress={progress} still={reduced} bounds={bounds} onFrame={onFrame} onPresentation={onPresentation}/>
      <div className={styles.texts}>
        {enhanced&&!reduced?<div className={styles.chapter} data-live-copy><h2 ref={heading}>{chapters[0]}</h2></div>:chapters.map((_,index)=><Chapter key={index} index={index} progress={progress} reduced={reduced} />)}
      </div>
    </div>
  </section>;
}
