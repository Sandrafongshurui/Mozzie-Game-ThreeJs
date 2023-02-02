import { useEffect } from 'react';

import * as THREE from 'three';
import * as dat from 'dat.gui';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
// import { VOXLoader } from 'three/examples/jsm/loaders/VOXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import SceneInit from './lib/SceneInit';
import { PopUp } from './PopUp';

function App() {
  useEffect(() => {
    const test = new SceneInit('myThreeJsCanvas');
    test.initialize();
    test.animate();

    // const boxGeometry = new THREE.BoxGeometry(8, 8, 8);
    // const boxMaterial = new THREE.MeshNormalMaterial();
    // const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    // test.scene.add(boxMesh);

    let loadedModel;
    const glftLoader = new GLTFLoader();
    const gui = new dat.GUI();
    glftLoader.load(
      "/downtown_dengue/Downtown_Dengue.gltf",
      (gltfScene) => {
        loadedModel = gltfScene;
        gltfScene.scene.traverse(function (child) {
          console.log(child)
          //if what you loading ia a mesh
          //change mateiral to transparant
          if (child.isMesh) {
            child.material.transparent = new THREE.MeshStandardMaterial();
            child.material.transparent = 0.5;
          }
        });
        gltfScene.scene.rotation.y = Math.PI / 8;
        gltfScene.scene.position.y = -30.7;
        gltfScene.scene.scale.set(1, 1, 1);

        gui.add(gltfScene.scene.position, 'x', -100, 100, 0.1);
        gui.add(gltfScene.scene.position, 'y', -100, 100, 0.1);
        gui.add(gltfScene.scene.position, 'z', -100, 100, 0.1);
        gui.add(gltfScene.scene.scale, 'x', -10, 10, 1);
        gui.add(gltfScene.scene.scale, 'y', -10, 10, 1);
        gui.add(gltfScene.scene.scale, 'z', -10, 10, 1);

        test.scene.add(gltfScene.scene);
      }
    );
    let drag = false
    const instersectObjs = {};
    let newMat = new THREE.MeshStandardMaterial();
    newMat.color.set(0xff0000);
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const onMouseMove = () => {
      drag = true;
    };
    const onMouseDown = () => {
      drag = false;
    };

    const onMouseClick = (event) => {
      // calculate pointer position in normalized device coordinates
      // (-1 to +1) for both components
      if(!drag){
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        //0,0 1,1 at top right corner, pointer is the viewport demensions
        //event is the mouse posistion base on the window demensions
        // console.log('pointer', pointer.x, pointer.y);
        // console.log('event', event.clientX, event.clientY);
        // console.log('window', window.innerWidth, window.innerHeight);
        raycaster.setFromCamera(pointer, test.camera);
        const intersects = raycaster.intersectObjects(test.scene.children);
        
        // change color of the closest object intersecting the raycaster
        if (intersects.length > 0) {
          //cehck the color
          console.log('click');
          //open the pop up
          isOpen = true
          if (instersectObjs[intersects[0].object.name] !== undefined) {
            if(instersectObjs[intersects[0].object.name].isClick){
              console.log("activate original")
              intersects[0].object.material = instersectObjs[intersects[0].object.name].originalMat;
              instersectObjs[intersects[0].object.name].isClick = false
            }else{
              console.log("activate red")
              intersects[0].object.material = newMat;
              instersectObjs[intersects[0].object.name].isClick = true
            }
          }else{     
            // originalMat = intersects[0].object.material;
            instersectObjs[intersects[0].object.name] = {isClick: true, originalMat: intersects[0].object.material}
            intersects[0].object.material = newMat;
          }
        } 
      }
     
    };

    const animate = () => {
      if (loadedModel) {
        loadedModel.scene.rotation.x += 0.01;
        loadedModel.scene.rotation.y += 0.01;
        loadedModel.scene.rotation.z += 0.01;
      }
      requestAnimationFrame(animate);
    };
    //animate();
    window.addEventListener('mousedown', onMouseDown);
    // window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onMouseClick);
  }, []);
  let isOpen = false
  return (
    <div>
      <canvas id="myThreeJsCanvas" />
      <div>{isOpen?"hello": "bye"}</div>
    </div>
  );
}

export default App;
