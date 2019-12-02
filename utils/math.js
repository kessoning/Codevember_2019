const PI = 3.14159265358;
const TWO_PI = PI * 2;
const HALF_PI = PI / 2;
const QUARTER_PI = PI / 4;

// "Stolen" from P5.js
// https://github.com/processing/p5.js/blob/0.10.2/src/math/calculation.js#L273
function lerp(start, stop, amt) {
    return amt * (stop - start) + start;
};

/* https://github.com/processing/p5.js/blob/0.10.2/src/math/calculation.js#L416 */
function map(n, start1, stop1, start2, stop2, withinBounds) {
    const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
    if (!withinBounds) {
        return newval;
    }
    // if (start2 < stop2) {
    //     return this.constrain(newval, start2, stop2);
    // } else {
    //     return this.constrain(newval, stop2, start2);
    // }
};

 /* Limit function
  ** ported from p5js
  ** https://github.com/processing/p5.js/blob/master/src/math/p5.Vector.js#L512
  */
 function limit(vector, max) {
    const mSq = vector.x * vector.x + vector.y * vector.y + vector.z * vector.z;
    if (mSq > max) {
        vector.divideScalar(Math.sqrt(mSq)); //normalize it
        vector.multiplyScalar(max);
    }
    return vector;
};

/**
* HSV to RGB color conversion
* From https://gist.github.com/eyecatchup/9536706
*
* H runs from 0 to 360 degrees
* S and V run from 0 to 100
*
* Ported from the excellent java algorithm by Eugene Vishnevsky at:
* http://www.cs.rit.edu/~ncs/color/t_convert.html
*/
function hsvToRgb(h, s, v) {
    var r, g, b;
    var i;
    var f, p, q, t;

    // Make sure our arguments stay in-range
    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    v = Math.max(0, Math.min(100, v));

    // We accept saturation and value arguments from 0 to 100 because that's
    // how Photoshop represents those values. Internally, however, the
    // saturation and value are calculated from a range of 0 to 1. We make
    // That conversion here.
    s /= 100;
    v /= 100;

    if (s == 0) {
        // Achromatic (grey)
        r = g = b = v;
        return [
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255)
        ];
    }

    h /= 60; // sector 0 to 5
    i = Math.floor(h);
    f = h - i; // factorial part of h
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));

    switch (i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;

        case 1:
            r = q;
            g = v;
            b = p;
            break;

        case 2:
            r = p;
            g = v;
            b = t;
            break;

        case 3:
            r = p;
            g = q;
            b = v;
            break;

        case 4:
            r = t;
            g = p;
            b = v;
            break;

        default: // case 5:
            r = v;
            g = p;
            b = q;
    }

    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
    ];
}

/* RGB to HEX
 *
 * From https://campushippo.com/lessons/how-to-convert-rgb-colors-to-hexadecimal-with-javascript-78219fdb
 *
 */

function rgbToHex(rgb) {
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
};

function fullColorHex(r, g, b) {
    var red = rgbToHex(r);
    var green = rgbToHex(g);
    var blue = rgbToHex(b);
    return red + green + blue;
};


/* SUPERFORMULA */
var supershape = function(theta, m, n1, n2, n3) {
    let t1 = Math.abs(Math.cos(m * theta / 4));
    t1 = Math.pow(t1, n2);

    let t2 = Math.abs(Math.sin(m * theta / 4));
    t2 = Math.pow(t2, n3);

    let t3 = t1 + t2;
    let r = Math.pow(t3, -1 / n1);

    return r;
}

/* Export modules */
export { 
    PI,
    TWO_PI,
    HALF_PI,
    QUARTER_PI,
    lerp,
    limit,
    hsvToRgb,
    map,
    fullColorHex,
    supershape
}
