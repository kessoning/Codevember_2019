import * as THREE from '../../node_modules/three/build/three.module.js';

/* OrbitControl */
import {
    OrbitControls
} from '../../../node_modules/three/examples/jsm/controls/OrbitControls.js';

import {
    Audio
} from '../../utils/Audio.js';
const sound = new Audio;
sound.init().then(init());

import {
    SoundTexture
} from '../../utils/SoundTexture.js';
var soundTexture;

import {
    Tunnel
} from './modules/Deep.js';
var particle_system;

import {
    PostProcessing
} from './modules/PostProcessing.js';
var post_effect;

var scene, camera, renderer, orbit;

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10000000);
    camera.position.z = -50;

    renderer = new THREE.WebGLRenderer({
        antialias: false,
        preserveDrawingBuffer: true
    });
    renderer.setPixelRatio(1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x020202, 1.0);
    document.body.appendChild(renderer.domElement);

    post_effect = new PostProcessing(window.innerWidth, window.innerHeight, renderer, scene, camera);

    orbit = new OrbitControls(camera, renderer.domElement);

    particle_system = new Tunnel(1024, 750);
    scene.add(particle_system.ParticleSystem);

    soundTexture = new SoundTexture(128, 64);

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

    animate();

}

function update() {

    sound.update();

    let vol = sound.meter.volume * 5;
    if (vol > 1) vol = 1;

    soundTexture.update(sound.frequencies, performance.now(), vol);

    particle_system.update(performance.now(), soundTexture.texture, soundTexture.noise);

};

function animate() {

    requestAnimationFrame(animate);

    update();

    renderer.render(scene, camera);

    post_effect.runShader();

};