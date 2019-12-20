import {
    Vector2,
    Clock
} from '../../../node_modules/three/build/three.module.js';

/* Shader modules from threejs examples */
import {
    EffectComposer
} from '../../../node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import {
    RenderPass
} from '../../../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import {
    ShaderPass
} from '../../../node_modules/three/examples/jsm/postprocessing/ShaderPass.js';
import {
    UnrealBloomPass
} from '../../../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js';

/* SHADER */
import {
    post_vertex,
    post_fragment
} from '../Shaders/Shaders.js';

const PostProcessing = function (w_, h_, renderer, scene, camera) {

    this.resolution = new Vector2(w_, h_);

    this.clock = new Clock();

    let r = this.resolution;

    this.drawShader = {
        uniforms: {
            tDiffuse: {
                value: null
            },
            iResolution: {
                value: r
            },
            iGlobalTime: {
                value: 0.01
            },
        },
        vertexShader: post_vertex,
        fragmentShader: post_fragment
    };

    let params = {
        exposure: 1,
        bloomStrength: 1.0,
        bloomThreshold: 0,
        bloomRadius: 0
    };

    this.composer = new EffectComposer(renderer);
    this.composer.addPass(new RenderPass(scene, camera));

    this.bloomPass = new UnrealBloomPass(new Vector2(w_, h_), 1.5, 0.4, 0.85);
    this.bloomPass.threshold = params.bloomThreshold;
    this.bloomPass.strength = params.bloomStrength;
    this.bloomPass.radius = params.bloomRadius;

    this.pass = new ShaderPass(this.drawShader);
    // this.composer.addPass(this.bloomPass);
    this.composer.addPass(this.pass);

    this.runShader = function () {
        this.pass.uniforms.iGlobalTime.value = this.clock.getElapsedTime();
        this.composer.render();
    }

    this.resize = function (w_, h_) {
        this.resolution = new THREE.Vector2(w_, h_);
        this.pass.uniforms.iResolution.value = this.resolution;
    }

}

export {
    PostProcessing
};