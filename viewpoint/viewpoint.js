if (Meteor.isClient) {

    //// Inital position and rotation, only used if the URL is ‘/’.
    Session.set('position', [Config.viewpoint.spawnX, 4, Config.viewpoint.spawnZ]); // @todo user db
    Session.set('rotation', 's'); // @todo user db

    //// Update the viewpoint whenever `Session.get('position')` or `Session.get('rotation')` change.
    Deps.autorun(Api.viewpoint.update); // @todo `Deps` becomes `Tracker` in meteor@0.9.1

    //// 
    UI.body.helpers({
        position: function () {
            return Session.get('position').join(' ');
        }
      , rotation: function () {
            return Session.get('rotation');
        }
      , viewpointPosition: function () {
            var lp = Session.get('position');
            return lp[0] + ' ' + (lp[1] + 6) + ' ' + (lp[2] + 10);
        }
      , spotlightPosition: function () {
            return Session.get('position')[0] + ' 15 ' + Session.get('position')[2];
        }
    });

    var mousedownTime = Number.NaN // before the first mousedown event, `(evt.timeStamp - mousedownTime)` is `NaN`, which correctly prevents dragging from being detected

        //// After a drag-to-look-around has finished, update the URL if necessary.
      , dragMouseup = function (evt) {
            var rotation
              , xrzt = /^\/(\d+)([nesw])(\d+)(\/[-.\/a-z0-9]*)?/.exec( Router.current().path ) // eg '/123w456/foobar' becomes `['/123w456/foobar','123','w','456', '/foobar']`
            ;
            if (null === xrzt) { return; } // URL is not a recognized Iron Router route, and/or does not begin with a position/rotation string
            rotation = Session.get('rotation');
            if (xrzt[2] !== rotation) { // URL does not already have the correct rotation @todo can the position (x and z) ever change during drag-to-look-around?
                Router.go( '/' + xrzt[1] + rotation + xrzt[3] + (xrzt[4] || '') ); // x and z are strings not numbers, and the trailing portion may be `undefined`
            }
        }

      , leftClick = function (evt) {
            var currPos, newVp, xyz, flora, markerId, markers, marker, i, l, translation
              , rotation = Session.get('rotation')
              , x = Math.floor(evt.worldX + evt.normalX / 2) + 0.5
              , y =            evt.worldY + evt.normalY / 2 // @todo height of center of square, from looking up terrain-data
              , z = Math.floor(evt.worldZ + evt.normalZ / 2) + 0.5
              , classes = (  evt.target.getAttribute && ( evt.target.getAttribute('class') ? evt.target.getAttribute('class') : '' )  ).split(' ')
            ;

            //// Deal with a click on a lowland terrain tile or a hitzone.
            if ( -1 !== classes.indexOf('ldc-hitzone') || -1 !== classes.indexOf('ldc-navigation') ) {

                //// Change the user’s orientation if they have clicked on the left or right 20% of the window. @todo try other ways of making the viewpoint rotation follow movement (nb, the <transform> element could be removed if we do some math on the <viewport> 'orientation' attribute)
                if ( evt.layerX < (window.innerWidth * .2) ) { // turn left
                    switch (rotation) {
                        case 'n': rotation = 'w'; break;
                        case 'e': rotation = 'n'; break;
                        case 's': rotation = 'e'; break;
                        case 'w': rotation = 's'; break;
                    }
//                    Session.set('rotation', rotation);
                } else if ( evt.layerX > (window.innerWidth * .8) ) { // turn right
                    switch (rotation) {
                        case 'n': rotation = 'e'; break;
                        case 'e': rotation = 's'; break;
                        case 's': rotation = 'w'; break;
                        case 'w': rotation = 'n'; break;
                    }
//                    Session.set('rotation', rotation);
                }

            //// Otherwise, deal with a click on high-ground (near the edge, or the central mountain), or the underground-plane, or the sky.
            } else {
                currPos = Session.get('position');
                x = currPos[0]; y = currPos[1]; z = currPos[2];

                //// Move by the three-querters of the ‘far’ distance, but don’t enter the mountains on the edges. @todo don’t enter the mountains in the middle.
                switch (rotation) {
                    case 'n':
                        z -= Math.floor( Config.tiles.zTileFar * .75 );
                        z = Math.max(z, Config.tiles.zTileSize * 3);
                        break;
                    case 'e':
                        x += Math.floor( Config.tiles.xTileFar * .75 );
                        x = Math.min( x, Config.tiles.xTerrainSize - (Config.tiles.xTileSize * 3) );
                        break;
                    case 's':
                        z += Math.floor( Config.tiles.zTileFar * .75 );
                        z = Math.min( z, Config.tiles.zTerrainSize - (Config.tiles.zTileSize * 3) );
                        break;
                    case 'w':
                        x -= Math.floor( Config.tiles.xTileFar * .75 );
                        x = Math.max(x, Config.tiles.xTileSize * 3);
                        break;
                }

                //// Get the ground-height at the new position.
                y = 1; // @todo get this info from the `tiles` db
// console.log(x,y,z);

            }

            //// For a click on a hitzone, center the viewpoint.
            if (  -1 !== classes.indexOf('ldc-hitzone') && evt.target.getAttribute('data-center') ) {
                xyz = evt.target.getAttribute('data-center').split(' ');
                x = +xyz[0]; y = +xyz[1]; z = +xyz[2]; // nb, the intial `+` converts from string to number
                if ( -1 === classes.indexOf('ldc-precise') ) {
                    x += (Config.tiles.xTileSize / 2);
                    z += (Config.tiles.zTileSize / 2);
                } else { // @todo dealing with a Track marker click should be done by by code inside the ‘tracks/’ directory
                    markerId = evt.target.id.split('-'); // eg `<slopedcylinder id="Y8TTypXkugSS499YJ-0" ... >` becomes `['Y8TTypXkugSS499YJ','0']`
                    if ('0' === markerId[1]) {
                        Router.go('/track/play'); // @todo add dynamic part (the ID of the track to play)
                        // markers = document.getElementsByClassName('dst-tracks-' + markerId[0]); // eg `<transform class="dst-tracks-Y8TTypXkugSS499YJ" ... >`
                        // for (i=0, l=markers.length; i<l; i++) { }
                    }
                }
            }

            //// Update the Topian’s position. @todo draw topian.
            Router.go( '/' + Math.floor(x-.5) + rotation + Math.floor(z-.5) );

            //// Some hitzones force a direction-change, eg Track markers. @todo
            // if ( evt.target.getAttribute('data-turn') ) {
            // }

        }

      , rightClick = function (evt) {
            console.log('rightClick!');
        }
    ;


    UI.body.events({
        "mousedown x3d": function (evt) {

            //// Begin checking whether the user is going to drag or click. @todo use `Config.viewpoint.dragX/Y`, to check whether on `evt.clientX/Y` have moved enough to justify a drag?
            if ('CANVAS' !== evt.target.tagName) { // the clicked object, eg 'ELEVATIONGRID', triggers a mousedown at the same time as the <CANVAS> element triggers a mousedown (the <CANVAS> element does not trigger mousemove events)
                mousedownTime = evt.timeStamp;
                Api.viewpoint.dragged = false;
            }
        }
      , "mousemove x3d": function (evt) {

            //// Check whether the user is dragging or clicking. @todo use `Config.viewpoint.dragX/Y`, to check whether on `evt.clientX/Y` have moved enough to justify a drag?
            if (! Api.viewpoint.dragged && Config.viewpoint.dragTime < (evt.timeStamp - mousedownTime) ) {
                Api.viewpoint.dragged = true;
            }
        }
      , "mouseup shape": function (evt) {
            if (Api.viewpoint.dragged) {
                dragMouseup(evt);
            } else if (1 === evt.button) {
                leftClick(evt);
            } else if (2 === evt.button || 4 === evt.button) {
                rightClick(evt);
            }
            mousedownTime = Number.NaN;
            Api.viewpoint.dragged = false;
        }
    });


    //// Cursor suggests left/right/forward move, and drag to look around.
    $(window).on('mousemove', function (evt) { // @todo disable for touchscreen devices
        if (! evt.target.getAttribute) { return; }
        var classes = evt.target.getAttribute('class');
        if (! classes) { return; }
        classes = classes.split(' ');
        if ( -1 !== classes.indexOf('auto') ) {
            $('body').css('cursor', 'auto');
        } else if ( -1 !== classes.indexOf('ldc-toggle-mute') ) {
            $('body').css('cursor', 'pointer');
        } else if (1 === evt.button) {
            $('body').css('cursor', 'url(/viewpoint/look.png) 24 24, move');
        } else if ( -1 !== classes.indexOf('ldc-hitzone') ) {
            $('body').css('cursor', 'url(/viewpoint/pointer.png) 3 3, pointer');
        } else if ( 'mouseover-plane' === evt.target.className ) {
            $('body').css('cursor', 'url(/viewpoint/forward.png) 24 6, n-resize');
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