import {
    TextureLoader,
    SphereGeometry,
    MeshBasicMaterial,
    DoubleSide,
    Mesh
} from '../../../node_modules/three/build/three.module.js';

const Firemap = function () {

    this.texture = new TextureLoader().load("./assets/firemap.jpg");
    this.geometry = new SphereGeometry(1200, 20, 20);
    this.material = new MeshBasicMaterial({
        side: DoubleSide,
        map: this.texture,
    });
    this.mesh = new Mesh(this.geometry, this.material);

}

export {
    Firemap
};