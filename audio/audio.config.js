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

  , changelog: [
        '+ audio@0.0.1-1    paste ‘client/audio.js’ from ‘20140624-voxeldaytime-better-sound’; amend code; '
      , '+ audio@0.0.1-2    play ‘public/flora/stone-circle-d4168a4.mp3’ (see ‘20140913-creating-stone-circle-mp3’); '
      , '+ audio@0.0.1-3    `#audioSources` info box; `rint()`; `God.flora.updateAudio()` generates patterns; '
      , '+ audio@0.0.1-4    rough 3D representation of drum pattern; '
      , '+ audio@0.0.1-5    `#audioSources` orders by distance; move `God.flora.updateAudio()` to ‘flora.helper.js’; '
      , '+ audio@0.0.1-6    stone-circles play their patterns; move ‘audio.js’ functionality to ‘flora.helper.js’; '
      , '+ audio@0.0.1-7    closer stone-circles are louder; '
    ], version: '0.0.1-7'
};


if (Meteor.isClient) {

    //// Initialize the audio context.
    Config.audio.ctx = new (window.AudioContext || window.webkitAudioContext)(); // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext.decodeAudioData

    //// Initialize the 'audioSources' session-variable.
    Session.set('audioSources', []);

}