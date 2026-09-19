"use client";
import dynamic from "next/dynamic";
import {Component,useCallback,useEffect,useState,type ReactNode,type RefObject} from "react";
import type {MotionValue} from "framer-motion";
import styles from "./BrandProblemStory.module.css";
import StoryFallback from "./StoryFallback";
import {stable} from "./story-timeline";
import type {CopyBounds} from "./story-motion";
const Scene=dynamic(()=>import("./StoryScene"),{ssr:false});
class SceneBoundary extends Component<{children:ReactNode;onFailure:()=>void},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  componentDidCatch(){this.props.onFailure();}
  render(){return this.state.failed?null:this.props.children;}
}
type Connection=EventTarget&{saveData?:boolean;effectiveType?:string};
export default function StoryVisual({progress,still,bounds,onFrame,onPresentation}:{progress:MotionValue<number>;still:boolean;bounds:RefObject<CopyBounds>;onFrame:(p:number)=>void;onPresentation:(physical:boolean)=>void}) {
  const [host,setHost]=useState<HTMLDivElement|null>(null);
  const [near,setNear]=useState(false),[active,setActive]=useState(false);
  const [compact,setCompact]=useState(true),[allowed,setAllowed]=useState(false);
  const [ready,setReady]=useState(false),[failed,setFailed]=useState(false);
  const [promoted,setPromoted]=useState(false);
  const [supported,setSupported]=useState(false);
  const onReady=useCallback(()=>setReady(true),[]);
  const onFailure=useCallback(()=>{setFailed(true);setReady(false);setPromoted(false);},[]);
  useEffect(()=>{
    if(!host)return;
    const media=matchMedia('(max-width:760px)');
    const resize=()=>setCompact(media.matches);resize();media.addEventListener('change',resize);
    const connection=(navigator as Navigator&{connection?:Connection}).connection;
    const network=()=>{
      const eligible=!connection?.saveData&&!['2g','slow-2g'].includes(connection?.effectiveType??'');
      setAllowed(eligible);
      if(!eligible){setReady(false);setPromoted(false);}
    };
    network();connection?.addEventListener('change',network);
    let visible=false;
    const visibility=()=>setActive(visible&&!document.hidden);
    const nearObserver=new IntersectionObserver(([entry])=>{if(entry.isIntersecting)setNear(true);},{rootMargin:'350px'});
    const activeObserver=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;visibility();});
    nearObserver.observe(host);activeObserver.observe(host);
    document.addEventListener('visibilitychange',visibility);
    return ()=>{nearObserver.disconnect();activeObserver.disconnect();media.removeEventListener('change',resize);connection?.removeEventListener('change',network);document.removeEventListener('visibilitychange',visibility);};
  },[host]);
  useEffect(()=>{
    if(!near||still||!allowed||supported||failed)return;
    // Probe only near the section, before R3F's asynchronous renderer setup.
    // This detached 1px context is immediately released, never a second scene.
    const timer=window.setTimeout(()=>{try {
      const probe=document.createElement('canvas');
      probe.width=probe.height=1;
      const context=probe.getContext('webgl2',{powerPreference:'low-power'});
      if(!context){onFailure();return;}
      context.getExtension('WEBGL_lose_context')?.loseContext();
      setSupported(true);
    }catch{onFailure();}},0);
    return()=>window.clearTimeout(timer);
  },[near,still,allowed,supported,failed,onFailure]);
  useEffect(()=>{
    if(!ready||promoted||still||!allowed||failed)return;
    let timer:ReturnType<typeof setTimeout>;
    const schedule=()=>{
      clearTimeout(timer);
      if(stable(progress.get()))timer=setTimeout(()=>{
        if(stable(progress.get())&&Math.abs(progress.getVelocity())<.15)setPromoted(true);
      },220);
    };
    schedule();const unsubscribe=progress.on('change',schedule);
    return ()=>{clearTimeout(timer);unsubscribe();};
  },[ready,promoted,still,allowed,failed,progress]);
  const show3D=promoted&&ready&&!still&&allowed&&!failed;
  useEffect(()=>{onPresentation(show3D);return()=>onPresentation(false);},[show3D,onPresentation]);
  return <div ref={setHost} className={styles.visual} aria-hidden="true" data-scene={show3D?'webgl':'fallback'}>
    <StoryFallback progress={progress} still={still} bounds={bounds} active={!show3D}/>
    {near&&supported&&!still&&allowed&&!failed&&<div className={styles.webgl}><SceneBoundary onFailure={onFailure}><Scene progress={progress} compact={compact} active={active} onReady={onReady} onFailure={onFailure} bounds={bounds} presented={show3D} onFrame={onFrame}/></SceneBoundary></div>}
  </div>;
}
