var
    vpTally = 0
  , PI = Math.PI
  , halfPI = PI / 2
  , currentPosition = null
  , currentRotation = null
;


//// 
Api = {
    viewpoint: {

        dragged: false // modified by viewpoint `UI.body.events(...)`

      , update: function (computation) {

            //// nb, these two `Session.get()` calls MUST be made before the `(Api.viewpoint.dragged)` and `('ready' !== Config.layout.x3dom)` conditionals, for reactivity to work.
            var newVp, x, y, z
              , newPosition = Session.get('position')
              , newRotation = Session.get('rotation')
            ;

            //// Don’t update the viewpoint while the user is dragging to look around, or before X3Dom is ready.
            if (Api.viewpoint.dragged) { return; }
            if ('ready' !== Config.layout.x3dom) { return; }

            //// Deal with a change in position or rotation (this shouldn’t be done while the user is dragging to look around).
            if ( currentRotation !== newRotation || currentPosition !== newPosition.join(' ') ) {

                x = newPosition[0];
                y = newPosition[1];
                z = newPosition[2];

                //// Prepare a new transformed viewpoint.
                newVp =
                    '<transform '
                  + 'id="'                   + 'vp' + (vpTally + 1)               + '" '
                ;
                switch (newRotation) {
                    case 'n':
                        newVp +=
                            'translation="'  + x + ' ' + (y + 2) + ' ' + (z + 10) + '" '
                          + 'rotation="'     + '0 1 0  0'                         + '" '
                          + '>'
                        ;
                        break;
                    case 'e':
                        newVp +=
                            'translation="'  + (x - 10) + ' ' + (y + 2) + ' ' + z + '" '
                          + 'rotation="'     + '0 1 0  -' + halfPI                + '" '
                          + '>'
                        ;
                        break;
                    case 's':
                        newVp +=
                            'translation="'  + x + ' ' + (y + 2) + ' ' + (z - 10) + '" '
                          + 'rotation="'     + '0 1 0  ' + PI                     + '" '
                          + '>'
                        ;
                        break;
                    case 'w':
                        newVp +=
                            'translation="'  + (x + 10) + ' ' + (y + 2) + ' ' + z + '" '
                          + 'rotation="'     + '0 1 0  ' + halfPI                 + '" '
                          + '>'
                        ;
                        break;
                }
                newVp +=
                      '<viewpoint '
                  +   'centerOfRotation="'   + x + ' ' + y + ' ' + z              + '" '
                  +   'position="'           + '0 0 0'                            + '" '
                  +   'orientation="'        + '1 0 0  -.2'                       + '" '
                  +   '>'
                  +   '</viewpoint>'
                  + '</transform>'
                ;

                //// Create the transformed viewpoint after the current one, and give it a unique ID.
                Config.layout.$viewpoint = $('#vp' + vpTally).after(newVp); // @todo do we actually need to record `Config.layout.$viewpoint`?

                //// Tell X3Dom to animate smoothly to the new <VIEWPOINT>.
                Config.layout.x3dMain.runtime.nextView();

                //// Delete the previous <VIEWPOINT>. @todo does this ever miss a deletion? if so, we could use a more aggressive selector... the `:not` pseudo-class, for example https://developer.mozilla.org/en/docs/Web/CSS/:not
                $('#vp' + vpTally).remove();

                //// Prepare the viewpoint-tally for the next time the <VIEWPOINT> changes.
                vpTally++;

                //// Xx. 
                currentRotation = newRotation;
                currentPosition = newPosition.join(' ');

            }
        }
    }
};