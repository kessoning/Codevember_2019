self.onmessage = function (e) {

    if (e.data !== undefined) {

        var shp_pos = [];
        var shp_col = [];
        var shp_noises = [];
        var shp_noise_val = [];
        var shp_micronoise_val = [];
        var shp_angles = [];
        var shp_id = [];

        var shp_nx = 0;
        var shp_mnx = 0;

        var shp_index = 1;

        var shp_w = e.data.shp_pn;
        var shp_h = e.data.shp_pn;

        for (let x = 0; x < shp_w; x++) {

            let shp_ny = 0;
            let shp_mny = 0;

            let shp_a = (x / shp_w) * (Math.PI);
            let shp_a2 = (x / shp_w) * (Math.PI * 2);

            for (var y = 0; y < shp_h; y++) {

                let shp_b = (y / shp_h) * (Math.PI * 2);

                shp_nx = Math.sin(shp_a);
                shp_ny = Math.sin(shp_b);

                let shp_x = (x * 2) - (shp_w * 1);
                let shp_y = 0;
                let shp_z = (y * 2) - (shp_h * 1);

                shp_y += -500 + (Math.random() * 1000.0);

                if (e.data.mobile) {
                    shp_pos.push(shp_x * e.data.m);
                    shp_pos.push(shp_y);
                    shp_pos.push(shp_z * (e.data.m * 0.25));
                } else {
                    shp_pos.push(shp_x * (e.data.m * 1));
                    shp_pos.push(shp_y);
                    shp_pos.push(shp_z * e.data.m);
                }

                shp_angles.push(Math.cos(shp_b) * Math.cos(shp_a2));
                shp_angles.push(Math.sin(shp_b) * Math.cos(shp_a2));
                shp_angles.push(Math.sin(shp_a2));

                shp_id.push(shp_index);
                shp_index++;

                shp_col.push(1.0);
                shp_col.push(1.0);
                shp_col.push(1.0);
                shp_col.push(1.0);

                shp_noises.push(Math.random() * 0.000025);

                shp_noise_val.push(shp_nx);
                shp_noise_val.push(shp_ny);

                shp_micronoise_val.push(shp_mnx);
                shp_micronoise_val.push(shp_mny);

                shp_ny += 0.001;
                shp_mny += 0.05;

            }

            shp_nx += 0.001;
            shp_mnx += 0.05;

        }

        var ps_pos = [];
        var ps_col = [];
        var ps_noises = [];
        var ps_phase = [];
        var ps_id = [];

        var ps_index = 1;

        var ps_w = e.data.ps_pn;
        var ps_h = e.data.ps_pn;

        /* The particle system */

        for (let x = 0; x < ps_w; x++) {

            for (let y = 0; y < ps_h; y++) {

                let ps_x = (x * 2) - (ps_w * 1);
                let ps_y = -500 + (Math.random() * 1000.0);
                let ps_z = (y * 2) - (ps_h * 1);

                if (e.data.mobile) {
                    ps_pos.push(ps_x * e.data.m);
                    ps_pos.push(ps_y);
                    ps_pos.push(ps_z * (e.data.m * 0.25));
                } else {
                    ps_pos.push(ps_x * (e.data.m * 1));
                    ps_pos.push(ps_y);
                    ps_pos.push(ps_z * e.data.m);
                }

                ps_id.push(ps_index);
                ps_index++;

                ps_col.push(1.0);
                ps_col.push(1.0);
                ps_col.push(1.0);
                ps_col.push(1.0);

                ps_noises.push(Math.random() * 0.000025);

                ps_phase.push(100000.0 + (Math.random() * (Math.PI * 2.0)));

            }

        }

        var result = {
            shp_p: shp_pos,
            shp_n: shp_noises,
            shp_c: shp_col,
            shp_nx: shp_noise_val,
            shp_mnx: shp_micronoise_val,
            shp_s_a: shp_angles,
            shp_id: shp_id,
            ps_p: ps_pos,
            ps_c: ps_col,
            ps_n: ps_noises,
            ps_i: ps_phase,
            ps_id: ps_id,
        };

        this.postMessage(result);
    }

}
