import { Vector2 } from '../../../node_modules/three/build/three.module.js';

/* Shader modules from threejs examples */
import { EffectComposer } from '../../../node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../../../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from '../../../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js';

const PostProcessing = function (w_, h_, renderer, scene, camera) {

    let params = {
        exposure: 1,
        bloomStrength: 1.5,
        bloomThreshold: 0.1,
        bloomRadius: 0
    };

    this.composer = new EffectComposer(renderer);
    this.composer.addPass(new RenderPass(scene, camera));

    this.bloomPass = new UnrealBloomPass(new Vector2(w_, h_), 1.5, 0.4, 0.85);
    this.bloomPass.threshold = params.bloomThreshold;
    this.bloomPass.strength = params.bloomStrength;
    this.bloomPass.radius = params.bloomRadius;

    this.composer.addPass(this.bloomPass);

    this.runShader = function (volume, w) {
        this.composer.render();
    }

}

export { PostProcessing };
