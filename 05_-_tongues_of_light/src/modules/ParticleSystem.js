/* Particle System
 * 
 * The actual particle system
 *
 */

import {
    BufferGeometry,
    Float32BufferAttribute,
    Vector2,
    Vector3,
    ShaderMaterial,
    DoubleSide,
    AdditiveBlending,
    Points,
    VideoTexture,
    NearestFilter,
    RGBFormat,
    ClampToEdgeWrapping,
}
from '../../../node_modules/three/build/three.module.js';

import {
    psVertex,
    psFragment
} from '../Shaders/particleSystemShaders.js';

import {
    lerp
} from '../../../utils/math.js';

const ParticleSystem = function (tw_, w_, h_) {

    // Store the vertices and "references" for the UV map
    this.vertices = [];
    this.references = [];
    this.alpha = 0; // Store the alpha value for the "fade in" effect
    this.video = document.getElementById('video');
    this.videoTexture = new VideoTexture(this.video);
    this.videoTexture.minFilter = NearestFilter;
    this.videoTexture.magFilter = NearestFilter;
    this.videoTexture.wrapS = ClampToEdgeWrapping;
    this.videoTexture.wrapT = ClampToEdgeWrapping;
    this.videoTexture.format = RGBFormat;

    this.init = function () {

        for (let i = 0; i < w_; i++) {

            let uvx = i / w_;

            for (let j = 0; j < h_; j++) {

                let uvy = j / h_;

                // Initialize the vertices in random 2D position
                this.vertices.push(i);
                this.vertices.push(j);
                this.vertices.push(0);

                this.references.push(uvx);
                this.references.push(uvy);
            }

        }

        this.geometry = new BufferGeometry();
        this.geometry.setAttribute('position', new Float32BufferAttribute(this.vertices, 3));
        this.geometry.setAttribute('reference', new Float32BufferAttribute(this.references, 2));

        this.uniforms = {
            "texturePosition": {
                value: null
            },
            "textureVelocity": {
                value: null
            },
            "textureVideo": {
                value: null
            },
            "screenResolution": {
                value: new Vector2(w_, h_)
            },
            "col": {
                value: new Vector3(0.19, 0.62, 0.88)
            },
            "alpha": {
                value: 1.0
            },
        }

        this.material = new ShaderMaterial({

            uniforms: this.uniforms,
            vertexShader: psVertex,
            fragmentShader: psFragment,
            side: DoubleSide,
            blending: AdditiveBlending,
            transparent: true,
            // vertexColors: true,

        });

        this.particlesystem = new Points(this.geometry, this.material);
        this.particlesystem.position.x = -w_ / 2;
        this.particlesystem.position.y = -h_ / 2;

    }

    this.update = function (positionVariable, velocityVariable) {

        this.alpha = lerp(this.alpha, 0.05, 0.002);

        this.uniforms["alpha"].value = this.alpha;
        this.uniforms["textureVideo"].value = this.videoTexture;
        this.uniforms["texturePosition"].value = positionVariable;
        this.uniforms["textureVelocity"].value = velocityVariable;

    }

}

export {
    ParticleSystem
};