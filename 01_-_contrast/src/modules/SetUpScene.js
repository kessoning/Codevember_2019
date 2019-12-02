import {
    PerspectiveCamera,
    WebGLRenderer
}
from '../../../node_modules/three/build/three.module.js';

const Camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000000);
Camera.translateZ(1500);
Camera.position.x = -4000 + Math.random() * 2000;
Camera.position.y = 1000;

const Renderer = new WebGLRenderer({
    antialias: false
});

Renderer.setPixelRatio(window.devicePixelRatio);
Renderer.setSize(window.innerWidth, window.innerHeight);
Renderer.setClearColor(0x000000, 1.0);
Renderer.gammaInput = true;
Renderer.gammaOutput = true;

export {
    Camera,
    Renderer
};