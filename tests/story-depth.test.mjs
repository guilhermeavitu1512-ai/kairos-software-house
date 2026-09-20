import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import {pathToFileURL} from 'node:url';
import {PerspectiveCamera,Mesh,Group,TorusGeometry,CapsuleGeometry,MeshBasicMaterial,Raycaster,Vector2} from 'three';
const code=ts.transpileModule(fs.readFileSync('components/kairos/story-motion.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText.replace('"./story-timeline"',JSON.stringify(pathToFileURL(`${process.cwd()}/components/kairos/story-timeline.ts`).href));
const {foregroundPose}=await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const {wipeStart,wipeEnd,activeChapter,textOpacity}=await import('../components/kairos/story-timeline.ts');
for(const aspect of [1.6,2.13,3.56,1,.433,.356]){
 const camera=new PerspectiveCamera(40,aspect,.02,80);camera.position.z=8;camera.updateMatrixWorld();
 for(let i=0;i<2;i++){
  const geometry=i===0?new TorusGeometry(.85,.42,28,96,Math.PI*1.7):new CapsuleGeometry(.5,1.7,18,40);
  const mesh=new Mesh(geometry,new MeshBasicMaterial()),group=new Group(),ray=new Raycaster();
  group.add(mesh);
  const at=t=>wipeStart[i]+(wipeEnd[i]-wipeStart[i])*t;
  const initial=foregroundPose(at(0),i,aspect,aspect<1);
  for(const local of [0,.2,.44,.49,.5,.51,.56,.8,1]){
   const p=at(local),pose=foregroundPose(p,i,aspect,aspect<1);
   assert.equal(pose.s,initial.s,'No scale-driven zoom');
   assert.deepEqual(pose,foregroundPose(p,i,aspect,aspect<1),'Seek is deterministic');
   assert.equal(pose.z,initial.z,'No perspective zoom');
   assert.equal(pose.ry,initial.ry);assert.equal(pose.rz,initial.rz);
   group.position.set(pose.x,pose.y,pose.z);mesh.rotation.set(0,pose.ry,pose.rz);group.scale.set(pose.s*pose.stretch,pose.s,pose.s);group.updateMatrixWorld();
   if(local>=.44&&local<=.56){
    const halfX=.999,halfY=.999;
    for(let x=0;x<=30;x++)for(let y=0;y<=10;y++){
     ray.setFromCamera(new Vector2((x/15-1)*halfX,(y/5-1)*halfY),camera);
     assert.ok(ray.intersectObject(mesh).length,JSON.stringify({i,aspect,local,x,y,reason:'Full viewport coverage during the copy change'}));
    }
    assert.equal(textOpacity(p,activeChapter(p),false),1,'Text is physically covered, never faded');
   }
   if(local===0||local===1){
    for(let x=0;x<=10;x++)for(let y=0;y<=10;y++){
     ray.setFromCamera(new Vector2(x/5-1,y/5-1),camera);
     assert.equal(ray.intersectObject(mesh).length,0,'Wipe fully outside the viewport between chapters');
    }
   }
  }
  assert.equal(activeChapter(at(.499)),i);assert.equal(activeChapter(at(.501)),i+1);
  geometry.dispose();mesh.material.dispose();
 }
}
console.log('Translating wipes: fixed depth/scale, reversible poses, solid coverage and opaque text passed.');
