if (Meteor.isClient) {

    Session.set('mute', '{&lt;'); // shows '{<' while playing, and '{x' while muted

    UI.body.events({
        "click #audioSources .ldc-togglemute": function () {
            if ( Session.equals('mute', '{&lt;') ) {
                // Config.audio.gain.value = 1;
                Config.audio.gain.disconnect(Config.audio.ctx.destination);
                Session.set('mute', '{x');
            } else {
                // Config.audio.gain.value = 0;
                Config.audio.gain.connect(Config.audio.ctx.destination);
                Session.set('mute', '{&lt;');
            }
        }
    });

}