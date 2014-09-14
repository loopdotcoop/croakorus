if (Meteor.isClient) {

    //// Allow any template to use `{{#each tiles}}`.
    UI.registerHelper('tiles', function() {
        var
            position = Session.get('looptopianPosition') // @todo user db
          , xFar1 = Config.tiles.xTileFar
          , xFar2 = xFar1 * 2
          , xFar4 = xFar1 * 4
          , zFar1 = Config.tiles.zTileFar
          , zFar2 = zFar1 * 2
          , zFar4 = zFar1 * 4
          , x = position[0]
          , z = position[2]

            //// Restrict to nearby lowland tiles, middle-distance hill tiles, and all high-mountain tiles.
          , selector = { $or: [ // http://docs.mongodb.org/manual/reference/operator/query/or/
                {
                    x: { $gte:x - xFar1, $lte:x + xFar1 }
                  , z: { $gte:z - zFar1, $lte:z + zFar1 }

                //// @todo close gaps under high-mountain tiles, and uncomment this operator
                // },{
                //     x: { $gte:x - xFar2, $lt:x + xFar2 }
                //   , z: { $gte:z - zFar2, $lt:z + zFar2 }
                //   , bulk: 10

                //// @todo close gaps under high-mountain tiles, and uncomment this operator
                // },{
                //     x: { $gte:x - xFar4, $lt:x + xFar4 }
                //   , z: { $gte:z - zFar4, $lt:z + zFar4 }
                //   , bulk: 100

                //// @todo close gaps under high-mountain tiles, and uncomment this operator
                // },{
                //     bulk: 1000
                // }

                //// @todo close gaps under high-mountain tiles, and remove this operator
                },{
                    bulk: { $gte:10 }
                }
            ]}
        ;

        //// Xx.
        return Tiles.find(selector);
    });

}