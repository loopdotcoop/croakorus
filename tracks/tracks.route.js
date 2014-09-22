Router.map(function() {
    this.route('track.play', {
        path: /^\/(\d+)([nesw])(\d+)\/track\/(\d+)([nesw])(\d+)([a-z]{0,4})\/(\d+)$/ // eg '/140s147/track/140s147bq/1'
      , data: function () { // eg `this.params` is `[ '140', 'e', '147', '140', 'e', '147', 'bq', '1' ]`
            var curr, next
              , x = +this.params[0]
              , r =  this.params[1]
              , z = +this.params[2]
              , start = this.params[3] + this.params[4] + this.params[5] + this.params[6]
              , mkri = +this.params[7]
              , track = Tracks.find({ start:start }).fetch()
            ;
            Session.set('position', [ x, 2, z ]); // @todo update user db
            Session.set('rotation', r); // @todo update user db

            //// 
            if (1 === track.length) { // @todo redirect to valid URL if 0, exception if greater than 1
                track = track[0];
                curr = track.markers[mkri-1].split(' ');
                if (track.markers[mkri]) {
// console.log('yay!', track);
                    next = track.markers[mkri].split(' ');
                    Session.set('trackplay', { next: '/' + next[1] + next[2] + next[3] + '/track/' + track.start + '/' + (mkri + 1), wait:1, until:+curr[0] });
                } else { // at the last marker
// console.log('nope');
                    Session.set('trackplay', { next: '/' + curr[1] + curr[2] + curr[3], wait:1, until:+curr[0] });
                }
            }

        }
    });
    this.route('track.make', {
            path: '/track/make'
        }
    );
    // this.route('track.stop', {
    //         path: '/:xrz/track/stop/:username/:marker/:alt?'
    //       , data: function () {
    //             var xrz = /^(\d+)([nesw])(\d+)$/.exec(this.params.xrz);
    //             // Session.set('position', [ start[0],2,start[1] ]); // @todo update user db
    //             // Session.set('rotation' , 'n'); // @todo update user db
    //             console.log(xrz, this.params.username, this.params.marker);

    //             // var
    //             //     x = +this.params[0]
    //             //   , r =  this.params[1]
    //             //   , z = +this.params[2]
    //             // ;

    //             // //// Only allow lowland positions.
    //             // // @todo

    //             // Session.set('position', [ x, 2, z ]); // @todo update user db
    //             // Session.set('rotation', r); // @todo update user db

    //         }
    //     }
    // );
    this.route('tracks.list', {
            path: '/tracks/list'
        }
    );
});
