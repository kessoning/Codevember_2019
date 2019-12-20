import * as THREE from '../../node_modules/three/build/three.module.js';

import {
    MobileCheck
} from '../../utils/MobileCheck.js';
const mobilecheck = new MobileCheck();
var isMobile = mobilecheck.isMobile;

import {
    ParticleSystem
} from './modules/ParticleSystem.js';
var particle_system;

import {
    PostProcessing
} from './modules/PostProcessing.js';
var post_processing;

var scene, camera, renderer;

var particlesAmount;

function init() {

    // setTimeout(function () {
    //     document.getElementById('title').classList.add('intro');

    //     setTimeout(function () {
    //         document.getElementById('synopsis').classList.add('intro');

    //         setTimeout(function () {
    //             document.getElementById('codevember').classList.add('intro');
    //         }, 250);

    //     }, 250);

    // }, 250);

    // setTimeout(function () {
    //     document.getElementById('title').classList.add('outro');

    //     setTimeout(function () {
    //         document.getElementById('synopsis').classList.add('outro');

    //         setTimeout(function () {
    //             document.getElementById('codevember').classList.add('outro');
    //         }, 250);

    //     }, 250);

    // }, 8000);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10000000);
    camera.position.z = -0;
    camera.position.y = 50;

    renderer = new THREE.WebGLRenderer({
        antialias: false,
        preserveDrawingBuffer: true
    });
    renderer.setPixelRatio(1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x020202, 1.0);
    document.body.appendChild(renderer.domElement);

    post_processing = new PostProcessing(window.innerWidth, window.innerHeight, renderer, scene, camera);

    if (!isMobile) {
        particlesAmount = 2000000;
    } else {
        particlesAmount = 500000;
    }

    particle_system = new ParticleSystem(particlesAmount, window.innerWidth, window.innerHeight);
    scene.add(particle_system.ParticleSystem);

    animate();

}

function animate() {

    requestAnimationFrame(animate);
    
    particle_system.update();
    
    renderer.render(scene, camera);

    post_processing.runShader();

}

window.onload = init;