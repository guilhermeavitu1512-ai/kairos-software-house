import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const code=ts.transpileModule(fs.readFileSync('components/kairos/hero-story-motion.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {handoffState,memphisArrival}=await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
assert.equal(handoffState(0).heading,1);assert.equal(handoffState(0).scene,0);
assert.equal(handoffState(1).heading,0);assert.equal(handoffState(1).copy,1);
for(const compact of [false,true]){
 for(let i=0;i<16;i++){
  assert.deepEqual(memphisArrival(i,1,compact),{gain:1,z:0,y:0},'Original rain pose restored');
  assert.deepEqual(memphisArrival(i,1,compact,true),{gain:1,z:0,y:0},'Internal wipe pose untouched');
 }
 assert.ok(memphisArrival(0,.3,compact).gain>0);
 assert.equal(memphisArrival(1,.3,compact).gain,0);
 assert.equal(memphisArrival(0,.3,compact,true).gain,0);
}
for(let t=0;t<=1;t+=.001){
 const state=handoffState(t),next=handoffState(t+.001);
 assert.ok(state.heading+state.copy>.35);
 for(const key of Object.keys(state))assert.ok(Math.abs(state[key]-next[key])<.01,'Continuous envelope');
}
console.log('Handoff: continuous overlap, staggered arrival, unchanged final poses OK');
