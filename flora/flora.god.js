God.flora = {
    types: [
        {
            name:   'Stone Circle'
          , plural: 'Stone Circles'
          , slug:   'stone-circle'
          , min: 0.01 // minimum number of this type of flora, as a fraction of lowland Tiles
          , max: 0.1  // maximum, also as a fraction of lowland Tiles
          , generate: function () {
                if (Meteor.isClient) { return; }
                console.log('generate a ' + this.name);
            }
          , init: function () {
                if (Meteor.isClient) { return; }
                console.log('`God.flora.typeLut["' + this.slug + '"]()` will generate ' + Math.ceil(this.min * Config.tiles.lowlandTileCount) + ' ' + this.plural);
                for (var i = Math.ceil(this.min * Config.tiles.lowlandTileCount); i>0; i--) {
                    this.generate();
                }
            }
        }
      , {
            name:   'Cactus'
          , plural: 'Cacti'
          , slug:   'cactus'
          , min: 0.1 // minimum number of this type of flora, as a fraction of lowland Tiles
          , max: 0.05  // maximum, also as a fraction of lowland Tiles
          , generate: function () {
                if (Meteor.isClient) { return; }
                var i, x, z, tile, pattern
                ;

                //// Find an empty Tile.
                for (i=Config.tiles.lowlandTileCount; i>0; i--) {

                    //// Get a random `x` and `z` coordinate. If `xTerrainExtent` is `32` and `xTileSize` is `8`, `x` becomes an integer between `24` and `232` inclusive.
                    x = (  Math.floor( Math.random() * (Config.tiles.xTerrainExtent - 6) ) + 3  ) * Config.tiles.xTileSize;
                    z = (  Math.floor( Math.random() * (Config.tiles.zTerrainExtent - 6) ) + 3  ) * Config.tiles.zTileSize;

                    //// Make sure this is a lowland tile
                    tile = Tiles.findOne({ x:x, z:z });
                    if (! tile) { throw new Meteor.Error('`God.flora.typeLut["' + this.slug + '"].generate()` cannot find a Tile at (' + x + ',0,' + z + ')', 500); }
                    if (5 !== tile.bulk) {
                        console.log('found a mountainous Tile at (' + x + ',0,' + z + ')');
                        continue;
                    }

                    //// Make sure no other Flora exists at these coordinates. @todo test for race-condition
                    if ( 0 !== Flora.find({ x:x, z:z }).count() ) {
                        console.log('already Flora at (' + x + ',0,' + z + ')');
                    } else {
                        // console.log('generate a ' + this.name + ' at (' + x + ',0,' + z + ')');
                        break;
                    }

                }

                //// Give up finding an empty tile.
                if (0 === i) {
                    throw new Meteor.Error('`God.flora.typeLut["' + this.slug + '"].generate()` gave up finding an empty space after ' + Config.tiles.lowlandTileCount + ' attempts.', 500);
                }

                //// Generate a pattern for this cactus, eg 'Ee..AaDd....AaDdEe..Aa..Bb..Cc..'.
                pattern = '................................'.split('');
                for (i=0, l=rint(3, 12, 'mid', 2); i<l; i++) {
                    switch ( rint(3, 'high') ) {
                        case 0: // kick drum
                            if ( rint() ) {
                                pattern.splice( rint() * 16    , 2, 'E', 'e'); // add a full kick hit at point `0` or `16`
                            } else {
                                pattern.splice( rint() * 16 + 8, 2, 'B', 'b'); // add a soft kick hit at point `8` or `24`
                            }
                            break;
                        case 1: // snare drum
                            if ( rint() ) {
                                pattern.splice( rint() * 16 + 8, 2, 'A', 'a'); // add a full snare hit at point `8` or `24`
                            } else {
                                pattern.splice( rint(3) * 8 + 4, 1, 'a');      // add a soft snare hit at point `4`, `12`, `20`, or `28`
                            }
                            break;
                        case 2:
                            break;
                        case 3:
                            break;
                    }
                }

                //// Record the Cactus to the `Flora` collection.
                Flora.insert({
                    x:       x
                  , z:       z
                  , color:   'red'
                  , type:    this.slug
                  , bulk:    5
                  , pattern: pattern.join('')
                });

            }
          , init: function () {
                if (Meteor.isClient) { return; }
                console.log('`God.flora.typeLut["' + this.slug + '"].init()` will generate ' + Math.ceil(this.min * Config.tiles.lowlandTileCount) + ' ' + this.plural);
                for (var i = Math.ceil(this.min * Config.tiles.lowlandTileCount); i>0; i--) {
                    try { this.generate() } catch (error) { console.log(error.error); break; } // @todo does this appear on Modulus logs?
                }
            }
        }
    ]

  , updateAudio: function () {
        if (Meteor.isServer) { return; }
        var flora, i, l, dx, dz
          , position = Session.get('looptopianPosition') // @todo user db
          , x = position[0]
          , z = position[2] // @todo vertical proximity?
          , xFar1 = Config.flora.xFloraFar
          , zFar1 = Config.flora.zFloraFar
        ;

        //// Xx.
        flora = Flora.find({
            x: { $gte:x - xFar1, $lt:x + xFar1 }
          , z: { $gte:z - zFar1, $lt:z + zFar1 }
        }).fetch();

        //// Add some useful data to the raw `flora` array.
        for (i=0, l=flora.length; i<l; i++) {
            dx = flora[i].x - x;
            dz = flora[i].z - z;
            flora[i].far = Math.sqrt( (dx * dx) + (dz * dz) ); // yay Pythagorus!
        }

        Session.set('audioSources', flora);
    }
};


