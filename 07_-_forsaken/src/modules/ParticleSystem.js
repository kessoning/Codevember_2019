import { BufferGeometry, Float32BufferAttribute, RawShaderMaterial, DoubleSide, Points, DynamicDrawUsage } from '../../../node_modules/three/build/three.module.js';

import { particles_vertex, particles_fragment } from '../Shaders/Shaders.js';

const ParticleSystem = function (fa, t, p, e) {

    this.geometry = new BufferGeometry();

    this.geometry.setAttribute('position', new Float32BufferAttribute(e.data.ps_p, 3).setUsage(DynamicDrawUsage));
    this.geometry.setAttribute('color', new Float32BufferAttribute(e.data.ps_c, 4).setUsage(DynamicDrawUsage));
    this.geometry.setAttribute('noise', new Float32BufferAttribute(e.data.ps_n, 1).setUsage(DynamicDrawUsage));
    this.geometry.setAttribute('phase', new Float32BufferAttribute(e.data.ps_i, 1).setUsage(DynamicDrawUsage));
    this.geometry.setAttribute('vID', new Float32BufferAttribute(e.data.ps_id, 1).setUsage(DynamicDrawUsage));

    const unif_ = {
        time: { value: 0.0 },
        s_time: { value: 0.0 },
        alpha: { value: fa },
        uAudio: { value: t, },
        maxID: { value: p, },
    }

    this.material = new RawShaderMaterial({
        uniforms: unif_,
        vertexShader: particles_vertex,
        fragmentShader: particles_fragment,
        side: DoubleSide,
        transparent: true,
        depthTest: true,
        depthWrite: true,
        vertexColors: true,
    });

    this.ParticleSystem = new Points(this.geometry, this.material);

    this.update = function (fa, t, txt) {

        this.ParticleSystem.material.uniforms.alpha.value = fa;
        this.ParticleSystem.material.uniforms.time.value = t * 0.00001;
        this.ParticleSystem.material.uniforms.s_time.value = t;
        this.ParticleSystem.material.uniforms.uAudio.value = txt;
        this.ParticleSystem.material.needsUpdate = true;
        this.ParticleSystem.material.elementsNeedUpdate = true;

    }
}

export { ParticleSystem };
