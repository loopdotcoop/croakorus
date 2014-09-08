if (Meteor.isClient) {

    //// Allow any template to use `{{#each tiles}}`.
    UI.registerHelper('tiles', function() {
        var
            position = Session.get('looptopianPosition') // @todo user db
          , x = position[0]
          , z = position[2]

            //// Restrict to nearby tiles and high tiles.
          , selector = { $or: [ // http://docs.mongodb.org/manual/reference/operator/query/or/
                {
                    x: { $gte:x - Config.tiles.xTileFar, $lt:x + Config.tiles.xTileFar }
                  , z: { $gte:z - Config.tiles.zTileFar, $lt:z + Config.tiles.zTileFar }
                },{
                    isHigh: true
                }
            ]}
        ;

        //// Xx.
        return Tiles.find(selector);
    });

}