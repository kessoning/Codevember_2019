/* Red Sphere */

import { BufferGeometry, Float32BufferAttribute, RawShaderMaterial, Line, DoubleSide, DynamicDrawUsage } from '../../../node_modules/three/build/three.module.js';

import { shape_vertex, shape_fragment } from '../Shaders/Shaders.js';

const Shape = function (a, r, t, p, is_red, e) {
    
    this.geometry = new BufferGeometry();

    console.log(e);

    this.geometry.setAttribute('position', new Float32BufferAttribute(e.data.shp_p, 3).setUsage(DynamicDrawUsage));
    this.geometry.setAttribute('color', new Float32BufferAttribute(e.data.shp_c, 4).setUsage(DynamicDrawUsage));
    this.geometry.setAttribute('noise', new Float32BufferAttribute(e.data.shp_n, 1).setUsage(DynamicDrawUsage));
    this.geometry.setAttribute('noise_value', new Float32BufferAttribute(e.data.shp_nx, 2).setUsage(DynamicDrawUsage));
    this.geometry.setAttribute('micronoise_value', new Float32BufferAttribute(e.data.shp_mnx, 2).setUsage(DynamicDrawUsage));
    this.geometry.setAttribute('angle', new Float32BufferAttribute(e.data.shp_s_a, 3).setUsage(DynamicDrawUsage));
    this.geometry.setAttribute('vID', new Float32BufferAttribute(e.data.shp_id, 1).setUsage(DynamicDrawUsage));

    this.material = new RawShaderMaterial({
        
        uniforms: {
            time:       { value: 0.0        },
            u_time:     { value: 0.0        },
            radius:     { value: 150.0      },
            alpha:      { value: a          },
            radius:     { value: r          },
            uAudio:     { value: t          },
            maxID:      { value: p          },
            isRed:      { value: is_red,    },
        },
        vertexShader: shape_vertex,
        fragmentShader: shape_fragment,
        side: DoubleSide,
        transparent: true,
        depthTest: true,
        depthWrite: true,
        vertexColors: true,
    });

    this.sphere = new Line(this.geometry, this.material);

    this.update = function (fa, pfm, pt, fls, nf, t) {

        if (fls) {

            if (nf % 4 > 1) this.sphere.material.uniforms.alpha.value = fa;
                
            else this.sphere.material.uniforms.alpha.value = 0.0;

        } else {

            this.sphere.material.uniforms.alpha.value = fa;

        }

        this.sphere.material.uniforms.time.value = pfm + pt;
        this.sphere.material.uniforms.u_time.value = pfm;
        this.sphere.material.uniforms.uAudio.value = t;
        this.sphere.material.needsUpdate = true;
        this.sphere.material.elementsNeedUpdate = true;

    }

}

export { Shape };
