Router.map(function() {

    this.route('track.play', {
        path: /^\/(\d+)([nesw])(\d+)\/track\/(\d+)([nesw])(\d+)([a-z]{0,4})\/(\d+)$/ // eg '/140s147/track/140s147bq/7'
      , data: function () { // eg `this.params` is `[ '140', 'e', '147', '140', 'e', '147', 'bq', '7' ]`
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
                    Api.tracks.trackplay = { next: '/' + next[1] + next[2] + next[3] + '/track/' + track.start + '/' + (mkri + 1), wait:1, until:+curr[0] };
                } else { // at the last marker
// console.log('nope');
                    Api.tracks.trackplay = { next: '/' + curr[1] + curr[2] + curr[3], wait:1, until:+curr[0] };
                }
            }

        }
    });

    this.route('track.new', {
        path: /^\/(\d+)([nesw])(\d+)\/track\/new$/ // eg '/140s147/track/new'
      , data: function () { // eg `this.params` is `[ '140', 'e', '147' ]`
            var
                x = +this.params[0]
              , r =  this.params[1]
              , z = +this.params[2]
            ;
            Session.set('position', [ x, 2, z ]); // @todo update user db
            Session.set('rotation', r); // @todo update user db

            Api.tracks.tracknew = this.params.join('') + 'a'; // @todo suffix to enforce unique `start` values
            Api.tracks.trackadd = [];
// console.log('new!', Api.tracks.tracknew);
        }
    });

    this.route('track.add', {
        path: /^\/(\d+)([nesw])(\d+)\/track\/add\/(\d+)([nesw])(\d+)([a-z]{0,4})\/(\d+)$/ // eg '/140s147/track/add/140s147bq/1'
      , data: function () { // eg `this.params` is `[ '140', 'e', '147' ]`
            var
                x = +this.params[0]
              , r =  this.params[1]
              , z = +this.params[2]
            ;
            Session.set('position', [ x, 2, z ]); // @todo update user db
            Session.set('rotation', r); // @todo update user db

            //// We lose track-creation state after a refresh, but the URL (eg `/195e131/track/add/195e131a/5`) remains, so do a redirect.
            if (! Api.tracks.tracknew || ! Api.tracks.trackadd) {
// console.log('redirect');
                Router.go('/' + x + r + z);
            }

// console.log('move add!', Api.tracks.tracknew, Api.tracks.trackadd);
        }
    });

    this.route('tracks.list', {
        path: '/tracks/list'
    });
});
