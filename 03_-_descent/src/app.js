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

import {
    lerp
} from '../../utils/math.js';

var scene, camera, renderer;

import {
    MobileCheck
} from '../../utils/MobileCheck.js';
const mobilecheck = new MobileCheck();
var isMobile = mobilecheck.isMobile;

var orbit;

var mouse = new THREE.Vector2(0.0, 0.0);
var mouse_nd = new THREE.Vector2(0.0, 0.0);
var mouse_m = 0.1;
var orientation_start = new THREE.Vector2(-1000000, -1000000);

var resolution;

window.addEventListener('resize', function () {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
    pass.uniforms.iResolution.value = resolution;
    composer.render();
});

function mousePointer(e) {
    mouse_nd.x = e.pageX;
    mouse_nd.y = e.pageY;
}

function deviceOrientationListener(event) {
    if (orientation_start.x === -1000000 && orientation_start.y === -1000000) {
        orientation_start.x = event.gamma;
        orientation_start.y = event.beta;
    }

    mouse_nd.x = (orientation_start.x - event.gamma) * 50.0;
    mouse_nd.y = (orientation_start.y - event.beta) * 10.0;
}


function init() {

    if (!isMobile) window.addEventListener('mousemove', mousePointer);
    else window.addEventListener("deviceorientation", handleOrientation, true);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10000000);
    camera.position.z = -2000;

    renderer = new THREE.WebGLRenderer({
        antialias: false,
        preserveDrawingBuffer: true
    });
    renderer.setPixelRatio(1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x020202, 1.0);
    document.body.appendChild(renderer.domElement);

    resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);

    post_effect = new PostProcessing(window.innerWidth, window.innerHeight, renderer, scene, camera);

    orbit = new OrbitControls(camera, renderer.domElement);
    orbit.autoRotate = false;
    orbit.enabled = false;
    orbit.update();

    mouse = new THREE.Vector2(0, 0);
    mouse_nd = new THREE.Vector2(0, 0);

    particle_system = new Tunnel(1024, 750);
    scene.add(particle_system.ParticleSystem);

    soundTexture = new SoundTexture(128, 64);

    setTimeout(function () {
        document.getElementById('title').classList.add('intro');
        console.log(document.getElementById('title').classList);

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

    animate();

}

function update() {

    mouse.x = lerp(mouse.x, mouse_nd.x, 0.1);
    mouse.y = lerp(mouse.y, mouse_nd.y, 0.1);

    // Update the orbit camera to turn around
    var orbx = (mouse.x - resolution.x / 2) * -0.3;
    var orby = (mouse.y - resolution.y / 2) * -0.3;
    orbit.target = new THREE.Vector3(orbx, orby, 0);
    orbit.update();

    if (sound.frequencies != undefined) {
        sound.update();
        soundTexture.update(sound.frequencies, performance.now(), sound.meter.volume * 5);
        particle_system.update(performance.now(), soundTexture.texture, soundTexture.noise);
    }

};

function animate() {

    requestAnimationFrame(animate);

    update();

    renderer.render(scene, camera);

    post_effect.runShader();

};

// window.onload = init