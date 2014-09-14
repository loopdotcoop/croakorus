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





        var flora, i, l, dx, dz, id, source
          , ids = {}
          , sources = []
          , sourceLut = {}
        ;

        //// Xx.
        // return Flora.find(selector);

try {

        //// Xx.
        flora = Flora.find(selector).fetch();

        //// Add some useful data to the fetched `flora` array.
        for (i=0, l=flora.length; i<l; i++) {

            //// Get a handy reference to the Flora’s MongoDB ID.
            id = flora[i]._id;

            //// `far` is the distance between the viewpoint and the center of the Tile which the Flora is on.
            dx = flora[i].x - x + (Config.tiles.xTileSize / 2);
            dz = flora[i].z - z + (Config.tiles.zTileSize / 2);
            flora[i].far = Math.sqrt( (dx * dx) + (dz * dz) ); // yay Pythagorus!

            //// Some sources may have newly arrived in local scope. Instantiate their `AudioBufferSourceNode` object and fade them in.
            source = God.flora.sourceLut[id];
            if (source) {
                // @todo change gain
            } else {
                source = { z:123, id:id };
                console.log('added ' + id);
                // @todo fade in
            }

            //// Record the source to temporary objects.
            sources.push(source);
            sourceLut[id] = source;
        }

        //// Some sources may have left local scope. Fade them out and schedule them for removal.
        for (i=0, l=God.flora.sources.length; i<l; i++) {
            source = God.flora.sources[i];
            if (! sourceLut[source.id]) { // @todo why is `source` sometimes `undefined`?
                console.log('scheduled for deletion: ' + source.id);
                // @todo fade out and schedule for removal
            }
        }

        //// Replace the globally accessible objects with the ones we have just created.
        God.flora.sources = sources;
        God.flora.sourceLut = sourceLut;

        console.log('now ' + God.flora.sources.length, God.flora.sources, God.flora.sourceLut);


        //// Place the nearest Flora at the top.
        flora = _.sortBy(flora, function(o) { return o.far; });

        Session.set('audioSources', flora);

} catch(e) { console.log(e); }




        return flora;

    });

}