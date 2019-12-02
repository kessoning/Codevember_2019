import * as THREE from '../../node_modules/three/build/three.module.js';

// orbit control, for easy camera control
import {
    OrbitControls
} from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';

// import post effect
import {
    PostProcessing
} from './modules/PostProcessing.js';
let post_processing;

import {
    Firemap
} from './modules/Firemap.js';
const firemap = new Firemap();

var scene, camera, renderer, orbit;

function init() {

    setTimeout(function () {
        document.getElementById('title').classList.add('intro');

        setTimeout(function () {
            document.getElementById('synopsis').classList.add('intro');

            setTimeout(function () {
                document.getElementById('codevember').classList.add('intro');
            }, 250);

        }, 250);

    }, 250);

    setTimeout(function () {

        document.getElementById('title').classList.add('outro');

        setTimeout(function () {
            document.getElementById('synopsis').classList.add('outro');

            setTimeout(function () {
                document.getElementById('codevember').classList.add('outro');

                setTimeout(function() {

                    document.getElementsByClassName('description')[0].remove();

                }, 1000);
                
            }, 250);

        }, 250);

    }, 8000);

    scene = new THREE.Scene();

    const loader = new THREE.CubeTextureLoader();

    const bgtexture = loader.load([
        './assets/cubemap/px.png',
        './assets/cubemap/nx.png',
        './assets/cubemap/py.png',
        './assets/cubemap/ny.png',
        './assets/cubemap/pz.png',
        './assets/cubemap/nz.png',
    ]);

    scene.background = bgtexture;

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10000000);
    camera.position.z = -3000;
    camera.position.y = 246;

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: false,
        alpha: true
    });
    renderer.setPixelRatio(1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x191919, 1.0);
    document.body.appendChild(renderer.domElement);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    var res = new THREE.Vector2(window.innerWidth, window.innerHeight);
    post_processing = new PostProcessing(res.x, res.y, renderer, scene, camera);

    orbit = new OrbitControls(camera, renderer.domElement);
    orbit.autoRotate = true;
    orbit.autoRotateSpeed = 1.0;
    orbit.enablePan = true;
    orbit.maxPolarAngle = 1.80;
    orbit.minPolarAngle = 1.00;
    orbit.update();

    animate();

    scene.add(firemap.mesh);

}

function update() {

    orbit.update();

};

function animate() {

    requestAnimationFrame(animate);

    update();

    render();

    post_processing.runShader();

};

function render() {

    renderer.render(scene, camera);

};

window.onload = init;