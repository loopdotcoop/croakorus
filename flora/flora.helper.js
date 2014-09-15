if (Meteor.isClient) {

    //// Allow any template to use `{{#each flora}}`.
    UI.registerHelper('flora', function() {
        var
            position = Session.get('looptopianPosition') // @todo user db
          , x = position[0]
          , z = position[2]
          , xFar1 = Config.flora.xFloraFar
          , xFar2 = xFar1 * 2
          , xFar4 = xFar1 * 4
          , zFar1 = Config.flora.zFloraFar
          , zFar2 = zFar1 * 2
          , zFar4 = zFar1 * 4

            //// Restrict to nearby small flora, middle-distance medium flora, and all giant flora.
          , selector = { $or: [ // http://docs.mongodb.org/manual/reference/operator/query/or/
                {
                    x: { $gte:x - xFar1, $lt:x + xFar1 }
                  , z: { $gte:z - zFar1, $lt:z + zFar1 }

                //// @todo close gaps under high-mountain flora, and uncomment this operator
                // },{
                //     x: { $gte:x - xFar2, $lt:x + xFar2 }
                //   , z: { $gte:z - zFar2, $lt:z + zFar2 }
                //   , bulk: 10

                //// @todo close gaps under high-mountain flora, and uncomment this operator
                // },{
                //     x: { $gte:x - xFar4, $lt:x + xFar4 }
                //   , z: { $gte:z - zFar4, $lt:z + zFar4 }
                //   , bulk: 100

                //// @todo close gaps under high-mountain flora, and uncomment this operator
                // },{
                //     bulk: 1000
                // }

                //// @todo close gaps under high-mountain flora, and remove this operator
                },{
                    bulk: { $gte:10 }
                }
            ]}
        ;





        var flora, i, l, dx, dz, far, id, source, gainNode
          , ids = {}
          , sources = []
          , sourceLut = {}
          , lowerFloraFar = Math.min(Config.flora.xFloraFar, Config.flora.zFloraFar)
        ;

try { // @todo remove

        //// Xx.
        flora = Flora.find(selector).fetch();

        //// Add some useful data to the fetched `flora` array.
        for (i=0, l=flora.length; i<l; i++) {

            //// Get a handy reference to the Flora’s MongoDB ID.
            id = flora[i]._id;

            //// `far` is the distance between the viewpoint and the center of the Tile which the Flora is on.
            dx = flora[i].x - x + (Config.tiles.xTileSize / 2);
            dz = flora[i].z - z + (Config.tiles.zTileSize / 2);
            far = flora[i].far = Math.sqrt( (dx * dx) + (dz * dz) ); // yay Pythagorus!

            //// Get a reference to the Flora’s `AudioBufferSourceNode` object.
            source = God.flora.sourceLut[id];

            //// If the Flora has newly arrived in local scope. Instantiate `AudioBufferSourceNode` and `GainNode` objects for it.
            if (! source) {
                source = Config.audio.ctx.createBufferSource();
                source.id = id; // @todo ok?
                source.pattern = flora[i].pattern; // @todo ok?
                source.loop = true;

                //// Create a `GainNode`, and connect it between the `AudioBufferSourceNode` and the speakers.
                gainNode = Config.audio.ctx.createGain();
                gainNode.connect(Config.audio.ctx.destination);
                source.connect(gainNode);
                source.gain = gainNode.gain; // allows us to write `source.gain.value = 0.5`

                //// 
                getDecodedAudio(
                    '/flora/stone-circle-d4168a4.mp3'
                  , id
                  , function (decoded, id) {
                        var nowTime, nowFraction, prevZero, nextTime, nowBeat, nextBeat
                          , source = God.flora.sourceLut[id] // regain a reference to the proper source
                        ;
                        if (source) {
// console.log('connecting loop to ctx for ', id, source.pattern);
                            source.buffer = makeLoop(decoded, source.pattern, { A:0, a:1, B:2, b:3, C:4, c:5, D:6, d:7, E:8, e:9 });

                            //// Xx.
                            nowTime = Config.audio.ctx.currentTime;
                            nowFraction = nowTime % 3.6;
                            prevZero = nowTime - nowFraction;   // timestamp of the previous beat-zero
                            nowBeat = ~~(nowFraction / 0.1125); // `nowBeat` is an integer between `0` and `31` inclusive http://jsperf.com/math-floor-vs-math-round-vs-parseint/33

                            //// Get the beat-number of the next beat, and calculate its timestamp.
                            nextBeat = (31 <= nowBeat ? 0 : nowBeat+1);
                            nextTime = prevZero + (0.1125 * nextBeat);
// console.log('now:', nowTime, 'next beat #:', nextBeat, 'next beat time:', nextTime);

                            source.start(nextTime, nextBeat * 0.1125); // @todo improve timing, sometimes sources sync quite well, sometimes not!
                        } else {
                            console.log('no source for ' + id, God.flora.sourceLut);
                        }
                    }
                );

// console.log('added ' + id);
                // @todo fade in
            }

            //// Closer stone-circles are louder. @todo gradual change in gain. @todo pan or spacialize.
            if (far > lowerFloraFar) {
                source.gain.value = 0;
            } else {
                source.gain.value = (lowerFloraFar - far) / lowerFloraFar; // eg `(50 - 49) / 50` = `0.02`, and `(50 - 1) / 50` = `0.98`
            }
            


            //// Record the source to temporary objects.
            sources.push(source);
            sourceLut[id] = source;
// console.log('recorded ' + id + ' to sourceLut[id]');
        }

        //// Some sources may have left local scope. Fade them out and schedule them for removal.
        for (i=0, l=God.flora.sources.length; i<l; i++) {
            source = God.flora.sources[i];
            if (! sourceLut[source.id]) { // @todo why is `source` sometimes `undefined`?
// console.log('scheduled for deletion: ' + source.id);
                source.disconnect(); // @todo schedule
                // @todo fade out and schedule for removal
            }
        }

        //// Replace the globally accessible objects with the ones we have just created.
        God.flora.sources = sources;
        God.flora.sourceLut = sourceLut;

// console.log('now ' + God.flora.sources.length, God.flora.sources, God.flora.sourceLut);


        //// Place the nearest Flora at the top.
        flora = _.sortBy(flora, function(o) { return o.far; });

        Session.set('audioSources', flora);

} catch(e) { console.log(e); } // @todo remove




        return flora;

    });

    var
        loadAndDecode = function (url, decodeSuccessCallback, decodeErrorCallback) {

            //// Use XHR to load audio from a URL.
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            request.onerror = function () {
                console.log('flora.helper.js:loadAndDecode() load error');
            }
            request.onload = function (event) {
// console.log('have decoded ' + url);
                //// Use `decodeAudioData()` to decode the MP3 into a buffer. // @todo update to promise-based syntax, when browsers support it
                Config.audio.ctx.decodeAudioData(
                    request.response      // ArrayBuffer
                  , decodeSuccessCallback // will be passed a single argument, which we are calling `decoded` (MDN calls it `buffer`, but there are several kinds of buffers in use)
                  , decodeErrorCallback   // will be passed a single argument, `error`
                );
            };
            request.send();
        }

      , getDecodedAudio = function (url, id, cb) { // `pattern` is a string, eg 'Bb..Aa..b.a.Aa..', `url` is an `AudioBuffer` object @todo map and cb descriptions

            //// Load and decode the audio, if not yet done.

            //// `Config.flora.decodedAudio` is a lookup-table where each key is a URL, and each value is either an queue of callbacks, or some decoded audio.
            var queueOrAudio = Config.flora.decodedAudio[url];

            //// The first time a URL is encountered, prepare a temporary queue for `getDecodedAudio()` calls while we wait for the audio, and begin the load-and-decode process.
            if (! queueOrAudio) {
                queueOrAudio = Config.flora.decodedAudio[url] = []; // this prevents a URL from being loaded twice, even if the subsequent call to `getDecodedAudio()` comes a microsecond later
                loadAndDecode(
                    url
                  , function (decoded) {
                        var i, l;
                        for (i=0, l=Config.flora.decodedAudio[url].length; i<l; i++) {
// console.log('call queued function ' + i);
                            Config.flora.decodedAudio[url][i].cb(decoded, Config.flora.decodedAudio[url][i].id);
                        }
                        Config.flora.decodedAudio[url] = decoded; // the queue of functions is no longer needed
                    }
                  , function (error) {
                        console.log('flora.helper.js:getDecodedAudio() decode error' + error.err);
                    }
                );
            }

            //// `Config.flora.decodedAudio[url]` is an array, so queue the callback.
            if ( _.isArray(queueOrAudio) ) {
                queueOrAudio.push({ cb:cb, id:id });
                return;
            }

            //// Assume `Config.flora.decodedAudio[url]` is the decoded audio, so run the callback on next tick.
            window.setTimeout(function () {
                cb(queueOrAudio, id);
            },1);

        }

      , makeLoop = function (decoded, pattern, map) {
            // pattern = '....' + pattern; // @todo fix rough start
// console.log(pattern);
// console.log('sampleRate;', decoded.sampleRate, 'length;', decoded.length, 'duration;', decoded.duration, 'numberOfChannels;', decoded.numberOfChannels);
            var i, j, srcChannel, destChannel, code, offset, source
              , l = pattern.length
              , numberOfChannels = decoded.numberOfChannels
              , pitch = 1 // @todo user pref?
              , sampleRate = decoded.sampleRate * pitch
              , grid = 5400 * 2 // @todo test whether this really should be ` * numberOfChannels`, or whether it’s really `* 2` whetever the channel-count
              , dest = Config.audio.ctx.createBuffer(numberOfChannels, pattern.length * grid, sampleRate) // http://stackoverflow.com/a/14148125
            ;

            //// 
            for (i=0; i<numberOfChannels; i++) {
                srcChannel  = decoded.getChannelData(i);  // returns a Float32Array
                destChannel = dest.getChannelData(i); // returns a Float32Array
                for (j=0; j<l; j++) {
                    code = pattern.charAt(j);
                    if ('.' === code) { continue; } // silence
                    offset = map[code] * grid;
// console.log(i, j, j * grid, code, offset, offset + grid);
                    destChannel.set(
                        srcChannel.subarray(offset, offset + grid)
                      , j * grid
                    );
                }
            }
// console.log('dest.length ' + dest.length);
            return dest;
        }
    ;

}