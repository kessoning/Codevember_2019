/* Flow Field texture
 *
 * Provide the flowfield for the particles to follow
 * Strongly based on the example provided by Daniel Shiffman
 * https://www.youtube.com/watch?v=BjoM9oKOAKY
 *
 */

// Three.js stuff
import {
    DataTexture,
    RGBFormat,
    FloatType,
    NearestFilter,
    Vector2
} from '../../../node_modules/three/build/three.module.js';

// Perlin Noise
import {
    ImprovedNoise
} from '../../../libs/ImprovedNoise.js';

import {
    PI,
    TWO_PI
} from '../../../utils/math.js';

const FlowField = function (rs, w_, h_) {

    this.noise = [];

    this.positions = [];

    this.resolution = rs;

    this.cols = Math.floor(w_ / this.resolution);

    if (this.cols % 2 == 1) this.cols++; // check if texture is power of two

    this.rows = Math.floor(this.cols / 2);

    /* Check if the height of the texture is power of two
     * If not, add 2 cells to the width and try again */
    while (this.rows % 2 == 1) {
        this.cols += 2;
        this.rows = Math.floor(this.cols / 2);
    }

    this.perlin = new ImprovedNoise();

    // 3rd dimension of the Perlin noise: time!
    this.zoff = 0.0;

    /* Faking the seed of the noise */
    this.seed = Math.random() * 10000;

    this.init = function () {

        this.field = new Float32Array(this.cols * this.rows * 3);

        let index = 0;

        let xoff = 0.0;

        for (let i = 0; i < this.cols; i++) {

            let yoff = 0.0;

            for (let y = 0; y < this.rows; y++) {

                let n = this.perlin.noise(xoff + this.seed, yoff + this.seed, this.zoff);
                let xnoise = Math.cos(n) * TWO_PI;
                let ynoise = Math.sin(n) * TWO_PI;

                this.field[index++] = xnoise;
                this.field[index++] = ynoise;
                this.field[index++] = 0.0;

                this.noise.push(new Vector2(xoff + this.seed, yoff + this.seed));

                yoff += 0.05;

            }

            xoff += 0.05;

        }

        this.texture = new DataTexture(this.field, this.cols, this.rows, RGBFormat, FloatType);
        this.texture.minFilter = NearestFilter;
        this.texture.magFilter = NearestFilter;
        this.texture.needsUpdate = true;

    };

    this.update = function () {

        let index = 0;
        let nindex = 0;

        for (let i = 0; i < this.cols; i++) {

            for (let y = 0; y < this.rows; y++) {

                let n = this.zoff + ((1.0 + this.perlin.noise(this.noise[nindex].x, this.noise[nindex].y, this.zoff)) / 2) * TWO_PI;

                let xnoise = Math.cos(n);
                let ynoise = Math.sin(n);

                this.texture.image.data[index + 0] = xnoise;
                this.texture.image.data[index + 1] = ynoise;
                this.texture.image.data[index + 2] = 0.0;

                index += 3;
                nindex++;

            }

        }

        this.zoff += 0.004;

        this.texture.needsUpdate = true;

    }

}

export {
    FlowField
};