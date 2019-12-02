import {
    Group,
    BufferGeometry,
    BufferAttribute,
    LineBasicMaterial,
    LineSegments,
    VertexColors,
    AdditiveBlending,
    DynamicDrawUsage,
    Vector2,
    Vector3
} from '../../../node_modules/three/build/three.module.js';

import { ImprovedNoise } from '../../../libs/ImprovedNoise.js';

const Sphere = function () {

    this.particles_data = [];
    this.red_particles_data = [];
    this.max_particle_count = 500;
    this.max_loop = parseInt(Math.sqrt(this.max_particle_count));
    this.particles_count = 500;
    this.radius = 400;
    this.radius_half = this.radius / 2;
    this.red_max_distance = 600;
    this.noise_amount_x = 0.001 + (Math.random() * 0.2);
    this.noise_amount_y = this.noise_amount_x / 2;
    this.noisez = 0;
    this.perlin = new ImprovedNoise();

    this.init = function () {

        this.group = new Group();

        var segments = this.particles_count * this.particles_count;

        this.particles_positions = new Float32Array(segments * 3);
        this.red_particles_positions = new Float32Array(segments * 3);

        this.vertices = new Float32Array(segments * 3);
        this.red_vertices = new Float32Array(segments * 3);

        this.colors = new Float32Array(segments * 3);
        this.red_colors = new Float32Array(segments * 3);

        this.geometry = new BufferGeometry();
        this.geometry.setAttribute('position', new BufferAttribute(this.vertices, 3).setUsage(DynamicDrawUsage));
        this.geometry.setAttribute('color', new BufferAttribute(this.colors, 3).setUsage(DynamicDrawUsage));
        this.geometry.computeBoundingSphere();
        this.geometry.setDrawRange(0, segments);

        this.material = new LineBasicMaterial({
            vertexColors: VertexColors,
            blending: AdditiveBlending,
            transparent: true
        });

        this.lines_mesh = new LineSegments(this.geometry, this.material);

        this.group.add(this.lines_mesh);

        this.init_vertices();

    }

    this.init_vertices = function () {

        this.noise_values = [];
        this.angles = [];

        this.update = function (max_distance, mic_sensitivity, frequencies, data_array) {

            let _index = 0;
            this.red_max_distance = max_distance * 2;

            let TWO_PI = Math.PI * 2;

            for (let i = 0; i < this.max_loop; i++) {

                let a = (i / this.max_loop) * TWO_PI;

                let half_a = (i / this.max_loop) * Math.PI;

                for (let j = 0; j < this.max_loop; j++) {

                    let b = (j / this.max_loop) * Math.PI;

                    let half_b = (j / this.max_loop) * Math.PI;

                    let nx = Math.abs(Math.sin(half_a));
                    let ny = Math.abs(Math.sin(half_b));

                    let vn, vn2;

                    this.noise_values.push(new Vector2(nx, ny));

                    if (frequencies != undefined) {
                        var v = this.radius + (data_array[j] * mic_sensitivity);
                        vn = v * (0.5 + Math.abs(this.perlin.noise(nx, ny, this.noisez)));
                    } else {
                        vn = this.radius * (0.5 + Math.abs(this.perlin.noise(nx, ny, this.noisez)));
                        vn = 0;
                    }

                    var angle_x = Math.sin(a) * Math.cos(b);
                    var angle_y = Math.sin(a) * Math.sin(b);
                    var angle_z = Math.cos(a);

                    this.angles.push(new Vector3(angle_x, angle_y, angle_z));

                    let x = vn * angle_x;
                    let y = vn * angle_y;
                    let z = vn * angle_z;

                    this.particles_positions[_index + 0] = x;
                    this.particles_positions[_index + 1] = y;
                    this.particles_positions[_index + 2] = z;

                    _index += 3;

                }

            }

        }

    }

    this.update = function (max_distance, mic_sensitivity, frequencies, data_array) {

        let gl_Index = 0;
        this.red_max_distance = max_distance * 2;

        let index = 0;

        for (let i = 0; i < this.max_loop; i++) {

            for (let j = 0; j < this.max_loop; j++) {
                
                let vn, vn2;
                
                let nx = this.noises[index].x;
                let ny = this.noises[index].y;

                let angle_x = this.angles[index].x;
                let angle_y = this.angles[index].y;
                let angle_z = this.angles[index].z;

                if (frequencies != undefined) {
                    var v = this.radius + (data_array[j] * mic_sensitivity);
                    vn = v * (0.5 + Math.abs(this.perlin.noise(nx, ny, this.noisez)));
                } else {
                    vn = this.radius * (0.5 + Math.abs(this.perlin.noise(nx, ny, this.noisez)));
                    vn = 0;
                }

                let x = vn * angle_x;
                let y = vn * angle_y;
                let z = vn * angle_z;

                this.particles_positions[gl_Index + 0] = x;
                this.particles_positions[gl_Index + 1] = y;
                this.particles_positions[gl_Index + 2] = z;

                gl_Index += 3;
                
                index++;

            }

        }

    }

    this.animate = function (max_distance, mic_sensitivity, frequencies, data_array, volume) {

        this.max_loop = parseInt(Math.sqrt(this.particles_count));

        this.update(max_distance, mic_sensitivity, frequencies, data_array);

        let vertex_pos = 0;
        let color_pos = 0;
        let num_connected = 0;

        for (let i = 0; i < this.particles_count; i++) {

            for (let j = i + 1; j < this.particles_count; j++) {

                let dx = this.particles_positions[i * 3 + 0] - this.particles_positions[j * 3 + 0];
                let dy = this.particles_positions[i * 3 + 1] - this.particles_positions[j * 3 + 1];
                let dz = this.particles_positions[i * 3 + 2] - this.particles_positions[j * 3 + 2];

                let dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < max_distance) {

                    let alpha = 0.1 - (dist / max_distance) * 0.1;

                    this.vertices[ vertex_pos++ ] = this.particles_positions[i * 3 + 0];
                    this.vertices[ vertex_pos++ ] = this.particles_positions[i * 3 + 1];
                    this.vertices[ vertex_pos++ ] = this.particles_positions[i * 3 + 2];

                    this.vertices[ vertex_pos++ ] = this.particles_positions[j * 3 + 0];
                    this.vertices[ vertex_pos++ ] = this.particles_positions[j * 3 + 1];
                    this.vertices[ vertex_pos++ ] = this.particles_positions[j * 3 + 2];

                    let col = (alpha) * (0.1 + volume * 5);

                    this.colors[ color_pos++ ] = col;
                    this.colors[ color_pos++ ] = col;
                    this.colors[ color_pos++ ] = col;

                    this.colors[ color_pos++ ] = col;
                    this.colors[ color_pos++ ] = col;
                    this.colors[ color_pos++ ] = col;

                    num_connected++;
                }

            }
        }

        this.lines_mesh.geometry.setDrawRange(0, num_connected);
        this.lines_mesh.geometry.attributes.position.needsUpdate = true;
        this.lines_mesh.geometry.attributes.color.needsUpdate = true;

        this.noisez += volume * 0.1;

    }
}

export { Sphere };
