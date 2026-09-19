import assert from 'node:assert/strict';
import {wipeStart,wipeEnd,wipeProgress,textOpacity,covered,stable,copyStack} from '../components/kairos/story-timeline.ts';

for(let step=0;step<=1000;step++){
 const p=step/1000;
 for(const reduced of [false,true]){
  const values=[0,1,2].map(i=>textOpacity(p,i,reduced));
  assert.ok(values.every(v=>v>=0&&v<=1));
  if(reduced)assert.ok(Math.abs(values.reduce((a,b)=>a+b,0)-1)<1e-9);
  if(!reduced)assert.ok(values.every(v=>v===1));
  if(copyStack(p,reduced)===0)assert.ok(values.every(v=>v===0));
 }
}
for(let i=0;i<2;i++){
 const at=t=>wipeStart[i]+(wipeEnd[i]-wipeStart[i])*t;
 assert.ok(Math.abs(wipeProgress(at(.5),i)-.5)<1e-9);
 assert.equal(textOpacity(at(.49),i,false),1);
 assert.equal(textOpacity(at(.715),i,false),1);
 let previous=1;
 for(let step=0;step<=330;step++){
  const opacity=textOpacity(at(.55+step/1000),i,false);
  assert.ok(opacity<=previous+1e-9);
  assert.ok(previous-opacity<.006,'No narrow threshold-like opacity drop');
  previous=opacity;
 }
 // Both sides of either discrete layer switch are already transparent.
 for(const local of [.88,.9,.91,.94]){
  assert.ok([0,1,2].every(index=>textOpacity(at(local),index,false)===1));
 }
 assert.ok(covered(at(.91)));
 assert.equal(textOpacity(at(.91),i+1,false),1);
 assert.ok(textOpacity(at(.95),i+1,false)>0);
 for(let step=0;step<=100;step++){
  const u=step/100;
  assert.equal(textOpacity(at(.55+.33*u),i,false)+textOpacity(at(.94+.06*u),i+1,false),2,'No copy fade in either direction');
 }
}
for(const [p,index]of [[0,0],[.5,1],[1,2]]){
 assert.ok(stable(p));assert.equal(textOpacity(p,index,false),1);
}
console.log('Shared timeline: text coverage, reverse-safe pure progress and reduced motion OK');
