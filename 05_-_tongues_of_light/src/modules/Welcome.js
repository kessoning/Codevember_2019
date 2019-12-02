/* Console message
 *
 * A message in the console
 * 
 */

const title =
`


Tongues Of Light



`;

const description =
`

My challenge for the Codevember.Date: 5 th of November 2019 Theme: Light.

Made with three.js

Based on another work of mine..seastorm
https: //github.com/KessonDalef/seastorm_webgl

`;

const message = 
`

A WebGL artwork by Giovanni Muzio - Kesson | https://kesson.io 
Oh and by the way, there is no need to check the console for the source code, you can have a look at the code on my Github 
https://github.com/KessonDalef/tongues_of_light


`;

const Welcome = function() {
    if ((window.chrome || window.safari)) {
        let l = 'font-family:Open Sans; font-size:1em; line-height:2em;';
        [
            [title, l + 'font-size:2em; font-weight:bold;'],
            [description, l + 'font-size:1.2em; font-weight:light;'],
            [message, l],
        ].map(function (r) {
            setTimeout(console.log.bind(console, '\n%c' + r[0], r[1]));
        });
    }
}

export { Welcome };
