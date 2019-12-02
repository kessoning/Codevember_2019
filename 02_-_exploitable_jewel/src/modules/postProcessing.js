import {
    Clock,
    Vector2
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

import {
    post_vertex,
    post_fragment
} from '../shaders/Shaders.js';

const PostProcessing = function (w_, h_, renderer, scene, camera) {

    this.clock = new Clock();

    // Declare Uniforms
    this.drawShader = {
        uniforms: {
            tDiffuse: {
                type: "t",
                value: null
            },
            iResolution: {
                type: "v2",
                value: new Vector2(w_, h_)
            },
            iGlobalTime: {
                type: "f",
                value: 0.01
            },
            mouse: {
                type: "v2",
                value: new Vector2(0.5, 0.5)
            },
            noiseamount: {
                type: "f",
                value: 1.0
            },
            focused: {
                type: "f",
                value: 1.0
            }
        },
        vertexShader: post_vertex,
        fragmentShader: post_fragment
    };

    let params = {
        exposure: 1,
        bloomStrength: 2.0,
        bloomThreshold: 0,
        bloomRadius: 0.5
    };

    this.composer = new EffectComposer(renderer);
    this.composer.addPass(new RenderPass(scene, camera));

    this.blurPass = new ShaderPass(this.drawShader);

    this.bloomPass = new UnrealBloomPass(new Vector2(w_, h_), 1.5, 0.4, 0.85);
    this.bloomPass.threshold = params.bloomThreshold;
    this.bloomPass.strength = params.bloomStrength;
    this.bloomPass.radius = params.bloomRadius;

    this.composer.addPass(this.bloomPass);
    this.composer.addPass(this.blurPass);

    this.runShader = function (focus, mouse) {
        this.blurPass.uniforms.iGlobalTime.value = this.clock.getElapsedTime();
        this.blurPass.uniforms.focused.value = focus;
        this.blurPass.uniforms.mouse.value = mouse;
        this.composer.render();
    };

    this.adaptResolution = function(w_, h_) {
        this.blurPass.uniforms.iResolution.value = new Vector2(w_, h_);
    };
}

export {
    PostProcessing
};