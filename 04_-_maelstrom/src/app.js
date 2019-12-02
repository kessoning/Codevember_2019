import * as THREE from '../../node_modules/three/build/three.module.js';

import {
    OrbitControls
} from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';

import {
    ParticleSystem
} from './modules/ParticleSystem.js';
const particle_system = new ParticleSystem(500);

import {
    Background
} from './modules/Background.js';
const background = new Background();

var camera, scene, renderer, controls;

// Variables
var cameraz = 0;

function init() {

    setTimeout(function () {

        document.getElementById('title').classList.add('intro');

        setTimeout(function () {

            document.getElementById('codevember').classList.add('intro');

        }, 250);

    }, 250);

    setTimeout(function () {

        document.getElementById('title').classList.add('outro');

        setTimeout(function () {

            document.getElementById('codevember').classList.add('outro');

        }, 250);

    }, 8000);

    // set up the scene
    scene = new THREE.Scene();

    // set up the camera to see the actual scene
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
    // camera.translateZ(100);
    camera.position.z = 75;
    camera.position.y = 125;

    // set up the renderer
    renderer = new THREE.WebGLRenderer({
        antialias: false,
        preserveDrawingBuffer: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.autoClearColor = false;
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4 + Math.random() * 0.5;
    controls.enabled = false;
    controls.update();
    controls.maxPolarAngle = Math.PI / 2 - 0.1;
    
    scene.add(particle_system.ParticleSystem);
    camera.add(background.geometry);
    scene.add(camera);
    
    animate();
}

// update function
function update () {
    
    // translate back the camera, modify the position variable, and put it back with the new value
    camera.translateZ(-Math.sin(cameraz) * 10);
    cameraz += .01;
    camera.translateZ(Math.sin(cameraz) * 10);

    particle_system.update();

    controls.update();

}

// Game Loop function (update, render, repeat)
function animate() {

    requestAnimationFrame(animate);

    // update and render
    update();

    renderer.render(scene, camera);

};

window.onload = init;

// make the canvas adaptable to the window screen
window.addEventListener('resize', function () {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});