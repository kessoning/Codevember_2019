import {
    BufferGeometry,
    Float32BufferAttribute,
    RawShaderMaterial,
    DoubleSide,
    AdditiveBlending,
    Points
} from '../../../node_modules/three/build/three.module.js';

import {
    vertexShader,
    fragmentShader
} from '../Shaders/Shaders.js';

const Tunnel = function (tot, r) {

    this.positions = [];
    this.angles = []
    this.uvs = [];
    this.noise = [];
    this.micro_noise = [];

    let max = tot;

    this.r = r;

    for (let i = 0; i < max; i++) {
        
        let uvx = i / (max - 1);
        
        for (let j = 0; j < max; j++) {

            let a = (j / (max - 1)) * (Math.PI * 2);

            let xa = Math.cos(a);
            let ya = Math.sin(a);

            let uvy = j / (max - 1);

            let x = r * xa;
            let y = r * ya;
            let z = (-0.5 + uvx) * 4000;

            this.positions.push(x);
            this.positions.push(y);
            this.positions.push(z);

            // this.positions.push(Math.random() * 1000);
            // this.positions.push(Math.random() * 1000);
            // this.positions.push(Math.random() * 1000);

            this.angles.push(xa);
            this.angles.push(ya);

            this.noise.push(ya);
            this.noise.push(uvy);

            this.uvs.push(uvx);
            this.uvs.push(uvy);

        }

    }

    this.geometry = new BufferGeometry();

    this.geometry.setAttribute('position', new Float32BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('angle', new Float32BufferAttribute(this.angles, 2));
    this.geometry.setAttribute('noise', new Float32BufferAttribute(this.noise, 2));
    this.geometry.setAttribute('soundUV', new Float32BufferAttribute(this.uvs, 2));

    this.material = new RawShaderMaterial({
        uniforms: {
            soundTexture: {
                type: 't',
                value: null
            },
            time: {
                type: 'f',
                value: 0.0
            },
            radius: {
                type: 'f',
                value: r
            },
            sensitivity: {
                type: 'f',
                value: r*0.5
            },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: DoubleSide,
        blending: AdditiveBlending,
        depthTest: false,
        transparent: true,
        depthWrite: true,
        vertexColors: true,
    });

    this.ParticleSystem = new Points(this.geometry, this.material);
    // this.ParticleSystem.positionY = this.r * 0.5;
    // this.ParticleSystem.rotateY = Math.PI;

    this.update = function(time, texture, n) {
        
        let t = n * Math.PI * 2;

        this.ParticleSystem.rotateZ(0.02);

        this.ParticleSystem.material.uniforms.time.value = time;
        this.ParticleSystem.material.uniforms.soundTexture.value = texture;
        this.ParticleSystem.material.needsUpdate = true;
        this.ParticleSystem.material.elementsNeedUpdate = true;

    }
}

export { Tunnel };