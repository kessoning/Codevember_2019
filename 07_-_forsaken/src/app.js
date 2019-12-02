/* Three.js library */
import * as THREE from '../../node_modules/three/build/three.module.js';

/* And OrbitControl */
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';

/* the sphere/shape */
import { Shape } from './modules/Shape.js';

/* The audio manager */
import { Audio } from './modules/Audio.js';
const audio = new Audio;

/* Check if the browser is mobile */
import { MobileCheck } from '../../utils/MobileCheck.js';
const is_mobile = new MobileCheck().isMobile;

/* The particle system */
import { ParticleSystem } from './modules/ParticleSystem.js';
var particle_system;

import { SoundTexture } from './modules/AudioTexture.js';
const sound_texture = new SoundTexture();

/* Post Effect Filter */
import { PostProcessing } from './modules/PostProcessing.js';
var post_effect;

var shape, red_shape;

var scene, camera, renderer;

var orbit;

var particles;

var particles_amount;
var multiplier;

var shape_alpha = 1.0;

var progressTime = 0.0;
var kickSensitivity = 1900;
var timeKick = 0;
var flash = false;

var sphere_radius = 75.0;
var red_sphere_radius = 25.0;

var num_frames = 0;

const worker = new Worker("Worker/Worker.js");

worker.onmessage = function (e) {

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

  particles = e.data.shp_n.length;

  particle_system = new ParticleSystem(shape_alpha, sound_texture.texture, particles, e);

  shape = new Shape(shape_alpha, sphere_radius, sound_texture.texture, particles, 0.0, e);
  red_shape = new Shape(shape_alpha, red_sphere_radius, sound_texture.texture, particles, 1.0, e);

  scene.add(particle_system.ParticleSystem);
  scene.add(shape.sphere);
  scene.add(red_shape.sphere);

  animate();

}

audio.init().then(init());

function init() {

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10000000);
  camera.position.z = -350;

  renderer = new THREE.WebGLRenderer({
    antialias: false,
    preserveDrawingBuffer: true
  });
  renderer.setPixelRatio(1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1.0);
  renderer.autoClear = true;
  document.body.appendChild(renderer.domElement);
  renderer.gammaOutput = true;

  post_effect = new PostProcessing(window.innerWidth, window.innerHeight, renderer, scene, camera);

  if (!is_mobile) {
    particles_amount = 700;
    multiplier = 3;
  } else {
    particles_amount = 200;
    multiplier = 4;
  }

  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.autoRotate = true;
  orbit.autoRotateSpeed = 0.4;
  orbit.enabled = false;
  orbit.rotateY = Math.random() * Math.PI * 2;
  orbit.update();

  let message = {
    shp_pn: particles_amount,
    m: multiplier,
    mobile: is_mobile,
    ps_pn: 50,
  };

  worker.postMessage(message);
}

window.addEventListener('resize', function () {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  post_effect.resize(width, height);
});

function update() {

  audio.update();
  sound_texture.update(audio.frequencies, audio.dataArray);

  progressTime += audio.meter.volume * 0.25;

  if (audio.frequencies[4] > 200 && performance.now() - timeKick > kickSensitivity) {

    camera.position.x = 25.0 + Math.random() * 75.0;

    camera.position.y = 25.0 + Math.random() * 75.0;

    camera.position.z = 25.0 + Math.random() * 75.0;

    let rs = 2.0 + Math.random() * 5.0;

    if (Math.random() > 0.5) rs *= -1;

    orbit.autoRotateSpeed = rs;

    timeKick = performance.now();

    whiteflash = 0;

    if (Math.random() > 0.5) {
      whiteflash = 1;
    }

  }
  orbit.update();

  var pfm = performance.now() * 0.0001;

  particle_system.update(shape_alpha, performance.now(), sound_texture.s_texture);

  shape.update(shape_alpha, pfm, progressTime, flash, num_frames, sound_texture.s_texture );
  red_shape.update(shape_alpha, pfm, progressTime, flash, num_frames, sound_texture.s_texture );

  num_frames++;
};

function animate() {

  requestAnimationFrame(animate);

  update();

  renderer.render(scene, camera);

  post_effect.runShader();

};
