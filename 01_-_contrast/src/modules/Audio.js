import { VolumeMeter } from './VolumeMeter.js';
const volume = new VolumeMeter();

// success callback when requesting audio input stream
const Audio = function () {
    
    this.gotStream = (stream) => {
        //window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();;

        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 2048;

        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);

        this.frequencies = new Uint8Array(this.analyser.frequencyBinCount);

        // Create an AudioNode from the stream.
        this.source = this.audioCtx.createMediaStreamSource(stream);

        // Connect it to the destination to hear yourself (or any other node for processing!)
        this.source.connect(this.analyser);

        // volume meter, from https://ourcodeworld.com/articles/read/413/how-to-create-a-volume-meter-measure-the-sound-level-in-the-browser-with-javascript
        this.meter = volume.createAudioMeter(this.audioCtx);
        this.source.connect(this.meter);
    }

    this.init = function() {
        return new Promise((resolve, reject) => {
            navigator.getUserMedia = navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia;
            navigator.getUserMedia({
                audio: true
            }, this.gotStream, function () {
                console.warn("Error getting audio stream from getUserMedia")
            });
            return resolve();
        });
    }

    this.update = function() {
        if (this.analyser != null) {
            // get the waveform
            this.analyser.getByteTimeDomainData(this.dataArray);
            // get the frequencies
            this.analyser.getByteFrequencyData(this.frequencies);
        }
    }

}

export { Audio };
