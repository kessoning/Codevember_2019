import {
    BufferGeometry,
    Float32BufferAttribute,
    RawShaderMaterial,
    DoubleSide,
    AdditiveBlending,
    Points
} from '../../../node_modules/three/build/three.module.js';

import {
    particles_vertex,
    particles_fragment
} from '../shaders/ParticleSystem.js';

const ParticleSystem = function (numparticles, multiplier, isMobile) {

    var pos = []; // position
    var col = []; // color
    var noises = []; // noise values
    var move = []; // if on the land or moving in the air
    var phase = []; // the phase to move
    var noise_val = []; // other noise values, this time for 2D noise
    var micronoise_val = []; // Micronoise, another layer of noise
    var fades = []; // Speed of fading of particles

    var nx = 0; // first dimension of noise to pass to particles
    var mnx = 0; // micrnoise, first dimension

    var w = numparticles;
    var h = numparticles;

    for (var x = 0; x < w; x++) {

        var ny = 0;
        var mny = 0;

        var a = (x / w) * (Math.PI);

        for (var y = 0; y < h; y++) {

            var m = 0.0;

            var b = (y / h) * (Math.PI * 1);

            // Seamless noise
            nx = Math.sin(a);
            ny = Math.sin(b);

            var _x = (x * 2) - (w * 1);
            var _y = 0;
            var _z = (y * 2) - (h * 1);

            move.push(m);

            // 3 values, x, y, z, for particle position
            // If it is a mobile device, the x position needs to be smaller
            if (isMobile) {
                pos.push(_x * multiplier);
                pos.push(_y);
                pos.push(_z * (multiplier * 0.75));
            } else {
                pos.push(_x * (multiplier * 1));
                pos.push(_y);
                pos.push(_z * multiplier);
            }

            // colors RGBA
            col.push(1.0);
            col.push(1.0);
            col.push(1.0);
            col.push(1.0);

            // Noise
            noises.push(Math.random() * 0.000025);

            // Fade speed
            fades.push(Math.random() * 0.1);

            // 2D noise
            noise_val.push(nx);
            noise_val.push(ny);

            // 2D noises
            micronoise_val.push(mnx);
            micronoise_val.push(mny);

            // Phase, for the noise function
            phase.push(100000.0 + (Math.random() * (Math.PI * 2.0)));

            if (Math.random() > 0.95) {
                m = 1.0;
                _y += Math.random() * 1000.0;

                move.push(m);

                fades.push(Math.random() * 0.1);

                if (isMobile) {
                    pos.push(_x * multiplier);
                    pos.push(_y);
                    pos.push(_z * (multiplier * 0.25));
                } else {
                    pos.push(_x * (multiplier * 1));
                    pos.push(_y);
                    pos.push(_z * multiplier);
                }

                col.push(1.0);
                col.push(1.0);
                col.push(1.0);
                col.push(1.0);

                noises.push(Math.random() * 0.000025);

                noise_val.push(nx);
                noise_val.push(ny);

                micronoise_val.push(mnx);
                micronoise_val.push(mny);

                phase.push(100000.0 + (Math.random() * (Math.PI * 2.0)));

            }

            ny += 0.01;
            mny += 0.1;

        }

        nx += 0.01;
        mnx += 0.1;

    }

    // Create a new Buffer Geometry, better optimized for GPU purpose
    this.geometry = new BufferGeometry();
    this.geometry.setAttribute('position', new Float32BufferAttribute(pos, 3));
    this.geometry.setAttribute('color', new Float32BufferAttribute(col, 4));
    this.geometry.setAttribute('noise', new Float32BufferAttribute(noises, 1));
    this.geometry.setAttribute('move', new Float32BufferAttribute(move, 1));
    this.geometry.setAttribute('phase', new Float32BufferAttribute(phase, 1));
    this.geometry.setAttribute('noise_value', new Float32BufferAttribute(noise_val, 2));
    this.geometry.setAttribute('micronoise_value', new Float32BufferAttribute(micronoise_val, 2));

    // Declare the material with the vertex and fragment shader
    this.material = new RawShaderMaterial({
        uniforms: {
            "time": {
                value: 0.0
            },
            "u_time": {
                value: 0.0
            },
            "s_time": {
                value: 0.0
            },
            "radius": {
                value: 150.0
            },
            "rad_m": {
                value: 150.0
            },
            "move_val": {
                value: 0.0
            }
        },
        vertexShader: particles_vertex,
        fragmentShader: particles_fragment,
        side: DoubleSide,
        blending: AdditiveBlending,
        transparent: true,
        depthTest: true,
        depthWrite: true,
        vertexColors: true,
    });

    // The particle system
    this.ParticleSystem = new Points(this.geometry, this.material);
    this.ParticleSystem.rotateY(-Math.PI / 2);
    this.ParticleSystem.position.y = -50;

    this.update = function (time) {
        // Update the uniforms of the particle system
        this.ParticleSystem.material.uniforms.time.value = time * 0.00001;
        this.ParticleSystem.material.uniforms.u_time.value = time * 0.0001;
        this.ParticleSystem.material.uniforms.s_time.value = time;
        this.ParticleSystem.material.needsUpdate = true;
        this.ParticleSystem.material.elementsNeedUpdate = true;
    }
}

export {
    ParticleSystem
};