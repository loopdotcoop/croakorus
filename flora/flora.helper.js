if (Meteor.isClient) {

    //// Allow any template to use `{{#each flora}}`.
    UI.registerHelper('flora', function() {
        var
            position = Session.get('looptopianPosition') // @todo user db
          , x = position[0]
          , z = position[2]
          , xFar1 = Config.flora.xFloraFar
          , xFar2 = xFar1 * 2
          , xFar4 = xFar1 * 4
          , zFar1 = Config.flora.zFloraFar
          , zFar2 = zFar1 * 2
          , zFar4 = zFar1 * 4

            //// Restrict to nearby small flora, middle-distance medium flora, and all giant flora.
          , selector = { $or: [ // http://docs.mongodb.org/manual/reference/operator/query/or/
                {
                    x: { $gte:x - xFar1, $lt:x + xFar1 }
                  , z: { $gte:z - zFar1, $lt:z + zFar1 }

                //// @todo close gaps under high-mountain flora, and uncomment this operator
                // },{
                //     x: { $gte:x - xFar2, $lt:x + xFar2 }
                //   , z: { $gte:z - zFar2, $lt:z + zFar2 }
                //   , bulk: 10

                //// @todo close gaps under high-mountain flora, and uncomment this operator
                // },{
                //     x: { $gte:x - xFar4, $lt:x + xFar4 }
                //   , z: { $gte:z - zFar4, $lt:z + zFar4 }
                //   , bulk: 100

                //// @todo close gaps under high-mountain flora, and uncomment this operator
                // },{
                //     bulk: 1000
                // }

                //// @todo close gaps under high-mountain flora, and remove this operator
                },{
                    bulk: { $gte:10 }
                }
            ]}
        ;

        //// Xx.
        return Flora.find(selector);
    });

}