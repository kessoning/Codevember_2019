/* Import Three.js */
import * as THREE from '../../../node_modules/three/build/three.module.js';

/* And OrbitControl */
import {
  OrbitControls
} from '../../../node_modules/three/examples/jsm/controls/OrbitControls.js';

import {
  Gui
} from './modules/Gui.js';
const gui = new Gui();

/* Import the Spheres */
import {
  Sphere
} from "./modules/Sphere.js";
const sphere = new Sphere();

/* The audio manager */
import {
  Audio
} from './modules/Audio.js';
const audio = new Audio;

/* The post effect shader */
import {
  PostEffect
} from './modules/PostProcessing.js';
let post_effect;

/* import the floor */
import {
  Floor,
  Light,
  Red_Light
} from './modules/SceneObjects.js';

/* The renderer */
import {
  Camera,
  Renderer
} from './modules/SetUpScene.js';

var camera, scene, renderer;

var controls;
var cameraz = 0;

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

  document.body.appendChild(Renderer.domElement);

  post_effect = new PostEffect(window.innerWidth, window.innerHeight, Renderer, scene, Camera);

  controls = new OrbitControls(Camera, Renderer.domElement);
  controls.autoRotate = true;
  controls.maxPolarAngle = Math.PI / 2 - 0.1;

  sphere.init(); // Init Spheres

  scene.add(Camera);
  scene.add(sphere.group);
  scene.add(Floor);
  scene.add(Light);
  scene.add(Red_Light);

}

/* Make the canvas great again (on window resized) */
window.addEventListener('resize', function () {
  var width = window.innerWidth;
  var height = window.innerHeight;
  Renderer.setSize(width, height);
  Camera.aspect = width / height;
  Camera.updateProjectionMatrix();
});

function animate() {

  controls.update();
  cameraz += .01;
  Camera.translateZ(Math.cos(cameraz) * 10);

  audio.update();

  if (audio.meter != undefined) {
    Light.intensity = 1 + (audio.meter.volume * 50);
    Red_Light.intensity = audio.meter.volume * 2;

    let max_distance = gui.effectController.maxDistance;
    let max_volume = gui.effectController.micSensibility;
    let frequencies = audio.frequencies;
    let data_array = audio.dataArray;
    let volume = audio.meter.volume;
    sphere.animate(max_distance, max_volume, frequencies, data_array, volume);
  }

  Renderer.render(scene, Camera);

  post_effect.run();

  requestAnimationFrame(animate);

}

audio.init().then(() => {
  init();
  animate();
});



// Performance test
// javascript: (function () {
//   var script = document.createElement('script');
//   script.onload = function () {
//     var stats = new Stats();
//     document.body.appendChild(stats.dom);
//     requestAnimationFrame(function loop() {
//       stats.update();
//       requestAnimationFrame(loop)
//     });
//   };
//   script.src = '//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';
//   document.head.appendChild(script);
// })()