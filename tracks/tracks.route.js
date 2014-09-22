Router.map(function() {
    this.route('track.play', {
        path: /^\/(\d+)([nesw])(\d+)\/track\/(\d+)([nesw])(\d+)([a-z]{0,4})\/(\d+)$/ // eg '/140s147/track/140s147bq/1'
      , data: function () { // eg `this.params` is `[ '/140e147/track/140e147bq/1', '140', 'e', '147', '140', 'e', '147', 'bq', '1' ]`
            var
                x = +this.params[0]
              , r =  this.params[1]
              , z = +this.params[2]
            ;
            Session.set('position', [ x, 2, z ]); // @todo update user db
            Session.set('rotation', r); // @todo update user db
        }
    });
    this.route('track.make', {
            path: '/track/make'
        }
    );
    this.route('track.stop', {
            path: '/:xrz/track/stop/:username/:marker/:alt?'
          , data: function () {
                var xrz = /^(\d+)([nesw])(\d+)$/.exec(this.params.xrz);
                // Session.set('position', [ start[0],2,start[1] ]); // @todo update user db
                // Session.set('rotation' , 'n'); // @todo update user db
                console.log(xrz, this.params.username, this.params.marker);

                // var
                //     x = +this.params[0]
                //   , r =  this.params[1]
                //   , z = +this.params[2]
                // ;

                // //// Only allow lowland positions.
                // // @todo

                // Session.set('position', [ x, 2, z ]); // @todo update user db
                // Session.set('rotation', r); // @todo update user db

            }
        }
    );
    this.route('tracks.list', {
            path: '/tracks/list'
        }
    );
});
