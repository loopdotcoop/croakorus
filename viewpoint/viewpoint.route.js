Router.map(function() {
    this.route('viewpoint', {
        path: /^\/(\d+)([nesw])(\d+)$/ // eg '/155n33'
      , data: function () {
            var
                x = +this.params[0]
              , r =  this.params[1]
              , z = +this.params[2]
            ;

            //// Only allow lowland positions.
            // @todo

            Session.set('position', [ x, 2, z ]); // @todo update user db
            Session.set('rotation', r); // @todo update user db
        }
    });
});

