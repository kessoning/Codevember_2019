importScripts('ImprovedNoise.js');
// importScripts('https://cdnjs.cloudflare.com/ajax/libs/three.js/99/three.min.js');

self.onmessage = function (e) {

    if (e.data !== undefined) {

        var perlin = new ImprovedNoise();

        var ps;

        var pos = [];
        var col = [];
        var noises = [];
        var move = [];
        var phase = [];

        var rad = [];

        var angles = [];

        var noise_val = [];

        var micronoise_val = [];

        var fades = [];

        var suv = [];

        var nx = 0;
        var mnx = 0;

        var w = e.data.pn;
        var h = e.data.pn;

        const HALF_PI = Math.PI / 2;
        const PI = Math.PI;
        const TWO_PI = Math.PI * 2;

        const supershape = function (theta, m, n1, n2, n3) {
            let t1 = Math.abs(Math.cos(m * theta / 4));
            t1 = Math.pow(t1, n2);

            let t2 = Math.abs(Math.sin(m * theta / 4));
            t2 = Math.pow(t2, n3);

            let t3 = t1 + t2;
            let r = Math.pow(t3, -1 / n1);

            return r;
        }

        const m1 = Math.random() * 10;
        const n11 = Math.random();
        const n12 = Math.random();
        const n13 = Math.random();
        const m2 = Math.random() * 16;
        const n21 = Math.random() * 100;
        const n22 = Math.random() * 100;
        const n23 = Math.random() * 100;

        var rddd = 0;

        for (var x = 0; x < w; x++) {

            var ny = 0;
            var mny = 0;

            var a = -HALF_PI + ((x / w) * PI);
            var an = (x / w) * PI;

            var r1 = supershape(a, m1, n11, n12, n13);

            for (var y = 0; y < h; y++) {

                // suv.push(x / w);
                // suv.push((h - y) / h);
                suv.push((w - x) / w);
                suv.push(y / h);

                var r2 = supershape(b, m2, n21, n22, n23);

                var m = 0.0;

                var b = -PI + ((y / h) * TWO_PI);
                var bn = (y / h) * PI;

                var r = 200;

                nx = Math.sin(an);
                ny = Math.sin(bn);

                angles.push(Math.cos(a));// * Math.cos(a));
                angles.push(Math.sin(a));// * Math.cos(a));
                angles.push(0);

                // angles.push(x);//Math.cos(b));
                // angles.push(y);//Math.sin(b));
                // angles.push(rddd++);

                var xa = r * r1 * r2;
                if (xa === 0 && y === 0) xa = 0.0;
                var ya = r * r1 * r2;
                if (ya === 0 && y === 0) ya = 0.0;
                var za = r * r2;
                if (za === 0 && y === 0) za = 0.0;

                if (x != 0 || y != 0) {
                    rad.push(xa);
                    rad.push(ya);
                    rad.push(za);
                } else {
                    rad.push(0.0);
                    rad.push(0.0);
                    rad.push(0.0);
                }

                // var _x = r * Math.cos(b*2) * Math.cos(a);
                // var _y = r * Math.sin(b*2) * Math.cos(a);
                // var _z = r * Math.sin(a);

                var _x = r * Math.cos(a);
                var _y = r * Math.sin(a);
                var _z = -(y * (h / 100)); //r * Math.sin(a);//(y * 2) - (h * 1)  * r;// * (e.data.m * 0.25);

                move.push(m);

                pos.push(_x);
                pos.push(_y);
                pos.push(_z);

                col.push(1.0);
                col.push(1.0);
                col.push(1.0);
                col.push(1.0);

                noises.push(Math.random() * 0.000025);
                fades.push(Math.random() * 0.1);

                noise_val.push(nx);
                noise_val.push(ny);

                micronoise_val.push(mnx);
                micronoise_val.push(mny);

                phase.push(100000.0 + (Math.random() * (Math.PI * 2.0)));

                if (Math.random() > 10.95) {

                    suv.push(x / w);
                    suv.push(y / h);

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

                    angles.push(Math.cos(b) * Math.cos(a));
                    angles.push(Math.sin(b) * Math.cos(a));
                    angles.push(Math.sin(a));

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

        console.log(rad);

        var result = {
            p: pos,
            n: noises,
            c: col,
            m: move,
            i: phase,
            nx: noise_val,
            mnx: micronoise_val,
            a: angles,
            f: fades,
            s: suv,
            rd: rad
        };

        this.postMessage(result);
    }

}

// self.onmessage = function(e) {
//     // console.log("E " + e.data);

//     // Do all the work here the postMessage the result
//     var result = 10 + e.data;
//     console.log("result: " + result);
//     self.postMessage(result)
//   }
