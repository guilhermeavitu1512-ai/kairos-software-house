import assert from 'node:assert/strict';
import {wipeStart,wipeEnd,wipeProgress,wipeTravel,activeChapter,textOpacity,covered,stable,coverStart,coverEnd} from '../components/kairos/story-timeline.ts';
for(let step=0;step<=1000;step++){
 const p=step/1000;
 assert.deepEqual([0,1,2].map(i=>textOpacity(p,i,false)),[1,1,1]);
 assert.equal([0,1,2].reduce((sum,i)=>sum+textOpacity(p,i,true),0),1);
 assert.ok(Math.abs(wipeTravel(p)+wipeTravel(1-p))<1e-12,'Balanced entrance and departure');
 if(step)assert.ok(wipeTravel(p)>=wipeTravel(p-.001),'No bounce');
}
for(let i=0;i<2;i++){
 const at=t=>wipeStart[i]+(wipeEnd[i]-wipeStart[i])*t;
 assert.ok(Math.abs(wipeProgress(at(.5),i)-.5)<1e-9);
 assert.equal(activeChapter(at(.499)),i);
 assert.equal(activeChapter(at(.501)),i+1);
 for(const local of [coverStart+.001,.5,coverEnd-.001]){
  assert.ok(covered(at(local)));
  assert.equal(wipeTravel(local),0,'Hold coverage while copy changes');
 }
 assert.equal(wipeTravel(0),-1);
 assert.equal(wipeTravel(1),1);
 for(const boundary of [0,coverStart,coverEnd,1]){
  assert.ok(Math.abs(wipeTravel(boundary+.001)-wipeTravel(boundary-.001))<.000001,'Gentle starts and stops');
 }
}
for(const [p,index]of [[0,0],[.52,1],[1,2]]){
 assert.ok(stable(p));assert.equal(activeChapter(p),index);
}
console.log('Balanced wipes, concealed copy changes, reverse scroll and reduced motion passed.');
