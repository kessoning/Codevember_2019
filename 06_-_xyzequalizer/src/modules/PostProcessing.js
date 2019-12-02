
/* THREEJS */
import { Vector2, Clock } from '../../../node_modules/three/build/three.module.js';

/* Shader modules from threejs examples */
import { EffectComposer } from '../../../node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../../../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '../../../node_modules/three/examples/jsm/postprocessing/ShaderPass.js';

/* SHADER */
import { VERTEX, FRAGMENT } from '../Shader/PostEffect.js';

const PostEffect = function (w_, h_, renderer, scene, camera) {

	this.resolution = new Vector2(w_, h_);

	this.clock = new Clock();

	this.drawShader = {
		uniforms: {
			tDiffuse: {
				type: "t",
				value: null
			},
			iResolution: {
				type: "v2",
				value: this.resolution
			},
			iGlobalTime: {
				type: "f",
				value: 0.01
			},
			iMagnitude: {
				type: "f",
				value: 0.005
			}
		},
		vertexShader: VERTEX,
		fragmentShader: FRAGMENT
	};

	this.composer = new EffectComposer(renderer);
	this.composer.addPass(new RenderPass(scene, camera));

	this.pass = new ShaderPass(this.drawShader);
	this.pass.renderToScreen = true;
	this.composer.addPass(this.pass);

	this.run = function (volume) {
		this.pass.uniforms.iGlobalTime.value = this.clock.getElapsedTime();
		this.pass.uniforms.iMagnitude.value = volume * 0.1;
		this.composer.render();
	}

}

export { PostEffect };
