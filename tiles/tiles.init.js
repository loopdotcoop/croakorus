if (Meteor.isServer) {
    // Tiles.remove({});

    var
        //// Used to seamlessly join tiles.
        southEdges = {}
      , eastEdges  = {}

        //// Used by `getTileType()` to quickly create a Tile-type.
      , xTerrainExtentMinus1 = Config.tiles.xTerrainExtent - 1
      , zTerrainExtentMinus1 = Config.tiles.zTerrainExtent - 1
      , xTerrainExtentMid = Math.floor( Config.tiles.xTerrainExtent / 2 )
      , zTerrainExtentMid = Math.floor( Config.tiles.zTerrainExtent / 2 )


        //// Returns an object which can be used to generates a semi-random terrain Tile, which varies depending on its location.
      , getTileType = function (x, z) {

            var
                xNearestEdge = Math.min(x, xTerrainExtentMinus1 - x)
              , zNearestEdge = Math.min(z, zTerrainExtentMinus1 - z)
              , xProportionIn = xNearestEdge / xTerrainExtentMid
              , zProportionIn = zNearestEdge / zTerrainExtentMid
              , xInvProportionIn = 1 - xProportionIn
              , zInvProportionIn = 1 - zProportionIn
              , maxInvProportionIn = Math.max(xInvProportionIn, zInvProportionIn)
              , heightFactor = ( xProportionIn + zProportionIn ) / 2
            ;
// console.log(xNearestEdge, zNearestEdge, xProportionIn, zProportionIn);


            // //// The extreme edges of the terrain are impassable tall mountains.
            // if (0 === x || 0 === z || xTerrainExtentMinus1 === x || zTerrainExtentMinus1 === z) {
            //     return {
            //         height: (function () {
            //             var
            //                 opts = [
            //                     function () { return Math.floor( Math.random() *  60 ) +  70; }
            //                   , function () { return Math.floor( Math.random() *  90 ) +  90; }
            //                   , function () { return Math.floor( Math.random() * 150 ) + 100; }
            //                   , function () { return Math.floor( Math.random() * 250 ) + 100; }
            //                   , function () { return Math.floor( Math.random() * 400 ) + 150; }
            //                 ]
            //               , rand = Math.floor( Math.random() * opts.length )
            //             ;
            //             return opts[rand];
            //         }())
            //       , colors: [ '#296','#563','#263','#561','#875','#641','#992' ]
            //       , bulk: 1000 // a value of `1000` is always rendered, no matter how far away it is
            //     }
            // }

            //// Anywhere else represents flatlands.
            return {
                height: function () { return Math.floor( (Math.random() * zInvProportionIn) * 200 + (maxInvProportionIn * xInvProportionIn * 120) ) - 80; }
              , colors: [ '#296','#332','#263','#561','#542','#641','#660' ]
              , bulk: 5 // a value of `5` is rendered if at a short distance from the viewpoint
            }

        }

        //// Generates a semi-random terrain Tile.
        //// Returns an object containing:
        ////     1. A random color
        ////     2. An array of heights along the tile's North edge
        ////     3. An array of heights along the tile's East edge
        ////     4. A string suitable for the `height` attribute of an <ElevationGrid> element:
        ////       - The first number is the elevation of the North-West corner, eg (-2, *, -2)
        ////       - The second number is for the adjacent point on the North edge, eg (-1, *, -2)
        ////       - After the North-East corner has been reached, eg (2, *, -2), the next number is one square to the South of the North-West corner, eg (-2, *, -1)
        ////     5. A handy `bulk` integer, used by the selector in `tiles/tiles.helper.js`
      , randomTile = function (northEdge, westEdge, tileType) {
            var x, z, h
              , out = {
                    color:     tileType.colors[ Math.floor( Math.random() * tileType.colors.length ) ]
                  , height:    ''
                  , eastEdge:  []
                  , southEdge: []
                }
              , westEdge = westEdge || (function () {
                    for (var o=[], z=0; z<Config.tiles.zTileSize; z++) {
                        if ( northEdge && 0 === z) {
                            o.push(northEdge[0]);
                        } else {
                            o.push( tileType.height() );
                        }
                    };
                    return o;
                }())
              , northEdge = northEdge || (function () { 
                    for (var o=[], x=0; x<Config.tiles.xTileSize; x++) {
                        o.push( tileType.height() );
                    };
                    return o;
                }())
            ;

            //// Step through the Tile, starting in the North-West corner, proceeding along the North edge, and ending at the South-East corner.
            for (z=0; z<Config.tiles.zTileSizePlus1; z++) {
                for (x=0; x<Config.tiles.xTileSizePlus1; x++) {

                    //// If we are on the North or West edges, use the height passed in by the caller, so that this tile joins smoothly to the previous. Otherwise, generate a semi-random height.
                    if (0 === x) {
                        h = westEdge[z] || 0; // @todo investigate why `westEdge[z]` is sometimes `undefined` for Tiles on the edge of the terrain
                    } else if (0 === z) {
                        h = northEdge[x] || 0; // @todo investigate why `northEdge[x]` is sometimes `undefined` for Tiles on the edge of the terrain
                    } else {
                        h = tileType.height();
                    }

                    //// If we are on the South or East edges, make a record of the height which can be passed to a later `randomTile()` call.
                    if (Config.tiles.xTileSize === x) {
                        out.eastEdge.push(h);
                    }
                    if (Config.tiles.zTileSize === z) {
                        out.southEdge.push(h);
                    }

                    //// Append to the string which will become the `height` attribute of an <ElevationGrid> element.
                    out.height += h + ' ';
                }
            }

            //// Trim the trailing space from the height string, and return the finished tile.
            out.height = out.height.slice(0, -1);
            return out;
        }


        //// Generates a set of terrain Tiles, and records them into the `Tiles` collection.
      , randomTerrain = function () {
            var x, z
              , xTerrainExtentMinus = Config.tiles.xTerrainExtent - 1
              , zTerrainExtentMinus = Config.tiles.zTerrainExtent - 1
            ;

            //// Step through the terrain, starting in the North-West corner, proceeding along the Westernmost edge, and ending at the South-East corner.
            for (z=0; z<Config.tiles.zTerrainExtent; z++) {
                for (x=0; x<Config.tiles.xTerrainExtent; x++) {
                    var tile
                      , tileType
                      , northEdge = false
                      , westEdge  = false
                    ;

                    //// Grab the cached edge-heights from the adjacent Northerly and Westerly tiles, unless we are on the North or West edges.
                    if (0 !== z) {
                        northEdge = southEdges[ x + ' ' + (z-1) ];
                        delete southEdges[ x + ' ' + (z-1) ];
                    }
                    if (0 !== x) {
                        westEdge = eastEdges[ (x-1) + ' ' + z ];
                        delete eastEdges[ (x-1) + ' ' + z ];
                    }

                    //// Generate a random tile.
                    tileType = getTileType(x, z);
                    tile = randomTile( northEdge, westEdge, tileType );

                    //// Record the edge-heights ready for the adjacent Southerly and Easterly tiles, unless we are on the South or East edges.
                    if (xTerrainExtentMinus !== x) {
                        eastEdges[x + ' ' + z] = tile.eastEdge;
                    }
                    if (zTerrainExtentMinus !== z) {
                        southEdges[x + ' ' + z]  = tile.southEdge;
                    }

                    //// Record the Tile to the `Tiles` collection.
                    Tiles.insert({
                        x:      x * Config.tiles.xTileSize
                      , z:      z * Config.tiles.zTileSize
                      , color:  tile.color
                      , height: tile.height
                      , bulk:   tileType.bulk
                    });
                }
            }
        }
    ;

    //// The first time the app starts, generate initial terrain Tiles and record them into the `Tiles` collection.
    if ( 0 !== Tiles.find().count() ) {
        // console.log( Tiles.find().count() );
    } else {
        console.log('The ‘Tiles’ collection is empty...');
        randomTerrain();
    }

}