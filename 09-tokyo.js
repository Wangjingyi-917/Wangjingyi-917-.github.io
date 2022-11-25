import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js'
let renderer, camera, scene, light;
let axesHelper;
let controls;
let mixer;
let clock = new THREE.Clock();

initRenderer();
initCamera();
initScene();


initAxesHelper();
initControls();
initEnv();
loadModel();




window.addEventListener('resize', function(){//渲染结果随着窗体的变化而变化（浏览器变窄了，渲染窗口也变窄）
    camera.aspect = window.innerWidth/this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, this.window.innerHeight);
})


/* ------------------场景三要素初始化------------------- */
function initRenderer() {
    renderer = new THREE.WebGL1Renderer();
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function initCamera(){
    camera = new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight, 1, 1000);
    camera.position.set(10,10,10);
    camera.lookAt(0,0,0);
}

function initScene(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbfe3dd);
}
/* ------------------场景三要素初始化------------------- */



function initAxesHelper(){
    axesHelper = new THREE.AxesHelper(1);
    scene.add(axesHelper);
}

function initControls(){
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0,0.5,0);
    controls.update();
    controls.enablePan = false;
    controls.enableDamping=true;
}

function initEnv(){
    const pmremGenerator = new THREE.PMREMGenerator( renderer );
    scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.001).texture;
}

function loadModel(){
    const loader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '/node_modules/three/examples/js/libs/draco/gltf/');

    loader.setDRACOLoader(dracoLoader);

    loader.load(
        'models/gltb/LittlestTokyo.glb',
        function(gltf){
            console.log(gltf);//显示模型信息
            const model = gltf.scene;
            scene.add( gltf.scene);

            model.scale.set(0.01,0.01,0.01);

            //animate
            mixer = new THREE.AnimationMixer(model);
            mixer.clipAction(gltf.animations[0]).play();
            animate();
        }
    );
}

function animate(){
    requestAnimationFrame( animate );
    const delta = clock.getDelta();
    mixer.update(delta);
    controls.update();
    renderer.render(scene,camera);
}
