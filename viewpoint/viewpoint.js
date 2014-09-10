if (Meteor.isClient) {

    Session.set('looptopianPosition', [140,4,130]); // @todo user db
    Session.set('viewpointRotation', 'south'); // @todo user db

    UI.body.helpers({
        looptopianPosition: function () {
            return Session.get('looptopianPosition').join(' ');
        }
      , viewpointPosition: function () {
            var lp = Session.get('looptopianPosition');
            return lp[0] + ' ' + (lp[1] + 6) + ' ' + (lp[2] + 10);
        }
    });

    var
        vpTally = 0
      , PI = Math.PI
      , halfPI = PI / 2
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

            var newVp, vpRotation
              , x = Math.floor(evt.worldX + evt.normalX / 2) + 0.5
              , y =            evt.worldY + evt.normalY / 2 // @todo height of center of square, from looking up terrain-data
              , z = Math.floor(evt.worldZ + evt.normalZ / 2) + 0.5
            ;

            if (1 === evt.button) {
                // console.log('Left Click ', evt, x, y, z, evt.currentTarget.id, vpTally);

                //// Prevent viewpoint from getting too near the edge, or climbing the central mountain.
                if ( '5' !== evt.target.getAttribute('data-bulk') ) { return; } // @todo alert user this is not allowed? @todo better way of identifying lowland tiles?

                //// Update the Topian’s position. @todo draw topian
                Session.set('looptopianPosition', [x,y,z]);

                //// Change the user’s orientation if they have click on the left or right 20% of the window. @todo try other ways of making the viewpoint rotation follow movement (nb, the <transform> element could be removed if we do some math on the <viewport> 'orientation' attribute)
                vpRotation = Session.get('viewpointRotation');
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
                Config.viewpoint.$ref = $('#vp' + vpTally).after(newVp); // @todo do we actually need to record `Config.viewpoint.$ref`?

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
        // console.log(evt);
        if (1 === evt.button) {
            $('body').css('cursor', 'move');
        } else if ( 'mouseover-plane' === evt.target.className ) {
            $('body').css('cursor', 'default');
        } else if ( '5' !== evt.target.getAttribute('data-bulk') ) { // @todo better way of identifying lowland tiles?
            $('body').css('cursor', 'default');
        } else if ( evt.layerX < (window.innerWidth * .2) ) { // turn left
            $('body').css('cursor', 'w-resize');
        } else if ( evt.layerX > (window.innerWidth * .8) ) { // turn right
            $('body').css('cursor', 'e-resize');
        } else {
            $('body').css('cursor', 'n-resize');
        }
    });

}