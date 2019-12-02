import {
    Mesh,
    ShaderMaterial,
    IcosahedronGeometry,
    TextureLoader
} from '../../../node_modules/three/build/three.module.js';

import {
    sphere_vertex,
    sphere_fragment
} from '../Shaders/Shaders.js';

const Sphere = function (r, d) {

    this.material = new ShaderMaterial({
        uniforms: {
            tExplosion: {
                type: 't',
                value: new TextureLoader().load('./assets/texture.png')
            },
            sound: {
                type: 't',
                value: null
            },
            radius: {
                type: 'f',
                value: r / 2.0
            },
            time: {
                type: 'f',
                value: 0.0
            }
        },
        vertexShader: sphere_vertex,
        fragmentShader: sphere_fragment,
    });

    this.mesh = new Mesh(new IcosahedronGeometry(r, d), this.material);

    this.update = function(p, s, r) {
        this.mesh.material.uniforms.sound.value = s
        this.mesh.material.uniforms.time.value = p;
        this.mesh.material.uniforms.radius.value = r;
        this.mesh.material.needsUpdate = true;
        this.mesh.material.elementsNeedUpdate = true;
    }

}

export { Sphere };