//// Generate a handy lookup-table of flora types. @todo is this needed?
God.flora.typeLut = {};
God.flora.types.forEach(function (value) {
    God.flora.typeLut[value.slug] = value;
});


//// Useful utility for generating random integers. @todo create an atmosphere package? 
var rint = function (a, b, c, d) {
    var from, to, weight, power
      , ta = typeof a
      , tb = typeof b
      , tc = typeof c
      , td = typeof d
      , tabcd = ta + tb + tc + td
      , U = 'undefined'
      , N = 'number'
      , S = 'string'
      , r = Math.random()
    ;

    //// Normalize shorthand argument-usage.
         if (U + U + U + U === tabcd) { return r > 0.5 ? 1 : 0;                    } // `rint()` with no arguments returns either `0` or `1`
    else if (S + U + U + U === tabcd) { from = 0; to = 1; weight = a  ; power = 1; } // `rint('lo')` returns either `0` or `1`, favouring `0`
    else if (S + N + U + U === tabcd) { from = 0; to = 1; weight = a  ; power = b; } // `rint('lo', 2)` returns either `0` or `1`, strongly favouring `0`
    else if (N + U + U + U === tabcd) { from = 0; to = a; weight = '-'; power = 1; } // `rint(6)` returns an integer between `0` or `6`
    else if (N + S + U + U === tabcd) { from = 0; to = a; weight = b  ; power = 1; } // `rint(6, 'mid')` returns an integer between `0` or `6`, favouring `3`
    else if (N + S + N + U === tabcd) { from = 0; to = a; weight = b  ; power = c; } // `rint(6, 'high', 4)` returns an integer between `0` or `6`, very heavily favouring `6`
    else if (N + N + U + U === tabcd) { from = a; to = b; weight = '-'; power = 1; } // `rint(3, 5)` returns `3`, `4` or `5`
    else if (N + N + S + U === tabcd) { from = a; to = b; weight = c  ; power = 1; } // `rint(3, 5, 'high')` returns `3`, `4` or `5`, favouring `5`
    else if (N + N + S + N === tabcd) { from = a; to = b; weight = c  ; power = d; } // `rint(3, 5, 'low', 3)` returns `3`, `4` or `5`, heavily favouring `2`
    else { throw new Error('`rint()` was called with invalid argument types.'); }

    // console.log(from, to, weight, power);

    //// For an unweighted random integer, we can return the result right away.
    if ('-' !== weight) {

        //// Apply weight and power to the random number. @todo if the `for ...` loops were replaced by algorithms, could `power` work as a fractional and/or negative number?
        //// http://graphsketch.com/?eqn1_color=1&eqn1_eqn=x&eqn2_color=2&eqn2_eqn=(2-x)%20*%20x&eqn3_color=3&eqn3_eqn=x%20*%20x&eqn4_color=4&eqn4_eqn=(1-x)%20*%202x&eqn5_color=5&eqn5_eqn=(x-.5)%20*%20(x-.5)%20*%202%20%2B%20.5&eqn6_color=6&eqn6_eqn=&x_min=-1&x_max=2&y_min=-.5&y_max=1.5&x_tick=1&y_tick=1&x_label_freq=5&y_label_freq=5&do_grid=0&do_grid=1&bold_labeled_lines=0&bold_labeled_lines=1&line_width=4&image_w=850&image_h=600
        switch (weight) {
            case 'high': // `(2-r) * r`
                for (i=1; i<power; i++) { r = (2 - r) * r; }
                break;
            case 'low': // `r * r`
                for (i=1; i<power; i++) { r = r * r; } // nb, this is different to `Math.pow(r, power + 1)`
                break;
            case 'mid': // use `(1-r) * 2r` when r is below 0.5, otherwise `(r-.5) * (r-.5) * 2 + .5`
                if (0.5 > r) {
                    for (i=1; i<power; i++) { r = (1 - r) * 2 * r; }
                } else {
                    for (i=1; i<power; i++) { r = (r - 0.5) * (r - 0.5) * 2 + 0.5; }
                }
                break;
            default:
                throw new Error('`rint()` the `weight` argument is not valid (use "-|high|mid|low").');
        }

    }

    //// Return the random integer.
    return Math.round( r * (to - from) ) + from;

};

if ( Meteor.isClient) {
    Meteor.startup(function () {
        // console.log('here');
    });

    // console.log( rint()            );
    // console.log( rint(33)          );
    // console.log( rint(200)         );
    // console.log( rint('low')       );
    // console.log( rint(6, 'mid')    );
    // console.log( rint(6, 9)        );
    // console.log( rint(-4, -9)      );
    // console.log( rint('high', 2)   );

    // console.log('high');
    // console.log( rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4) );
    // console.log( rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4) );
    // console.log( rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4) );
    // console.log( rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4) );
    // console.log( rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4) );
    // console.log( rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4), rint(0, 9, 'high', 4) );

    // console.log('low');
    // console.log( rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4) );
    // console.log( rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4) );
    // console.log( rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4) );
    // console.log( rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4) );
    // console.log( rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4) );
    // console.log( rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4), rint(0, 9, 'low', 4) );

    // console.log('mid');
    // console.log( rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4) );
    // console.log( rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4) );
    // console.log( rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4) );
    // console.log( rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4) );
    // console.log( rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4) );
    // console.log( rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4), rint(0, 9, 'mid', 4) );

}


