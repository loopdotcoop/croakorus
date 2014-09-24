Config.tiles = {
    name:         'Tiles'
  , slug:         'tiles'
  , description:  'Xx.' // no more than 255 characters
  , keywords:     'Xx'
  , scripts: {
        test:     'echo \'Error: no test specified\' && exit 1'
    }
  , organization: 'Loop.Coop'
  , author:       'Rich Plastow <info@loop.coop>'
  , year:         '2014'
  , license:      'GPL v2'
  , type:         'website' // http://ogp.me/#types
  , contributors: [
        'Beth Walker <info@loop.coop>'
    ]

  //// Configs define the tiles and terrain. See also `config.xTileSizePlus1` and `config.yTileExtentPlus1`, below.
  , xTileSize:       8 // number of grid-squares (meters) from the Westmost to the Eastmost edge of a terrain Tile
  , zTileSize:       8 // number of grid-squares (meters) from the Northmost to the Southmost edge of a terrain Tile
  , xTerrainExtent: 24 // number of Tiles from the Westmost to the Eastmost edges of the terrain
  , zTerrainExtent: 24 // number of Tiles from the Northmost to the Southmost edges of the terrain
  , xTileFar:       60 // only subscribe to Tiles within 60 squares x-distance from the viewpoint
  , zTileFar:       60 // as above, for z-distance

  , schema: new SimpleSchema({
        x: {
            type: Number,
            label: "X"
        }
      , z: {
            type: Number,
            label: "Z"
        }
      , color: {
            type: String,
            label: "Color"
        }
      , height: {
            type: String,
            label: "Height"
        }
      , bulk: {
            type: Number, // @todo check for integer?
            label: "Bulk"
        }
    })

  , changelog: [
        '+ tiles@0.0.1-1   create ‘tiles’ as a feature of ‘desoot@0.1.1-1’;  \n' +
        '                  paste ‘tiles/tiles.*.*’ from looptopia@0.2.18 ‘topians/topians.*.*’ and edit code; '
      , '+ tiles@0.0.1-2   `$ mrt add autoform`; '
      , '+ tiles@0.0.1-3   `$ mrt add jquery-datatables`; '
      , '+ tiles@0.0.1-4   `$ mrt add simple-schema` and `$ mrt add collection2`, though ‘autoform’ added them;  \n' +
        '                  both (or just 2nd?) of these two `add`s prevent the “no method attachSchema” error;  \n' +
        '                  `$ meteor remove autopublish` to prevent “set up some data subscriptions” message;  \n' +
        '                  `$ mrt add less` and paste ‘lib/patches/datatable-patch.coffee’ from looptopia@0.2.18;  \n' +
        '                  paste ‘tiles/tiles.list.js’ from looptopia@0.2.18 ‘topians/topians.list.js’ and edit code; '
      , '+ tiles@0.0.1-5   paste ‘tiles/tiles.init.js’ from 20140720-desoot-v0.1.9 ‘servr/tiles.js’ and edit code;  \n' +
        '                  update tiles schema with `x, z, color, height, isHigh` fields; '
      , '+ tiles@0.0.2     paste ‘tiles/tiles.html’ from 20140720-desoot-v0.1.9 ‘desoot.html’ and edit code; '
    ], version: '0.0.2'
};


//// Autogenerate some configs to simplify rendering the terrain.
Config.tiles.xTileSizePlus1    = Config.tiles.xTileSize + 1;
Config.tiles.zTileSizePlus1    = Config.tiles.zTileSize + 1;
Config.tiles.xTerrainSize      = Config.tiles.xTileSize * Config.tiles.xTerrainExtent;
Config.tiles.zTerrainSize      = Config.tiles.zTileSize * Config.tiles.zTerrainExtent;
Config.tiles.xHalfTerrainSize  = Config.tiles.xTerrainSize / 2;
Config.tiles.zHalfTerrainSize  = Config.tiles.zTerrainSize / 2;
Config.tiles.centralTileCount  = ( (Config.tiles.xTerrainExtent - 6) * (Config.tiles.zTerrainExtent - 6) ) - 9; // @todo check this is a positive number! @todo accurate underwater count?
Config.tiles.centralCoordCount = Config.tiles.centralTileCount * Config.tiles.xTileSize * Config.tiles.zTileSize; // @todo accurate underwater count?

//// Precalculate the 32 `transform` attributes for the water level.
var wsf = Math.PI * 2 / 32; // water surface factor, where `Math.PI * 2` is sine’s wavelength, and `32` is the number of beats in a cycle.
Config.tiles.waterSurfaceLut = [];
for (var i=0, l=32; i<l; i++) {
    Config.tiles.waterSurfaceLut.push(  Config.tiles.xHalfTerrainSize + ' ' + ( Math.sin( i * wsf) / 40 ) + ' ' + Config.tiles.zHalfTerrainSize  );
}

//// Attach the ‘Collection2’ schema defined above.
Tiles.attachSchema(Config.tiles.schema);


