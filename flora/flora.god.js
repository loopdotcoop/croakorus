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
          , min: 0.005 // minimum number of this type of flora, as a fraction of lowland Tiles
          , max: 0.05  // maximum, also as a fraction of lowland Tiles
          , generate: function () {
                if (Meteor.isClient) { return; }
                var i, x, z, tile
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
                        console.log('generate a ' + this.name + ' at (' + x + ',0,' + z + ')');
                        break;
                    }
                }

                //// Give up finding an empty tile.
                if (0 === i) {
                    throw new Meteor.Error('`God.flora.typeLut["' + this.slug + '"].generate()` gave up finding an empty space after ' + Config.tiles.lowlandTileCount + ' attempts.', 500);
                }

                // Record the Cactus to the `Flora` collection.
                Flora.insert({
                    x:      x
                  , z:      z
                  , color:  'red'
                  , type:   this.slug
                  , bulk:   6
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
};


//// Generate a handy lookup-table of flora types. @todo is this needed?
God.flora.typeLut = {};
God.flora.types.forEach(function (value) {
    God.flora.typeLut[value.slug] = value;
});

