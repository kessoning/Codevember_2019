// threejs
import * as THREE from '../../node_modules/three/build/three.module.js';
// orbit control, for easy camera control
import {
    OrbitControls
} from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';
// import post effect
import {
    PostProcessing
} from './modules/PostProcessing.js';

import {
    ParticleSystem
} from './modules/ParticleSystem.js';

const white_col = new THREE.Vector4(1.0, 1.0, 1.0, 1.0);
const white_particles = new ParticleSystem(128, white_col, 50000, 1.0);
const red_col = new THREE.Vector4(1.0, 0.2, 0.2, 0.5);
const red_particles = new ParticleSystem(512, red_col, 750, 1.0);

/* Usual Three.js stuff */
var scene, camera, renderer, orbit;

var postProcessing;

var frameCount = 0;

// make the canvas adaptable to the window screen
window.addEventListener('resize', function () {
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    postProcessing.resize(width, height);
});

window.onload = function () {
    init();
}

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
            }, 250);

        }, 250);

    }, 8000);

    scene = new THREE.Scene();

    scene.add(white_particles.ParticleSystem);
    scene.add(red_particles.ParticleSystem);

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
    renderer.setClearColor(0x000000, 1.0);
    document.body.appendChild(renderer.domElement);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    var res = new THREE.Vector2(window.innerWidth, window.innerHeight);
    postProcessing = new PostProcessing(res.x, res.y, renderer, scene, camera);

    orbit = new OrbitControls(camera, renderer.domElement);
    orbit.autoRotate = true;
    orbit.autoRotateSpeed = 1.0;
    orbit.enablePan = true;
    orbit.maxPolarAngle = 1.40;
    orbit.minPolarAngle = 1.15;
    orbit.update();

    animate();

}

function update() {

    orbit.update();

    white_particles.update(window.innerWidth, window.innerHeight, frameCount);
    red_particles.update(window.innerWidth, window.innerHeight, frameCount);

    frameCount++;

};

function animate() {

    requestAnimationFrame(animate);

    update();

    render();

    postProcessing.runShader();

};

function render() {

    renderer.render(scene, camera);

};

// Performance test
// javascript: (function () {
//     var script = document.createElement('script');
//     script.onload = function () {
//         var stats = new Stats();
//         document.body.appendChild(stats.dom);
//         requestAnimationFrame(function loop() {
//             stats.update();
//             requestAnimationFrame(loop)
//         });
//     };
//     script.src = '//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';
//     document.head.appendChild(script);
// })()