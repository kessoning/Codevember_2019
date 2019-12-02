import {
    PlaneBufferGeometry,
    TextureLoader,
    RepeatWrapping,
    MeshPhongMaterial,
    Mesh,
    PointLight
} from '../../../node_modules/three/build/three.module.js';

const geo = new PlaneBufferGeometry(20000, 20000, 8, 8);
const loader = new TextureLoader();

const texture = loader.load('../../../assets/floor_texture.jpg', function (texture) {

    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.offset.set(0, 0);
    texture.repeat.set(10, 10);

});

const mat = new MeshPhongMaterial({
    color: 0xffffff,
    specular: 0x111111,
    shininess: 10,
    map: texture
});

const Floor = new Mesh(geo, mat);
Floor.rotateX(-Math.PI / 2);

// Lights
const Light = new PointLight(0x555555, 1, 3000, 2);
Light.position.set(0, 2000, 0);

// red light, connected to the red particle system
const Red_Light = new PointLight(0xDE0000, .5, 4000, 2);
Red_Light.position.set(0, 3000, 0);

export {
    Floor,
    Light,
    Red_Light
};