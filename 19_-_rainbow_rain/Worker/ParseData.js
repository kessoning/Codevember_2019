self.onmessage = function (e) {

    if (e.data !== undefined) {

        // Add all the arrays to pass to the shader

        var pos = [];   // position
        var col = [];   // color
        var noises = [];    // noise values
        var move = [];  // if on the land or moving in the air
        var phase = []; // the phase to move

        var noise_val = []; // other noise values, this time for 2D noise

        var micronoise_val = [];    // Micronoise, another layer of noise

        var fades = []; // Speed of fading of particles

        var nx = 0; // first dimension of noise to pass to particles
        var mnx = 0;    // micrnoise, first dimension

        var w = e.data.pn;  // particles number, power 2
        var h = e.data.pn;

        for (var x = 0; x < w; x++) {

            var ny = 0;
            var mny = 0;

            var a = (x / w) * (Math.PI);

            for (var y = 0; y < h; y++) {

                var m = 0.0;

                var b = (y / h) * (Math.PI * 1);

                // Seamless noise
                nx = Math.sin(a);
                ny = Math.sin(b);

                var _x = (x * 2) - (w * 1);
                var _y = 0;
                var _z = (y * 2) - (h * 1);

                move.push(m);

                // 3 values, x, y, z, for particle position
                // If it is a mobile device, the x position needs to be smaller
                if (e.data.mobile) {
                    pos.push(_x * e.data.m);
                    pos.push(_y);
                    pos.push(_z * (e.data.m * 0.75));
                } else {
                    pos.push(_x * (e.data.m * 1));
                    pos.push(_y);
                    pos.push(_z * e.data.m);
                }

                // colors RGBA
                col.push(1.0);
                col.push(1.0);
                col.push(1.0);
                col.push(1.0);

                // Noise
                noises.push(Math.random() * 0.000025);
                
                // Fade speed
                fades.push(Math.random() * 0.1);

                // 2D noise
                noise_val.push(nx);
                noise_val.push(ny);

                // 2D noises
                micronoise_val.push(mnx);
                micronoise_val.push(mny);

                // Phase, for the noise function
                phase.push(100000.0 + (Math.random() * (Math.PI * 2.0)));

                if (Math.random() > 0.95) {
                    m = 1.0;
                    _y += Math.random() * 1000.0;

                    move.push(m);

                    fades.push(Math.random() * 0.1);

                    if (e.data.mobile) {
                        pos.push(_x * e.data.m);
                        pos.push(_y);
                        pos.push(_z * (e.data.m * 0.25));
                    } else {
                        pos.push(_x * (e.data.m * 1));
                        pos.push(_y);
                        pos.push(_z * e.data.m);
                    }

                    col.push(1.0);
                    col.push(1.0);
                    col.push(1.0);
                    col.push(1.0);

                    noises.push(Math.random() * 0.000025);

                    noise_val.push(nx);
                    noise_val.push(ny);

                    micronoise_val.push(mnx);
                    micronoise_val.push(mny);

                    phase.push(100000.0 + (Math.random() * (Math.PI * 2.0)));

                }

                ny += 0.01;
                mny += 0.1;

            }

            nx += 0.01;
            mnx += 0.1;

        }

        var result = {
            p: pos,
            n: noises,
            c: col,
            m: move,
            i: phase,
            nx: noise_val,
            mnx: micronoise_val,
            f: fades,
        };

        // When the worker is ready, pas the data to the main sketch that called it
        this.postMessage(result);
    }

}