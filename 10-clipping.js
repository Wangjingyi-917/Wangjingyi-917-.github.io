import * as THREE from 'three';
import { TorusKnotGeometry } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let renderer, camera, scene, light;
let ground, object;
let spotLight, dirLight;
let material;
let axesHelper;
let controls;

initRenderer();
initCamera();
initScene();

initMeshes();
initLight();
initAxesHelper();
initControls();

enableShadow();
enableClipping();

render();


window.addEventListener('resize', function () {//渲染结果随着窗体的变化而变化（浏览器变窄了，渲染窗口也变窄）
    camera.aspect = window.innerWidth / this.window.innerHeight;
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

function initCamera() {
    camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.set(0, 0, 4);
    camera.lookAt(0, 0, 0);
}

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x999999);
}
/* ------------------场景三要素初始化------------------- */

function initMeshes() {
    //ground
    ground = new THREE.Mesh(
        new THREE.PlaneGeometry(9, 9, 1, 1),
        new THREE.MeshPhongMaterial({
            color: 0xa0adaf, shininess: 150
        })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    scene.add(ground);

    //objects
    material = new THREE.MeshPhongMaterial({
        color: 0x80aa10,
        shininess: 100,
    });
    const geometry = new THREE.TorusKnotGeometry(0.4, 0.08, 95, 20);//大小，粗细
    object = new THREE.Mesh(geometry, material);
    scene.add(object);


}


function initLight() {
    /* ambient Light */
    scene.add(new THREE.AmbientLight(0x404040));

    /* spot Light */
    spotLight = new THREE.SpotLight(0xffffff);
    spotLight.name = 'Spot light';
    spotLight.angle = Math.PI / 5;
    spotLight.penumbra = 0.3;
    spotLight.position.set(2, 3, 3);
    scene.add(spotLight);

    /* dir Light */
    dirLight = new THREE.DirectionalLight(0x55505a, 1);
    dirLight.name = 'Dir light';
    dirLight.position.set(0, 3, 0);
    scene.add(dirLight);


}


function initAxesHelper() {
    axesHelper = new THREE.AxesHelper(1);
    scene.add(axesHelper);
}

function initControls() {
    controls = new OrbitControls(camera, renderer.domElement);
}

function enableShadow() {//影子
    renderer.shadowMap.enabled = true;

    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 3;
    spotLight.shadow.camera.far = 10;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    dirLight.castShadow = true;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 10;
    dirLight.shadow.camera.right = 1;
    dirLight.shadow.camera.left = -1;
    dirLight.shadow.camera.top = 1;
    dirLight.shadow.camera.bottom = -1;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;

    object.castShadow = true;
    ground.receiveShadow = true;
}

//切割
function enableClipping() {
    const plane = new THREE.Plane(new THREE.Vector3(1, 1, 0), 0.2);//这句定义切割平面，平面无穷大，向量的方向定义切的位置和保留谁；第二个参数是平面到原点的距离

    const plane1 = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0.2);//第二把刀

    const plane2 = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);//第三把刀

    //local clipping只切物体
    material.clippingPlanes = [plane];
    material.side = THREE.DoubleSide;//两边都渲染
    material.clipShadows = true;//切影子
    renderer.localClippingEnabled = true;

    //globalclipping
    // renderer.clippingPlanes = [plane, plane1];

}


function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
