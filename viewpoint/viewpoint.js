if (Meteor.isClient) {

    Session.set('looptopianPosition', [Config.viewpoint.spawnX, 4, Config.viewpoint.spawnZ]); // @todo user db
    Session.set('viewpointRotation', 'south'); // @todo user db

    UI.body.helpers({
        looptopianPosition: function () {
            return Session.get('looptopianPosition').join(' ');
        }
      , spotlightPosition: function () {
            return Session.get('looptopianPosition')[0] + ' 15 ' + Session.get('looptopianPosition')[2];
        }
      , viewpointPosition: function () {
            var lp = Session.get('looptopianPosition');
            return lp[0] + ' ' + (lp[1] + 6) + ' ' + (lp[2] + 10);
        }
      , viewpointRotation: function () {
            return Session.get('viewpointRotation');
        }
    });

    var
        vpTally = 0
      , PI = Math.PI
      , halfPI = PI / 2
      , dragged
    ;

    UI.body.events({
        "mousedown x3d": function () {
            dragged = false;
        }
      , "mousemove x3d": function () {
            dragged = true;
        }
      , "mouseup shape": function (evt) {

            if (dragged) { return; }

            var currPos, newVp, xyz, flora
              , vpRotation = Session.get('viewpointRotation')
              , x = Math.floor(evt.worldX + evt.normalX / 2) + 0.5
              , y =            evt.worldY + evt.normalY / 2 // @todo height of center of square, from looking up terrain-data
              , z = Math.floor(evt.worldZ + evt.normalZ / 2) + 0.5
              , classes = (  evt.target.getAttribute && ( evt.target.getAttribute('class') ? evt.target.getAttribute('class') : '' )  ).split(' ')
            ;

            if (1 === evt.button) {
                // console.log('Left Click ', evt, x, y, z, evt.currentTarget.id, vpTally);

                //// Deal with a click on a lowland terrain tile or a hit-box.
                // if ( -1 !== classes.indexOf('ldc-hitzone') || '5' === evt.target.getAttribute('data-bulk') ) { // @todo better way of identifying lowland tiles?
                if ( -1 !== classes.indexOf('ldc-hitzone') || -1 !== classes.indexOf('ldc-navigation') ) {

                    //// Change the user’s orientation if they have clicked on the left or right 20% of the window. @todo try other ways of making the viewpoint rotation follow movement (nb, the <transform> element could be removed if we do some math on the <viewport> 'orientation' attribute)
                    if ( evt.layerX < (window.innerWidth * .2) ) { // turn left
                        switch (vpRotation) {
                            case 'north': vpRotation = 'west' ; break;
                            case 'east' : vpRotation = 'north'; break;
                            case 'south': vpRotation = 'east' ; break;
                            case 'west' : vpRotation = 'south'; break;
                        }
                        Session.set('viewpointRotation', vpRotation);
                    } else if ( evt.layerX > (window.innerWidth * .8) ) { // turn right
                        switch (vpRotation) {
                            case 'north': vpRotation = 'east' ; break;
                            case 'east' : vpRotation = 'south'; break;
                            case 'south': vpRotation = 'west' ; break;
                            case 'west' : vpRotation = 'north'; break;
                        }
                        Session.set('viewpointRotation', vpRotation);
                    }

                //// Otherwise, deal with a click on high-ground (near the edge, or the central mountain), or the underground-plane, or the sky.
                } else {
                    currPos = Session.get('looptopianPosition');
                    x = currPos[0]; y = currPos[1]; z = currPos[2];

                    //// Move by the ‘far’ distance, but don’t enter the mountains on the edges. @todo don’t enter the mountains in the middle.
                    switch (vpRotation) {
                        case 'north':
                            z -= Config.tiles.zTileFar;
                            z = Math.max(z, Config.tiles.zTileSize * 3);
                            break;
                        case 'east':
                            x += Config.tiles.xTileFar;
                            x = Math.min( x, Config.tiles.xTerrainSize - (Config.tiles.xTileSize * 3) );
                            break;
                        case 'south':
                            z += Config.tiles.zTileFar;
                            z = Math.min( z, Config.tiles.zTerrainSize - (Config.tiles.zTileSize * 3) );
                            break;
                        case 'west':
                            x -= Config.tiles.xTileFar;
                            x = Math.max(x, Config.tiles.xTileSize * 3);
                            break;
                    }

                    //// Get the ground-height at the new position.
                    y = 1; // @todo get this info from the `tiles` db
// console.log(x,y,z);

                }

                //// For a click on a hit-box, center the viewpoint.
                if (  -1 !== classes.indexOf('ldc-hitzone') && evt.target.getAttribute('data-center') ) {
                    xyz = evt.target.getAttribute('data-center').split(' ');
                    x = +xyz[0] + (Config.tiles.xTileSize / 2); // nb, the intial `+` converts from string to number
                    y = +xyz[1]
                    z = +xyz[2] + (Config.tiles.zTileSize / 2);
                }

                //// Update the Topian’s position. @todo draw topian.
                Session.set('looptopianPosition', [x,y,z]);

                //// Prepare a new transformed viewpoint.
                newVp =
                    '<transform '
                  + 'id="'                 + 'vp' + (vpTally + 1)               + '" '
                ;
                switch (vpRotation) {
                    case 'north':
                        newVp +=
                            'translation="'        + x + ' ' + (y + 2) + ' ' + (z + 10) + '" '
                          + 'rotation="'           + '0 1 0  0'                         + '" '
                          + '>'
                        ;
                        break;
                    case 'east':
                        newVp +=
                            'translation="'        + (x - 10) + ' ' + (y + 2) + ' ' + z + '" '
                          + 'rotation="'           + '0 1 0  -' + halfPI                + '" '
                          + '>'
                        ;
                        break;
                    case 'south':
                        newVp +=
                            'translation="'        + x + ' ' + (y + 2) + ' ' + (z - 10) + '" '
                          + 'rotation="'           + '0 1 0  ' + PI                     + '" '
                          + '>'
                        ;
                        break;
                    case 'west':
                        newVp +=
                            'translation="'        + (x + 10) + ' ' + (y + 2) + ' ' + z + '" '
                          + 'rotation="'           + '0 1 0  ' + halfPI                 + '" '
                          + '>'
                        ;
                        break;
                }
                newVp +=
                      '<viewpoint '
                  +   'centerOfRotation="' + x + ' ' + y + ' ' + z              + '" '
                  +   'position="'         + '0 0 0'                            + '" '
                  +   'orientation="'      + '1 0 0  -.2'                       + '" '
                  +   '>'
                  +   '</viewpoint>'
                  + '</transform>'
                ;

                //// Create the transformed viewpoint after the current one, and give it a unique ID.
                Config.layout.$viewpoint = $('#vp' + vpTally).after(newVp); // @todo do we actually need to record `Config.layout.$viewpoint`?

                //// Tell X3DOM to animate smoothly to the new <VIEWPOINT>.
                Config.layout.x3dMain.runtime.nextView();

                //// Delete the previous <VIEWPOINT>. @todo does this ever miss a deletion? if so, we could use a more aggressive deletion selector ... using the `:not` pseudo-class, for example https://developer.mozilla.org/en/docs/Web/CSS/:not
                $('#vp' + vpTally).remove();

                //// Prepare the viewpoint-tally for the next time the <VIEWPOINT> changes.
                vpTally++;

            } else if (2 === evt.button || 4 === evt.button) {
//                console.log('Right Click ', x, y, z, evt.currentTarget.id);
            }
        }
    });


    //// Cursor suggests left/right/forward move, and drag to look around.
    $(window).on('mousemove', function (evt) { // @todo disable for touchscreen devices
        var classes = (  evt.target.getAttribute && ( evt.target.getAttribute('class') ? evt.target.getAttribute('class') : '' )  ).split(' ');
        if ( -1 !== classes.indexOf('auto') ) {
            $('body').css('cursor', 'auto');
        } else if ( -1 !== classes.indexOf('ldc-toggle-mute') ) {
            $('body').css('cursor', 'pointer');
        } else if (1 === evt.button) {
            $('body').css('cursor', 'url(/viewpoint/look.png) 24 24, move');
        } else if ( -1 !== classes.indexOf('ldc-hitzone') ) {
            $('body').css('cursor', 'url(/viewpoint/pointer.png) 3 3, pointer');
        } else if ( 'mouseover-plane' === evt.target.className ) {
            // $('body').css('cursor', 'url(/viewpoint/default.png) 8 8, default');
            $('body').css('cursor', 'url(/viewpoint/forward.png) 24 6, n-resize');
        // } else if ( '5' !== evt.target.getAttribute('data-bulk') ) { // @todo better way of identifying lowland tiles?
        } else if ( -1 === classes.indexOf('ldc-navigation') ) {
            $('body').css('cursor', 'url(/viewpoint/forward.png) 24 6, n-resize');
        } else if ( evt.layerX < (window.innerWidth * .2) ) { // turn left
            $('body').css('cursor', 'url(/viewpoint/left.png) 3 20, w-resize');
        } else if ( evt.layerX > (window.innerWidth * .8) ) { // turn right
            $('body').css('cursor', 'url(/viewpoint/right.png) 45 20, e-resize');
        } else {
            $('body').css('cursor', 'url(/viewpoint/forward.png) 24 6, n-resize');
        }
    });


    //// Prevent zooming using the mousewheel or trackpad gesture.
    $(window).on('wheel', function (evt) { // replaces legacy 'mousewheel'
        evt.preventDefault();
        return false;
    });

}