import * as THREE from '../../node_modules/three/build/three.module.js';

import {
  PostProcessing
} from './modules/PostProcessing.js';
let post_processing;

import {
  ParticleSystem
} from './modules/ParticleSystem.js';
var particle_system;

// set up the scene
let scene, camera, renderer;

// make the canvas adaptable to the window screen
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

window.onload = function () {
  init();
  animate();
}

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

  // set up the camera
  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10000000);
  camera.position.z = -50;

  renderer = new THREE.WebGLRenderer({
    preserveDrawingBuffer: true // In the case the rendering pipeline crashes it doesnt reset to black screen
  });
  renderer.autoClearColor = false;
  renderer.setPixelRatio(1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0.0);
  document.body.appendChild(renderer.domElement);

  // orbit = new OrbitControls(camera, renderer.domElement);
  // orbit.autoRotate = false;
  // orbit.enabled = false;
  // orbit.update();

  var plane = new THREE.Mesh(new THREE.PlaneGeometry(50000, 50000), new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.05
  }));
  plane.position.z = -5000;
  scene.add(plane);

  // Add the particle system to the scene
  let w_ = window.innerWidth;
  let h_ = window.innerHeight;
  let num_particles = 100000;
  particle_system = new ParticleSystem(w_, h_, w_, num_particles, w_, h_);
  scene.add(particle_system.ParticleSystem);

  post_processing = new PostProcessing(w_, h_, renderer, scene, camera);
}

// render function
function render() {
  // let's render the actual scene, first parameter is the scene, second the camera
  renderer.render(scene, camera);
};

// Loop and render function
function animate() {

  requestAnimationFrame(animate);

  particle_system.update(performance.now() * 0.0002);

  render();

  post_processing.runShader(); // This is the actual post effect (blur)
};