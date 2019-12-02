import {
    Geometry,
    PointsMaterial,
    AdditiveBlending,
    Vector3,
    Points
} from '../../../node_modules/three/build/three.module.js';

import {
    TWO_PI
} from '../../../utils/math.js';

import {
    ImprovedNoise
} from '../../../libs/ImprovedNoise.js';

const ParticleSystem = function(pc) {

    this.perlin = new ImprovedNoise();

    this.nx = Math.random();

    this.radius = [];
    this.noise = [];
    this.angles = [];

    // create the particle variable
    this.particlesCount = pc;
    this.particles = new Geometry();

    this.material = new PointsMaterial({
        color: 0x537881,
        transparent: true,
        opacity: 0.2,
        sizeAttenuation: true,
        blending: AdditiveBlending,
        depthTest: false,
        size: 1
    });

    let ny = 0;

    for (let i = 0; i < this.particlesCount; i++) {

        let lat = (i / this.particlesCount) * Math.PI;

        for (let j = 0; j < this.particlesCount; j++) {

            let lon = (j / this.particlesCount) * TWO_PI;

            let noisx = Math.sin(i / this.particlesCount * Math.PI) * 2;
            let noisy = Math.sin(j / this.particlesCount * Math.PI) * 2;

            this.noise.push(new Vector3(noisx, noisy, 0));

            let r = 300 + Math.random() * 20;

            this.radius.push(r);

            let v = r;
            let n = Math.abs(this.perlin.noise(this.nx, ny));
            let vn = v * n;

            let angle_x = Math.sin(lat) * Math.cos(lon);
            let angle_y = Math.sin(lat) * Math.sin(lon);
            let angle_z = Math.cos(lat);

            this.angles.push(new Vector3(angle_x, angle_y, angle_z));

            let px = vn * angle_x;
            let py = vn * angle_y;
            let pz = vn * angle_z;

            // add the particle to the array
            let particle = new Vector3(px, py, pz);
            this.particles.vertices.push(particle);

            ny += 0.002;

        }
    }

    // Create a new particle system with the particles and the material
    this.ParticleSystem = new Points(this.particles, this.material);

    this.update = function() {

        // Move the noise with the master volume
        this.nx += 0.001;

        for (var i = 0, im = this.particlesCount*this.particlesCount; i < im; i++) {
            // get a copy of the particles
            let particle = this.particles.vertices[i];

            // get the new values
            let v = this.radius[i];
            let n = 0.5 + Math.abs(this.perlin.noise(this.noise[i].x, this.noise[i].y, this.nx)); // Apply the noise
            let vn = v * n;

            particle.x = vn * this.angles[i].x;
            particle.y = vn * this.angles[i].y;
            particle.z = vn * this.angles[i].z;
        }

        // flag to the particle system and the lines geometry
        // that we've changed its vertices.
        this.particles.verticesNeedUpdate = true;

    }
}

export {
    ParticleSystem
};