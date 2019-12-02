// threejs
import * as THREE from '../../node_modules/three/build/three.module.js';
// orbit control, for easy camera control
import {
    OrbitControls
} from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';
// import the sound
import {
    Audio
} from './modules/Audio.js';
// import post effect
import {
    PostProcessing
} from './modules/PostProcessing.js';
// import sound texture
import {
    SoundTexture
} from './modules/SoundTexture.js';
// import the Sphere Noise
import {
    Sphere
} from "./modules/SphereNoise.js";
/* particle system */
import {
    ParticleSystem
} from './modules/Snowflakes.js';
const stars = new ParticleSystem(window.innerWidth, window.innerHeight);

/* Usual Three.js stuff */
var scene, camera, renderer, orbit;

// geometries
var spNoise;

// Sound
var sound;
var thisKick = 0;

var s_texture = new SoundTexture();

var postProcessing;

sound = new Audio();
sound.init().then(init());

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

    spNoise = new Sphere(250, 4);

    scene.add(spNoise.mesh);
    scene.add(stars.ParticleSystem);

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

    if (sound !== undefined) {

        sound.update();

        orbit.update();

        s_texture.update(sound.frequencies);

        thisKick = sound.frequencies[3];

        stars.update(window.innerWidth, window.innerHeight);

        spNoise.update(performance.now() * 0.00025, s_texture.s_texture, sound.frequencies[3] * 5);
        
    }
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