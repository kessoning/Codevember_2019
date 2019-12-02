/* import three.js */
import * as THREE from '../../node_modules/three/build/three.module.js';

// import GPUComputationRenderer
import {
    GPUComputationRenderer
} from '../../node_modules/three/examples/jsm/misc/GPUComputationRenderer.js';

/* Position texture shader */
import { fragmentShaderPosition } from './Shaders/fragmentShaderPosition.js';

/* Velocity texture shader */
import { fragmentShaderVelocity } from './Shaders/fragmentShaderVelocity.js';

/* Flowfield texture */
import { FlowField } from './modules/FlowField.js';

/* Speed and Force values */
import { ForceTexture } from './modules/ForceTexture.js';

/* Import and initialize the background fading object */
import { Background } from './modules/Background.js';
const background = new Background();

/* Check if the browser is mobile */
import { MobileCheck } from '../../utils/MobileCheck.js';
const is_mobile = new MobileCheck().isMobile;

/* Print a message in the console */
import { Welcome } from './modules/Welcome.js';
const WelcomeMessage = new Welcome();

/* Texture width for the simulation */
const WIDTH = 1280;

/* The particle system */
import { ParticleSystem } from './modules/ParticleSystem.js';
// Initialize the particle system
const particlesystem = new ParticleSystem(WIDTH, window.innerWidth, window.innerHeight);

// Initialize the flow field
let resolution = is_mobile ? 10 : 10;   // Resolution of the flowfield
const flowfield = new FlowField(resolution, window.innerWidth, window.innerHeight);

// Initialize the force and speed texture
const forcetexture = new ForceTexture(WIDTH, 0.5, 2.25, 0.02, 0.04);

// Variables for the GPUCompute
let gpuCompute, velocityVariable, positionVariable, positionUniforms, velocityUniforms;

// Camera, scene, renderer global variables
let camera, scene, renderer;

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

    /* Camera, Scene and Renderer */
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000000);
    camera.position.z = window.innerWidth > window.innerHeight ? window.innerWidth / 3.2 : window.innerHeight / 1.592;

    scene = new THREE.Scene();

    /* Preserve the drawing buffer to not to clear the background, for the trail effect */
    renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
    renderer.setPixelRatio(1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0.0);
    renderer.autoClearColor = false;
    document.body.appendChild(renderer.domElement);

    // Add the bacground geometry to the scene
    scene.add(background.geometry);

    // Initialize the flowfield
    flowfield.init();

    // Initialize the particle system and add it to the scene
    particlesystem.init();
    scene.add(particlesystem.particlesystem);

    // Initialize the compute renderer
    initComputeRenderer();

}

// make the canvas adaptable to the window screen
window.addEventListener('resize', function () {
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    velocityUniforms["screenResolution"] = { value: new THREE.Vector2(width * 2, height * 2) };
    positionUniforms["screenResolution"] = { value: new THREE.Vector2(width, height) };
});

function initComputeRenderer() {

    // initialization
    // Create computational renderer
    gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer);

    // Create initial state float textures
    let dtPosition = gpuCompute.createTexture();
    let dtVelocity = gpuCompute.createTexture();

    // Fill in with data
    fillPositionTexture(dtPosition);
    fillVelocityTexture(dtVelocity);

    velocityVariable = gpuCompute.addVariable("textureVelocity", fragmentShaderVelocity, dtVelocity);
    positionVariable = gpuCompute.addVariable("texturePosition", fragmentShaderPosition, dtPosition);

    gpuCompute.setVariableDependencies(velocityVariable, [positionVariable, velocityVariable]);
    gpuCompute.setVariableDependencies(positionVariable, [positionVariable, velocityVariable]);

    positionUniforms = positionVariable.material.uniforms;
    velocityUniforms = velocityVariable.material.uniforms;

    // Simulation uniforms
    positionUniforms["time"] = { value: 0.0 };
    positionUniforms["screenResolution"] = { value: new THREE.Vector2(window.innerWidth, window.innerHeight)};

    velocityUniforms["time"] = { value: 0.0 };
    velocityUniforms["FlowField"] = { value: flowfield.texture };
    velocityUniforms["ForceTexture"] = { value: forcetexture.texture };
    velocityUniforms["screenResolution"] = { value: new THREE.Vector2(window.innerWidth * 2, window.innerHeight * 2) };

    // wraS and wrapT of simulation textures
    velocityVariable.wrapS = THREE.ClampToEdgeWrapping;
    velocityVariable.wrapT = THREE.ClampToEdgeWrapping;
    positionVariable.wrapS = THREE.ClampToEdgeWrapping;
    positionVariable.wrapT = THREE.ClampToEdgeWrapping;

    let error = gpuCompute.init();

    if (error !== null) {
        console.error(error);
    }
}

function fillPositionTexture(texture) {

    let array = texture.image.data;

    for (let i = 0, il = array.length; i < il; i += 4) {

        var x = Math.random() * window.innerWidth;
        var y = Math.random() * window.innerHeight;
        var z = 0.0;

        array[i + 0] = x;
        array[i + 1] = y;
        array[i + 2] = z;
        array[i + 3] = 1;
    }
}

function fillVelocityTexture(texture) {

    let array = texture.image.data;

    for (let i = 0, il = array.length; i < il; i += 4) {

        array[i + 0] = 0.0;
        array[i + 1] = 0.0;
        array[i + 2] = 0.0;
        array[i + 3] = 1.0;

    }

}

// LOOP
function animate() {

    requestAnimationFrame(animate);
    render();

}

function render() {

    // Update the flowfield
    flowfield.update();

    // Compute the shaders
    gpuCompute.compute();

    // Update the uniforms
    velocityUniforms["FlowField"] = { value: flowfield.texture }
    velocityUniforms["time"] = { value: performance.now() * 0.001 }

    velocityUniforms.needsUpdate = true;
    velocityUniforms.elementsNeedUpdate = true;

    // Get the computed shaders
    let varPosition = gpuCompute.getCurrentRenderTarget(positionVariable).texture;
    let varVelocity = gpuCompute.getCurrentRenderTarget(velocityVariable).texture;

    // Update the particle system with the shaders
    particlesystem.update(varPosition, varVelocity);

    renderer.render(scene, camera);

}

window.onload = function () {
    init();
    animate();
}

// For performance debugging
// I leave it commented here for future references
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
//     script.src = '//mrdoob.github.io/stats.js/build/stats.min.js';
//     document.head.appendChild(script);
// })()
