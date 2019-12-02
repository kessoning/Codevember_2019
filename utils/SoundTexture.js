import {
    DataTexture,
    RGBFormat,
    FloatType,
    NearestFilter
} from '../node_modules/three/build/three.module.js';

import {
    ImprovedNoise
} from '../libs/ImprovedNoise.js';

const SoundTexture = function (w_, h_) {

    this.s_w = w_
    this.s_h = h_;
    this.s_data = new Float32Array(this.s_w * this.s_h * 3);

    this.perlin = new ImprovedNoise();

    this.kick_value = 0;
    this.is_kicked = false;
    this.time_kick = 0;

    for (let i = 0; i < this.s_data.length; i++) {
        this.s_data[i] = 0.0;
    }

    this.texture = new DataTexture(this.s_data, this.s_w, this.s_h, RGBFormat, FloatType);
    this.texture.minFilter = NearestFilter;
    this.texture.magFilter = NearestFilter;
    this.texture.needsUpdate = true;

    this.update = function (frequencies, time, volume) {

        if (frequencies[3] - this.kick_value > 15) {
            this.is_kicked = true;
            this.time_kick = time;
        }

        this.noise = 0.5 + (this.perlin.noise(time*0.001, 0, 0) * 0.5);
        // console.log(noise);

        if (this.is_kicked) {

            let index = this.texture.image.data.length - (this.s_w * 3);

            for (let i = 0; i < this.s_w; i++) {
                let f = (frequencies[i] / 255.0) * volume;
                this.texture.image.data[index + 0] = f;
                this.texture.image.data[index + 1] = f / 10.0; //0.0;
                this.texture.image.data[index + 2] = this.noise * Math.PI;//f / 10.0//0.0;
                index += 3;
            }

            for (let j = 0; j < this.texture.image.data.length; j++) {
                this.texture.image.data[j] = this.texture.image.data[j + (this.s_w * 3)];
            }

        } else {

            let index = this.texture.image.data.length - (this.s_w * 3);

            for (let i = 0; i < this.s_w; i++) {
                let f = (frequencies[i] / 255.0) * volume;
                this.texture.image.data[index + 0] = f;
                this.texture.image.data[index + 1] = f; //0.0;
                this.texture.image.data[index + 2] = this.noise * Math.PI//f; //0.0;
                index += 3;
            }

            for (let j = 0; j < this.texture.image.data.length; j++) {
                this.texture.image.data[j] = this.texture.image.data[j + (this.s_w * 3)];
            }
        }

        if (time - this.time_kick > 200) {
            this.is_kicked = false;
        }
        
        this.kick_value = frequencies[3];

        this.texture.needsUpdate = true;
    }
}

export {
    SoundTexture
};