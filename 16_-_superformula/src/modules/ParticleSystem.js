import {
    Vector4,
    Points,
    BufferGeometry,
    Float32BufferAttribute,
    RawShaderMaterial,
    DoubleSide
} from '../../../node_modules/three/build/three.module.js';

import {
    map,
    supershape,
    lerp,
    HALF_PI,
} from '../../../utils/math.js';

import {
    psVertex,
    psFragment,
} from '../Shaders/Shaders.js';

const ParticleSystem = function (pn, col, rad, psz) {

    this.radius = rad;

    this.m1p = [2, 2, 6, 1, 6, 6, 6];
    this.n11p = [0.7, 1, 1, 0.3, 1000, 3000, 0.20];
    this.n12p = [0.3, 1, 1, 0.3, 400, 1000, 1];
    this.n13p = [0.2, 1, 1, 0.3, 400, 1000, 1];

    this.m2p = [3, 4, 3, 0, 4, 6, 2];
    this.n21p = [100, 1, 1, 1, 300, 250, 1];
    this.n22p = [100, 1, 1, 1, 300, 100, 1];
    this.n23p = [100, 1, 1, 1, 300, 100, 1];

    this.ss_index = Math.floor(Math.random() * this.m1p.length);

    this.m1 = this.m1p[this.ss_index];
    this.n11 = this.n11p[this.ss_index];
    this.n12 = this.n12p[this.ss_index];
    this.n13 = this.n13p[this.ss_index];

    this.m2 = this.m2p[this.ss_index];
    this.n21 = this.n21p[this.ss_index];
    this.n22 = this.n22p[this.ss_index];
    this.n23 = this.n23p[this.ss_index];

    this.angles_spherical = [];
    this.angles_polar = [];
    this.position = [];

    this.particlesCount = pn;

    for (let i = 0; i < pn; i++) {

        let a = map(i, 0, pn - 1, -HALF_PI, HALF_PI);

        let r1 = supershape(a, this.m1, this.n11, this.n12, this.n13);

        for (let j = 0; j < pn; j++) {

            let b = map(j, 0, pn - 1, -Math.PI, Math.PI);

            let r2 = supershape(b, this.m2, this.n21, this.n22, this.n23);

            let ax = Math.cos(b) * Math.cos(a);
            let ay = Math.sin(b) * Math.cos(a);
            let az = Math.sin(a);

            let r = this.radius * r1 * r2;
            let px = r * ax;
            let py = r * ay;
            let pz = this.radius * r2 * az;

            this.position.push(px);
            this.position.push(py);
            this.position.push(pz);

            this.angles_spherical.push(ax);
            this.angles_spherical.push(ay);
            this.angles_spherical.push(az);

            this.angles_polar.push(a);
            this.angles_polar.push(b);

        }

    }

    this.geometry = new BufferGeometry();

    this.geometry.setAttribute('position', new Float32BufferAttribute(this.position, 3));
    this.geometry.setAttribute('angles_spherical', new Float32BufferAttribute(this.angles_spherical, 3));
    this.geometry.setAttribute('angles_polar', new Float32BufferAttribute(this.angles_polar, 2));

    this.material = new RawShaderMaterial({
        uniforms: {
            "m1": {
                value: new Vector4(this.m1, this.n11, this.n12, this.n13)
            },
            "m2": {
                value: new Vector4(this.m2, this.n21, this.n22, this.n23)
            },
            "radius": {
                value: rad
            },
            "color": {
                value: col
            },
            "pSize" : {
                value: psz
            }
        },
        vertexShader: psVertex,
        fragmentShader: psFragment,
        side: DoubleSide,
        depthTest: true,
        transparent: true,
        depthTest: true,
        depthWrite: true,
        vertexColors: true,
    });

    // Create a new particle system with the particles and the material
    this.ParticleSystem = new Points(this.geometry, this.material);
    this.ParticleSystem.rotateY = HALF_PI;

    // update function
    this.update = function (w_, h_, fc) {

        if (fc % 240 == 0) {
            this.ss_index = Math.floor(Math.random() * this.m1p.length);
            console.log(this.ss_index);
        }

        // this.ss_index = 1;

        this.m1 = lerp(this.m1, this.m1p[this.ss_index], 0.025);
        this.n11 = lerp(this.n11, this.n11p[this.ss_index], 0.025);
        this.n12 = lerp(this.n12, this.n12p[this.ss_index], 0.025);
        this.n13 = lerp(this.n13, this.n13p[this.ss_index], 0.025);

        this.m2 = lerp(this.m2, this.m2p[this.ss_index], 0.025);
        this.n21 = lerp(this.n21, this.n21p[this.ss_index], 0.025);
        this.n22 = lerp(this.n22, this.n22p[this.ss_index], 0.025);
        this.n23 = lerp(this.n23, this.n23p[this.ss_index], 0.025);

        this.ParticleSystem.material.uniforms.m1.value = new Vector4(this.m1, this.n11, this.n12, this.n13);
        this.ParticleSystem.material.uniforms.m2.value = new Vector4(this.m2, this.n21, this.n22, this.n23);
        this.ParticleSystem.material.needsUpdate = true;
        this.ParticleSystem.material.elementsNeedUpdate = true;
    };

}

export {
    ParticleSystem
};