import {
    BufferGeometry,
    Float32BufferAttribute,
    RawShaderMaterial,
    Vector2,
    Points,
    Clock
} from '../../../node_modules/three/build/three.module.js';

import {
    ps_vertex, ps_fragment
} from '../Shaders/Shaders.js';

import {
    HALF_PI
} from '../../../utils/math.js'

const ParticleSystem = function(num_particles, w_, h_) {
    
    this.indices = [];
    this.vertices = [];

    this.clock = new Clock();

    var index = 1;
    for (var i = 0; i < num_particles; i++) {
        this.indices.push(index++);
        this.vertices.push(Math.random() * 500.0);
        this.vertices.push(Math.random() * 500.0);
        this.vertices.push(Math.random() * 500.0);
    }

    this.geometry = new BufferGeometry();

    this.geometry.setAttribute('position', new Float32BufferAttribute(this.vertices, 3));
    this.geometry.setAttribute('vertexId', new Float32BufferAttribute(this.indices, 1));

    var zoom = 1;
    if (window.innerHeight > window.innerWidth) zoom = 1.5;

    this.material = new RawShaderMaterial({
        uniforms: {
            time: {
                value: 0.0
            },
            resolution: {
                value: new Vector2(window.innerWidth, window.innerHeight),
            },
            zoom: {
                value: zoom
            },
        },
        vertexShader: ps_vertex,
        fragmentShader: ps_fragment,
        transparent: true,
        depthTest: true,
        depthWrite: true,
        vertexColors: true,
    });

    this.ParticleSystem = new Points(this.geometry, this.material);
    this.ParticleSystem.rotateY(-HALF_PI);
    this.ParticleSystem.position.y = -50;

    this.update = function() {

        this.ParticleSystem.material.uniforms.time.value = this.clock.getElapsedTime();
        this.ParticleSystem.material.needsUpdate = true;
        this.ParticleSystem.material.elementsNeedUpdate = true;

    }

}

export {
    ParticleSystem
};