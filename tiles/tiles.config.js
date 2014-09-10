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
  , xTerrainExtent: 32 // number of Tiles from the Westmost to the Eastmost edges of the terrain
  , zTerrainExtent: 32 // number of Tiles from the Northmost to the Southmost edges of the terrain
  , xTileFar:       30 // only subscribe to Tiles within 30 squares x-distance from your Looptopian
  , zTileFar:       30 // as above, for y-distance

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
Config.tiles.xTileSizePlus1   = Config.tiles.xTileSize + 1;
Config.tiles.zTileSizePlus1   = Config.tiles.zTileSize + 1;
Config.tiles.xTerrainSize     = Config.tiles.xTileSize * Config.tiles.xTerrainExtent;
Config.tiles.zTerrainSize     = Config.tiles.zTileSize * Config.tiles.zTerrainExtent;
Config.tiles.xHalfTerrainSize = Config.tiles.xTerrainSize / 2;
Config.tiles.zHalfTerrainSize = Config.tiles.zTerrainSize / 2;


// Attach the ‘Collection2’ schema defined above.
Tiles.attachSchema(Config.tiles.schema);


