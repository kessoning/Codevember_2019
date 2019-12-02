//
// The original work is from https: //threejs.org/examples/#webgl_geometry_extrude_splines */
//

import * as THREE from '../../node_modules/three/build/three.module.js';

import Stats from '../../node_modules/three/examples/jsm/libs/stats.module.js';

import {
    Curves
} from '../../node_modules/three/examples/jsm/curves/CurveExtras.js';

import {
    PostProcessing
} from './modules/postProcessing.js';
var post_processing;

var stats;

var camera, scene, renderer, splineCamera, cameraHelper, orbit;

var binormal = new THREE.Vector3();

var normal = new THREE.Vector3();

var parent, tubeGeometry, mesh;

var scale = 6;

var material = new THREE.MeshLambertMaterial({
    color: 0x156615,
});

var wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    opacity: 1.0,
    wireframe: true,
    transparent: true
});

function addTube() {

    if (mesh !== undefined) {
        parent.remove(mesh);
        mesh.geometry.dispose();
    }

    var extrudePath = new Curves.CinquefoilKnot(20);
    tubeGeometry = new THREE.TubeBufferGeometry(extrudePath, 500, 2, 12, true);
    addGeometry(tubeGeometry);
    setScale();
}

function setScale() {
    mesh.scale.set(scale, scale, scale);
}

function addGeometry(geometry) {
    // 3D shape
    mesh = new THREE.Mesh(geometry, material);
    var wireframe = new THREE.Mesh(geometry, wireframeMaterial);
    mesh.add(wireframe);
    parent.add(mesh);
}

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

    // camera
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 10000);
    camera.position.set(0, 50, 500);

    // scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020302);

    // light
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1);
    scene.add(light);

    // tube
    parent = new THREE.Object3D();
    scene.add(parent);

    splineCamera = new THREE.PerspectiveCamera(84, window.innerWidth / window.innerHeight, 0.01, 1000);
    parent.add(splineCamera);
    splineCamera.lookAt(-100, 0, 0);
    
    scene.add(cameraHelper);
    
    addTube();

    // renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1.0);
    document.body.appendChild(renderer.domElement);
    
    // orbit = new OrbitControls(splineCamera, renderer.domElements);

    post_processing = new PostProcessing(window.innerWidth, window.innerHeight, renderer, scene, splineCamera);

    // stats
    stats = new Stats();
    // container.appendChild(stats.dom);

    animate();

}

//
function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();
}

function render() {

    // animate camera along spline
    let time = Date.now();
    
    let looptime = 20 * 1000;
    
    let t = (time % looptime) / looptime;
    
    let pos = tubeGeometry.parameters.path.getPointAt(t);
    pos.multiplyScalar(scale);
    
    // interpolation
    let segments = tubeGeometry.tangents.length;
    
    let pickt = t * segments;
    
    let pick = Math.floor(pickt);
    
    let pickNext = (pick + 1) % segments;
    
    binormal.subVectors(tubeGeometry.binormals[pickNext], tubeGeometry.binormals[pick]);
    binormal.multiplyScalar(pickt - pick).add(tubeGeometry.binormals[pick]);
    
    let dir = tubeGeometry.parameters.path.getTangentAt(t);
    
    let offset = 15;
    
    normal.copy(binormal).cross(dir);
    
    // we move on a offset on its binormal
    pos.add(normal.clone().multiplyScalar(offset));
    
    splineCamera.position.copy(pos);
    
    // using arclength for stablization in look ahead
    let lookAt = tubeGeometry.parameters.path.getPointAt((t + 30 / tubeGeometry.parameters.path.getLength()) % 1).multiplyScalar(scale);
    
    // camera orientation 2 - up orientation via normal
    lookAt.copy(pos).add(dir);
    
    splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal);
    splineCamera.quaternion.setFromRotationMatrix(splineCamera.matrix);

    mesh.children[0].material.opacity = Math.abs(Math.cos(performance.now() * 0.0005)) * 0.2;

    renderer.render(scene, splineCamera);

    post_processing.runShader();

}



// EVENTS
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.onload = init;