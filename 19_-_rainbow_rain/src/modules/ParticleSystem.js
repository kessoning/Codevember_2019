import {
    BufferGeometry,
    Float32BufferAttribute,
    RawShaderMaterial,
    DoubleSide,
    Points,
    Vector2,
    AdditiveBlending
} from '../../../node_modules/three/build/three.module.js';

import {
    vertexShader,
    fragmentShader
} from '../Shaders/ParticleShader.js';

import {
    hsvToRgb
} from '../../../utils/math.js';

const ParticleSystem = function (w_, h_, d_, numParticles, width, height) {

    let positions = [];
    let colors = [];
    let weight = [];

    for (let i = 0; i < numParticles; i++) {

        positions.push(-w_ / 2 + (Math.random() * w_));
        positions.push(-w_ / 2 + (Math.random() * w_));
        positions.push(-w_ / 2 + (Math.random() * w_));

        let hue = Math.random() * 360;
        let sat = 50;
        var bright = 75;
        var c = hsvToRgb(hue, sat, bright);

        colors.push(c[0] / 255.0);
        colors.push(c[1] / 255.0);
        colors.push(c[2] / 255.0);

        weight.push(0.5 + Math.random());

    }

    // Create a new Buffer Geometry, better optimized for GPU purpose
    this.geometry = new BufferGeometry();
    this.geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    this.geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
    this.geometry.setAttribute('weight', new Float32BufferAttribute(weight, 1));

    let a_ = 0.1;
    if (height > width) a_ = 0.25;

    // Declare the material with the vertex and fragment shader
    this.material = new RawShaderMaterial({
        uniforms: {
            'time': {
                value: 0.0
            },
            'iResolution': {
                value: new Vector2(width*0.25, height)
            },
            'alpha': {
                value: a_
            },
            'wind': {
                value: Math.random () * 0.5
            }

        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: DoubleSide,
        blending: AdditiveBlending,
        transparent: true,
        depthTest: true,
        depthWrite: true,
        vertexColors: true,
    });

    this.ParticleSystem = new Points(this.geometry, this.material);
    this.ParticleSystem.positionY = w_ / 2;
    this.ParticleSystem.rotateZ(Math.PI);

    this.update = function (time) {
        // Update the uniforms of the particle system
        this.ParticleSystem.material.uniforms.time.value = time;
        this.ParticleSystem.material.needsUpdate = true;
        this.ParticleSystem.material.elementsNeedUpdate = true;
    }

}

export {
    ParticleSystem
};