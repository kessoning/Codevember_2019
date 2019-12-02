/* Force Texture
 *
 * Stores the values for the maximum force and maximum speed 
 * for the flow field. Didn't have a better name for it.
 * Open to suggestions
 *
 */

import {
    DataTexture,
    RGBFormat,
    FloatType,
    NearestFilter
} from '../../../node_modules/three/build/three.module.js';

const ForceTexture = function (width, minspeed, maxspeed, minforce, maxforce) {

    this.data = new Float32Array(width * width * 3);

    this.zoff = 0.0;

    let index = 0;

    for (let i = 0, total = width * width; i < total; i++) {

        let ms = minspeed + (Math.random() * maxspeed);
        let mf = (minforce + (Math.random() * maxforce));
        this.data[index + 0] = ms;
        this.data[index + 1] = mf;
        this.data[index + 2] = 0.0;

        index += 3;

    }

    this.texture = new DataTexture(this.data, width, width, RGBFormat, FloatType);
    this.texture.minFilter = NearestFilter;
    this.texture.magFilter = NearestFilter;
    this.texture.needsUpdate = true;

    this.update = function () {

        this.zoff += 0.01;

        for (let i = 0, total = this.data.length; i < total; i++) {

            if (i % 3 == 2) this.data[i] = this.zoff;

        }

    }

}

export {
    ForceTexture
};