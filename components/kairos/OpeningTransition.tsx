"use client";
import {createContext,useContext,type ReactNode} from "react";
import {useMotionValue,type MotionValue} from "framer-motion";

const TransitionContext=createContext<MotionValue<number>|null>(null);
export default function OpeningTransition({children}:{children:ReactNode}){
 // No text/scene handoff envelope: each section remains in document flow.
 const progress=useMotionValue(1);
 return <TransitionContext.Provider value={progress}>{children}</TransitionContext.Provider>;
}
export function useOpeningProgress(){
 const value=useContext(TransitionContext);
 const standalone=useMotionValue(1);
 return value??standalone;
}
