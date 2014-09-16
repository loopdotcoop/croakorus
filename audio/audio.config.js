Config.audio = {
    name:         'Audio'
  , slug:         'audio'
  , description:  'Xx.' // no more than 255 characters
  , keywords:     'Xx'
  , scripts: {
        test:     'echo \'Error: no test specified\' && exit 1'
    }
  , organization: 'Loop.Coop'
  , author:       'Rich Plastow <info@loop.coop>'
  , year:         '2014'
  , license:      'GPL v2'
  , type:         'website' // http://ogp.me/#types
  , contributors: [
        'Beth Walker <info@loop.coop>'
    ]

  , playheadLut: [
        '=...,...,...,...;...,...,...,...'
      , ';=..,...,...,...;...,...,...,...'
      , ';.=.,...,...,...;...,...,...,...'
      , ';..=,...,...,...;...,...,...,...'
      , ';...=...,...,...;...,...,...,...'
      , ';...,=..,...,...;...,...,...,...'
      , ';...,.=.,...,...;...,...,...,...'
      , ';...,..=,...,...;...,...,...,...'
      , ';...,...=...,...;...,...,...,...'
      , ';...,...,=..,...;...,...,...,...'
      , ';...,...,.=.,...;...,...,...,...'
      , ';...,...,..=,...;...,...,...,...'
      , ';...,...,...=...;...,...,...,...'
      , ';...,...,...,=..;...,...,...,...'
      , ';...,...,...,.=.;...,...,...,...'
      , ';...,...,...,..=;...,...,...,...'
      , ';...,...,...,...=...,...,...,...'
      , ';...,...,...,...;=..,...,...,...'
      , ';...,...,...,...;.=.,...,...,...'
      , ';...,...,...,...;..=,...,...,...'
      , ';...,...,...,...;...=...,...,...'
      , ';...,...,...,...;...,=..,...,...'
      , ';...,...,...,...;...,.=.,...,...'
      , ';...,...,...,...;...,..=,...,...'
      , ';...,...,...,...;...,...=...,...'
      , ';...,...,...,...;...,...,=..,...'
      , ';...,...,...,...;...,...,.=.,...'
      , ';...,...,...,...;...,...,..=,...'
      , ';...,...,...,...;...,...,...=...'
      , ';...,...,...,...;...,...,...,=..'
      , ';...,...,...,...;...,...,...,.=.'
      , ';...,...,...,...;...,...,...,..='
    ]

  , changelog: [
        '+ audio@0.0.1-1    paste ‘client/audio.js’ from ‘20140624-voxeldaytime-better-sound’; amend code; '
      , '+ audio@0.0.1-2    play ‘public/flora/stone-circle-d4168a4.mp3’ (see ‘20140913-creating-stone-circle-mp3’); '
      , '+ audio@0.0.1-3    `#audioSources` info box; `rint()`; `God.flora.updateAudio()` generates patterns; '
      , '+ audio@0.0.1-4    rough 3D representation of drum pattern; '
      , '+ audio@0.0.1-5    `#audioSources` orders by distance; move `God.flora.updateAudio()` to ‘flora.helper.js’; '
      , '+ audio@0.0.1-6    stone-circles play their patterns; move ‘audio.js’ functionality to ‘flora.helper.js’; '
      , '+ audio@0.0.1-7    closer stone-circles are louder; '
      , '+ audio@0.0.2      `#audioSources` shows playhead position; loops are synchronized; '
    ], version: '0.0.2'
};


if (Meteor.isClient) {

    //// Schedule the playhead to step forward every 5400 samples. http://www.html5rocks.com/en/tutorials/audio/scheduling/
    var nowTime, nowBeat
      , prevBeat = 0
      , prevTime = 0

        //// Find out where the playhead should be, given the total amount of time elapsed since `Config.audio.ctx` was created.
      , step = function () { // we don’t use the `stamp` argument
            nowTime = Config.audio.ctx.currentTime;
            // var nowFraction = nowTime % 3.6;
            // var prevZero = nowTime - nowFraction; // timestamp of the previous beat-zero
            if ( (nowTime - prevTime) > 0.028125) { // `(nowTime - prevTime)` is time elapsed, and `0.028125` is 1350 samples (`0.1125` is less smooth)
                nowBeat = ~~( (nowTime % 3.6) / 0.1125 ); // `nowBeat` is an integer between `0` and `31` inclusive http://jsperf.com/math-floor-vs-math-round-vs-parseint/33
                if ( nowBeat !== prevBeat ) {
                    Session.set('playhead', Config.audio.playheadLut[nowBeat]);
                    prevBeat = nowBeat;
                }
                prevTime = nowTime;
            }
            window.requestAnimationFrame(step);
        }
    ;

    //// Initialize the audio context.
    Config.audio.ctx = new (window.AudioContext || window.webkitAudioContext)(); // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext.decodeAudioData

    //// Create a master `GainNode`, and connect it to the `AudioContext`.
    Config.audio.gain = Config.audio.ctx.createGain(); // allows us to write `mySource.connect(Config.audio.gain);`
    Config.audio.gain.connect(Config.audio.ctx.destination);

    //// Initialize the 'audioSources' and 'playhead' session-variables.
    Session.set('audioSources', []);
    Session.set('playhead', 0);

    //// Start the `step()` counter, which will continue running for the whole session.
    window.requestAnimationFrame(step);
}