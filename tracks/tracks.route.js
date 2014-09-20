Router.map(function() {
    this.route('track.make', {
            path: '/track/make'
        }
    );
    this.route('track.play', {
            path: '/track/play'
        }
    );
    this.route('track.stop', {
            path: '/:start/track/stop/:username/:marker/:alt?'
          , data: function () {
                var start = this.params.start.split('x');
                // Session.set('position', [ start[0],2,start[1] ]); // @todo update user db
                // Session.set('rotation' , 'n'); // @todo update user db
                console.log(this.params.username, start, this.params.marker);
            }
        }
    );
    this.route('tracks.list', {
            path: '/tracks/list'
        }
    );
});
