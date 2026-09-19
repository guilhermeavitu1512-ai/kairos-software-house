import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import {pathToFileURL} from 'node:url';
import {PerspectiveCamera,Mesh,TorusGeometry,CapsuleGeometry,MeshBasicMaterial,Raycaster,Vector2} from 'three';
const code=ts.transpileModule(fs.readFileSync('components/kairos/story-motion.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText.replace('"./story-timeline"',JSON.stringify(pathToFileURL(`${process.cwd()}/components/kairos/story-timeline.ts`).href));
const {foregroundPose,rain,rainPose,mobileIndices}=await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
export {foregroundPose};
const {wipeStart,wipeEnd,textOpacity}=await import('../components/kairos/story-timeline.ts');
assert.equal(rain.length+2,16);assert.equal(mobileIndices.length+2,7);
for(let i=0;i<rain.length;i++)assert.ok(rainPose(i,.6,1.6,false).y<rainPose(i,.2,1.6,false).y);
for(const aspect of [1.6,2.13,.433]){
 const camera=new PerspectiveCamera(40,aspect,.02,80);camera.position.z=8;camera.updateMatrixWorld();
 for(let i=0;i<2;i++){
  const geometry=i===0?new TorusGeometry(.85,.42,28,96,Math.PI*1.7):new CapsuleGeometry(.5,1.7,18,40);
  const mesh=new Mesh(geometry,new MeshBasicMaterial()),ray=new Raycaster(),samples=[];
  const initial=foregroundPose(wipeStart[i],i,aspect,aspect<1);
  for(const local of [0,.2,.3,.4,.5,.6,.65,.7,.75,.78,.8,.84,.875,.9,.94,.98,1]){
   const p=wipeStart[i]+(wipeEnd[i]-wipeStart[i])*local,pose=foregroundPose(p,i,aspect,aspect<1);
   if(local>=.5)assert.ok(pose.z>initial.z,'Depth creates perspective growth');
   assert.equal(pose.s,initial.s,'Wipe scale remains fixed');
   assert.equal(pose.ry,initial.ry);assert.equal(pose.rz,initial.rz);
   mesh.position.set(pose.x,pose.y,pose.z);mesh.rotation.set(0,pose.ry,pose.rz);mesh.scale.setScalar(pose.s);mesh.updateMatrixWorld();
   let hits=0;
   for(let x=0;x<30;x++)for(let y=0;y<20;y++){ray.setFromCamera(new Vector2((x+.5)/15-1,(y+.5)/10-1),camera);if(ray.intersectObject(mesh).length)hits++;}
   const coverage=hits/600;samples.push([local,Number(coverage.toFixed(3))]);
   if(local===0)assert.ok(hits>0,'Wipe already exists in the rain');
   if(local===1)assert.equal(hits,0,'Wipe finishes beyond the frame');
   if(local>=.88&&local<=.94){
    assert.ok(hits<600,'Wipe leaves part of the viewport visible');
    const halfX=Math.min(.99,(Math.min(900,aspect*900-96)+96)/(aspect*900));
    const halfY=aspect<1?.24:.3;
    for(let x=0;x<=30;x++)for(let y=0;y<=10;y++){
     ray.setFromCamera(new Vector2((x/15-1)*halfX,(y/5-1)*halfY),camera);
     assert.ok(ray.intersectObject(mesh).length>0,JSON.stringify({i,aspect,local,x,y,reason:'Text plus margin must be physically covered'}));
    }
   }
   if(local===.9)assert.ok([0,1,2].every(index=>textOpacity(p,index,false)<.0001));
  }
  console.log(JSON.stringify({aspect,wipe:i,samples}));geometry.dispose();mesh.material.dispose();
 }
}
