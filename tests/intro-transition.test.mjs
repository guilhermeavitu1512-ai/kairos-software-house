import assert from 'node:assert/strict';
import { startIntroTransition } from '../components/kairos/intro-transition.ts';
const originalSet=globalThis.setTimeout, originalClear=globalThis.clearTimeout;
let now=0, sequence=0;
const timers=new Map();
globalThis.setTimeout=(fn,ms)=>{const id=++sequence; timers.set(id,{fn,at:now+ms}); return id;};
globalThis.clearTimeout=id=>timers.delete(id);
const advance=ms=>{const end=now+ms; for(;;){const next=[...timers].sort((a,b)=>a[1].at-b[1].at)[0]; if(!next||next[1].at>end)break; now=next[1].at;timers.delete(next[0]);next[1].fn();}now=end;};
try {
  for(const mode of ['complete','throw','reject','missing']) {
    let released=0, faded=0;
    startIntroTransition({play:()=>{if(mode==='throw')throw Error('forced'); return {stop(){},then(ok,fail){if(mode==='complete')ok();if(mode==='reject')fail();}};},fade:()=>faded++,release:()=>released++});
    if(mode==='missing'){advance(1499);assert.equal(released,0);advance(1);assert.equal(faded,1);}
    advance(350);
    assert.equal(released,1,mode);
    assert.equal(timers.size,0);
  }
  let released=0;
  const cancel=startIntroTransition({play:()=>({then(){},stop(){}}),fade(){},release:()=>released++});
  cancel();advance(3000);assert.equal(released,0);assert.equal(timers.size,0);
  console.log('Intro completion, forced error, rejection, missing callback, watchdog and cleanup: OK');
} finally {globalThis.setTimeout=originalSet;globalThis.clearTimeout=originalClear;}
