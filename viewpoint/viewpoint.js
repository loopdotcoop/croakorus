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

      , parseClassesCache = { '-tally':0, '-limit':256 } // @todo benchtest values for `parseClassesCache['-limit']`

        //// An element with `class="a b_123 c-bar_baz d-foo d-bar_456"` has a lookup-table `{ a:true, b:123, c:{ bar:'baz' }, d:{ foo:true, bar:456 } }`.
      , parseClasses = function (raw) {
            var split, i, l, keyval, key, val, upos, hpos, k1, k2 // underscore-position, hyphen-position, key-level-1, key-level-2
              , lut = {} // lookup-table
            ;

            //// Parsing the class attribute is expensive, so we cache the result
            if (parseClassesCache[raw]) { return parseClassesCache[raw]; }

            //// Xx.
            split = raw.split(' ');
            for (i=0, l=split.length; i<l; i++) {
                keyval = split[i];
                upos = keyval.indexOf('_');
                if (-1 === upos) { // does not contain an underscore, so value is `true`
                    key = keyval;
                    val = true;
                } else { // contains an underscore, so parse the value
                    key = keyval.substr(0, upos);
                    val = keyval.substr(upos+1); // @todo convert string to number, where appropriate
                }
                hpos = key.indexOf('-'); // @todo test an underscore appearing before a hyphen ... should just put the hyphen into the value?
                if (-1 === hpos) { // does not contain a hyphen, so simple top-level value
                    lut[key] = val;
                } else { // contains one or more hyphens, so use nested objects @todo deal with 2+ hyphens
                    k1 = key.substr(0, hpos);
                    k2 = key.substr(hpos+1);
                    lut[k1] = lut[k1] || {}; // initialize the nested object, if missing
                    lut[k1][k2] = val;
                }
            }

            //// Purge the cache if it has grown too large.
            if (parseClassesCache['-tally'] > parseClassesCache['-limit']) {
                parseClassesCache = { '-tally':0, '-limit':parseClassesCache['-limit'] }
            }
            parseClassesCache['-tally']++;

            //// Cache and return the newly created lookup-table.
            parseClassesCache[raw] = lut;
            return lut;
        }

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
              // , classes = (  evt.target.getAttribute && ( evt.target.getAttribute('class') ? evt.target.getAttribute('class') : '' )  ).split(' ')
              , classes = parseClasses( evt.target.getAttribute ? evt.target.getAttribute('class') : '' )
              , ldc = classes.ldc || {} // classes used for all Looptopian apps
              , dst = classes.dst || {} // classes specific to the Desoot
            ;

            //// In croakorus, tiles are not clickable.
            if (ldc.tile || ldc.bgplane) { return; }

            //// Deal with a click on the water-surface or a hitzone.
            if (ldc.hitzone || ldc.navigation) {

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
            }

            //// Deal with a click on a hitzone.
            if (ldc.hitzone) {

                //// Move to a custom position, if present.
                if (ldc.center) {
                    xyz = evt.target.getAttribute('data-center').split(' ');
                    x = +xyz[0]; y = +xyz[1]; z = +xyz[2]; // nb, the intial `+` converts from string to number
                }

            } else {
                x = Math.floor(x-.5);
                z = Math.floor(z-.5);
            }

            //// Some hitzones force a direction-change, eg Track markers. @todo
            // if ( evt.target.getAttribute('data-turn') ) {
            // }

            //// Update the Topian’s position. @todo draw topian.
            if (dst.trackmarker) { // @todo dealing with a Track marker click should be done by by code inside the ‘tracks/’ directory
                markerId = evt.target.id.split('-'); // eg `<slopedcylinder id="Y8TTypXkugSS499YJ-3" ... >` becomes `['Y8TTypXkugSS499YJ','3']`
// console.log(3, markerId);
                // if ('0' === markerId[1]) {
                    Router.go('/' + dst.xrz + '/track/' + dst.start + '/' + dst.mkri); // eg `/55e147/track/47w188bq/7`
                    // markers = document.getElementsByClassName('dst-tracks-' + markerId[0]); // eg `<transform class="dst-tracks-Y8TTypXkugSS499YJ" ... >`
                    // for (i=0, l=markers.length; i<l; i++) { }
                // }
            } else if (Api.tracks.tracknew) {
                if (0 === Api.tracks.trackadd.length) {
                    Router.go( '/' + x + rotation + z + '/track/new' );
                } else {
                    Router.go(  '/' + x + rotation + z + '/track/add/' + Api.tracks.tracknew + '/' + ( Api.tracks.trackadd.length + 1 )  );
                }
            } else {
                Router.go( '/' + x + rotation + z );
            }

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

        //// Parse the `class` attribute of the element under the cursor.
        if (! evt.target.getAttribute) { return; }
        ldc = parseClasses( evt.target.getAttribute('class') || '' ).ldc; // `ldc` contains classes used for all Looptopian apps
        if (! ldc) { return; }

               if (ldc.auto) {
            $('body').css('cursor', 'auto');
        } else if (ldc.pointer) {
            $('body').css('cursor', 'pointer');
        } else if (1 === evt.button) {
            $('body').css('cursor', 'url(/viewpoint/look.png) 24 24, move');
        } else if (ldc.hitzone) {
            $('body').css('cursor', 'url(/viewpoint/pointer.png) 3 3, pointer');
        } else if (! ldc.navigation) { // in croakorus, tiles are not clickable
            $('body').css('cursor', 'auto');
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