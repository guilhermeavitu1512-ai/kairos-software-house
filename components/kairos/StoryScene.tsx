"use client";
import {Canvas,useFrame,useThree} from "@react-three/fiber";
import {useCallback,useEffect,useMemo,useRef,useState,type RefObject} from "react";
import type {MotionValue} from "framer-motion";
import {TorusGeometry,CylinderGeometry,CapsuleGeometry,ExtrudeGeometry,Shape,MeshStandardMaterial,type Group} from "three";
import {rain,mobileIndices,rainPose,foregroundPose,cameraZ,type CopyBounds} from "./story-motion";
import {useOpeningProgress} from "./OpeningTransition";
import {memphisArrival} from "./hero-story-motion";
type Props={progress:MotionValue<number>;compact:boolean;active:boolean;onReady:()=>void;onFailure:()=>void;bounds:RefObject<CopyBounds>;presented:boolean;onFrame:(p:number)=>void};
function Composition({progress,compact,active,onReady,onFailure,onSlow,low,bounds,presented,onFrame}:Props&{onSlow:()=>void;low:boolean}){
 const pieces=useRef<Group>(null),wipes=useRef<Group>(null);
 const ready=useRef(false),slow=useRef({samples:0,total:0,sent:false});
 const {invalidate,gl}=useThree();
 const arrivalProgress=useOpeningProgress();
 useEffect(()=>bounds.current.registerInvalidate?.(invalidate),[bounds,invalidate]);
 const resources=useMemo(()=>{
  const segments=low?24:48;
  const block=new Shape().moveTo(-.5,-.4).lineTo(.2,-.4).quadraticCurveTo(.6,-.4,.6,0).lineTo(.6,.3).quadraticCurveTo(.6,.6,.2,.6).lineTo(-.3,.4).quadraticCurveTo(-.6,.3,-.5,-.4);
  const cut=new Shape().moveTo(-.5,-.4).lineTo(.5,-.4).lineTo(.5,.1).quadraticCurveTo(.1,.1,.1,.5).lineTo(-.5,.5).closePath();
  const extrude={depth:.24,bevelEnabled:true,bevelThickness:.07,bevelSize:.07,bevelSegments:low?2:4,curveSegments:low?8:16,steps:1};
  return {geometry:{
   arc:new TorusGeometry(.48,.14,low?8:12,segments,Math.PI*1.35),
   ring:new TorusGeometry(.38,.1,low?8:12,segments),
   disc:new CylinderGeometry(.4,.4,.13,segments).rotateX(Math.PI/2),
   capsule:new CapsuleGeometry(.14,.7,low?4:6,low?10:16),
   block:new ExtrudeGeometry(block,extrude),
   cut:new ExtrudeGeometry(cut,extrude),
   foregroundArc:new TorusGeometry(.85,.42,low?16:28,low?64:96,Math.PI*1.7),
   foregroundCapsule:new CapsuleGeometry(.5,1.7,low?10:18,low?24:40)
  },materials:[
   new MeshStandardMaterial({color:"#253d55",roughness:.62,metalness:.12}),
   new MeshStandardMaterial({color:"#71879d",roughness:.45,metalness:.25}),
   new MeshStandardMaterial({color:"#275777",roughness:.5,metalness:.22}),
   new MeshStandardMaterial({color:"#24567b",roughness:.64,metalness:.12}),
   new MeshStandardMaterial({color:"#39566d",roughness:.68,metalness:.12})
  ]};
 },[low]);
 useEffect(()=>()=>{Object.values(resources.geometry).forEach(g=>g.dispose());resources.materials.forEach(m=>m.dispose());},[resources]);
 useEffect(()=>{if(!active)return;invalidate();const stop=progress.on("change",()=>invalidate()),stopArrival=arrivalProgress.on("change",()=>invalidate());return()=>{stop();stopArrival();};},[active,progress,arrivalProgress,invalidate,presented]);
 useEffect(()=>{const canvas=gl.domElement;const lost=(event:Event)=>{event.preventDefault();onFailure();};canvas.addEventListener("webglcontextlost",lost);return()=>canvas.removeEventListener("webglcontextlost",lost);},[gl,onFailure]);
 const indices=compact?mobileIndices:rain.map((_,i)=>i);
 // Independent entry opacity; never mutate the shared base materials.
 const entryMaterials=useMemo(()=>resources.materials.slice(3).map(base=>{const material=base.clone();material.transparent=true;return material;}),[resources]);
 const rainMaterials=useMemo(()=>rain.map(piece=>{const material=resources.materials[piece.mat].clone();material.transparent=true;return material;}),[resources]);
 useEffect(()=>()=>{entryMaterials.forEach(material=>material.dispose());rainMaterials.forEach(material=>material.dispose());},[entryMaterials,rainMaterials]);
 useFrame(({size,scene,camera},delta)=>{
  const p=progress.get(),aspect=size.width/size.height;
  pieces.current?.children.forEach((piece,i)=>{
   const pose=rainPose(indices[i],p,aspect,compact,bounds.current);
   const entry=memphisArrival(indices[i],arrivalProgress.get(),compact);
   piece.position.set(pose.x,pose.y+entry.y,pose.z-entry.z);piece.rotation.set(pose.rx,pose.ry,pose.rz);piece.scale.setScalar(pose.s);
   rainMaterials[indices[i]].opacity=entry.gain;
  });
  wipes.current?.children.forEach((wipe,i)=>{
   const pose=foregroundPose(p,i,aspect,compact);
   const entry=memphisArrival(i,arrivalProgress.get(),compact,true);
   wipe.position.set(pose.x,pose.y+entry.y,pose.z-entry.z);wipe.rotation.set(0,pose.ry,pose.rz);wipe.scale.setScalar(pose.s);
   entryMaterials[i].opacity=entry.gain;
  });
  if(active&&!slow.current.sent&&Math.abs(progress.getVelocity())>.05&&delta>0&&delta<.12){
   slow.current.total+=delta;slow.current.samples++;
   if(slow.current.samples===30){if(slow.current.total/30>.038){slow.current.sent=true;onSlow();}else{slow.current.samples=0;slow.current.total=0;}}
  }
  // The only render clock: geometry is drawn before the HTML chapter changes.
  // No time-based callback can complete a wipe after the user stops scrolling.
  try { gl.render(scene,camera); } catch { onFailure(); return; }
  if(presented)onFrame(p);
  if(!ready.current){ready.current=true;onReady();}
 },1);
 return <>
  <ambientLight intensity={.8}/><directionalLight position={[-3,5,8]} intensity={2.8} color="#dae6f0"/><directionalLight position={[5,-2,3]} intensity={.75} color="#5b83a5"/>
  <group ref={pieces} dispose={null}>{indices.map(i=><mesh key={i} geometry={resources.geometry[rain[i].kind]} material={rainMaterials[i]}/>)}</group>
  <group ref={wipes} dispose={null}>
   <mesh geometry={resources.geometry.foregroundArc} material={entryMaterials[0]}/>
   <mesh geometry={resources.geometry.foregroundCapsule} material={entryMaterials[1]}/>
  </group>
 </>;
}
export default function StoryScene(props:Props){
 const [degraded,setDegraded]=useState(false);
 const onSlow=useCallback(()=>setDegraded(true),[]);
 const low=props.compact||degraded;
 return <Canvas camera={{position:[0,0,cameraZ],fov:40,near:.02,far:80}} dpr={low?1:[1,1.5]} frameloop={props.active?"demand":"never"} gl={{alpha:true,antialias:!low,powerPreference:"low-power"}}><Composition {...props} low={low} onSlow={onSlow}/></Canvas>;
}
