if (Meteor.isClient) {


    //// Create a new audio context. This represents a set of AudioNode objects and their connections.
    var ctx = new AudioContext();
    ctx.sampleRate = 48000; // @todo is this correct?

    //// Preload audio from ‘public/audio/’.
    // @todo
    
}