if (Meteor.isClient) {


    //// Create a new audio context. This represents a set of AudioNode objects and their connections.
    var
        ctx = new (window.AudioContext || window.webkitAudioContext)() // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext.decodeAudioData

      , bufferAudio = function (url) {

            //// Use XHR to load audio from ‘public/flora/’.
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            request.onerror = function () {
                console.log('audio.js:bufferAudio() load error');
            }
            request.onload = function (event) {

                //// Use `decodeAudioData()` to decode the MP3 into a buffer. // @todo update to promise-based syntax, when browsers support it
                ctx.decodeAudioData(
                    request.response // ArrayBuffer
                  , function (buffer) { // DecodeSuccessCallback
                        // source.buffer = buffer;
                        // source.connect(ctx.destination);
                        // source.loop = true;
                        // source.start(0);
                        playLoop('Ee..AaDd....AaDdEe..Aa..Bb..Cc..', buffer);
                        // playLoop('e...a.......a...e...a...b...c...', buffer);
                        // playLoop('...A', buffer);
                    }
                  , function (error) { // DecodeErrorCallback
                        console.log('audio.js:bufferAudio() decode error' + error.err);
                    }
                );
            };
            request.send();
        }

      , audioMap = {
            A: 0
          , a: 1
          , B: 2
          , b: 3
          , C: 4
          , c: 5
          , D: 6
          , d: 7
          , E: 8
          , e: 9
        }

      , playLoop = function (pattern, src) { // `pattern` is a string, eg 'Bb..Aa..b.a.Aa..', and `src` is an `AudioBuffer` object
            // pattern = '....' + pattern; // @todo fix rough start
            console.log(pattern);
            console.log('sampleRate;', src.sampleRate, 'length;', src.length, 'duration;', src.duration, 'numberOfChannels;', src.numberOfChannels);
            var i, j, srcChannel, destChannel, code, offset, source
              , l = pattern.length
              , numberOfChannels = src.numberOfChannels
              , pitch = 1 // @todo user pref?
              , sampleRate = src.sampleRate * pitch
              , grid = 5400 * numberOfChannels // @todo test whether this really should be ` * numberOfChannels`, or whether it’s really `* 2` whetever the channel-count
              , dest = ctx.createBuffer(numberOfChannels, pattern.length * grid, sampleRate) // http://stackoverflow.com/a/14148125
            ;

            //// 
            for (i=0; i<numberOfChannels; i++) {
                srcChannel  = src.getChannelData(i);  // returns a Float32Array
                destChannel = dest.getChannelData(i); // returns a Float32Array
                for (j=0; j<l; j++) {
                    code = pattern.charAt(j);
                    if ('.' === code) { continue; } // silence
                    offset = audioMap[code] * grid;
// console.log(i, j, j * grid, code, offset, offset + grid);
                    destChannel.set(
                        srcChannel.subarray(offset, offset + grid)
                      , j * grid
                    );
                }
            }

            //// 
            source = ctx.createBufferSource();
            source.buffer = dest;
            source.connect(ctx.destination);
            source.loop = true;
            // source.playbackRate.value = 1;
            source.start();
        }
    ;

    //// Xx.
    bufferAudio('/flora/stone-circle-d4168a4.mp3');

}