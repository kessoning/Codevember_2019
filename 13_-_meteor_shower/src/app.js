import * as THREE from '../../node_modules/three/build/three.module.js';

/* particle system */
import { ParticleSystem } from './modules/Geometry.js';
const stars = new ParticleSystem(window.innerWidth, window.innerHeight);

/* Post Effect Filter */
import { PostProcessing } from './modules/PostProcessing.js';
var post_effect;

// renderer, scene, camera, the usual
var renderer, scene, camera;

// background plane
var plane;

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

  renderer = new THREE.WebGLRenderer({
    preserveDrawingBuffer: true
  });
  renderer.autoClearColor = false;
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // set up the scene
  scene = new THREE.Scene();

  // set up the camera to see the actual scene
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  scene.add(camera);

  post_effect = new PostProcessing(window.innerWidth, window.innerHeight, renderer, scene, camera);

  plane = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000), new THREE.MeshBasicMaterial({
    color: 0x080f17,
    transparent: true,
    opacity: 0.05
  }));
  plane.position.z = -1000;
  scene.add(plane);

  scene.add(stars.ParticleSystem);

  draw();
}

// Game Loop function (update, render, repeat)
function draw() {
  requestAnimationFrame(draw);

  stars.update(window.innerWidth, window.innerHeight);

  render();

  post_effect.runShader();
};

// render function
function render() {
  // let's render the actual scene, first parameter is the scene, second the camera
  renderer.render(scene, camera);
};

init();

// make the canvas adaptable to the window screen
window.addEventListener('resize', function () {
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});