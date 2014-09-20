var
    vpTally = 0
  , PI = Math.PI
  , halfPI = PI / 2
  , currentPosition = null
  , currentRotation = null
;


//// 
API = {
    viewpoint: {
        update: function (computation) {
            var newVp, x, y, z
              , newPosition = Session.get('position')
              , newRotation = Session.get('rotation')
            ;

            //// Deal with a change in position or rotation.
            if ( currentRotation !== newRotation || currentPosition !== newPosition.join(' ') ) {
                // console.log('position has changed!', currentPosition, newPosition, computation);

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

                //// 
                if ('ready' === Config.layout.x3dom) {
                // if (Config.layout.x3dMain && Config.layout.x3dMain.runtime) {

                    //// Create the transformed viewpoint after the current one, and give it a unique ID.
                    Config.layout.$viewpoint = $('#vp' + vpTally).after(newVp); // @todo do we actually need to record `Config.layout.$viewpoint`?

    // try {
                    //// Tell X3DOM to animate smoothly to the new <VIEWPOINT>.
                    Config.layout.x3dMain.runtime.nextView();
    // } catch (e) { console.log('no!' + vpTally); }
                    //// Delete the previous <VIEWPOINT>. @todo does this ever miss a deletion? if so, we could use a more aggressive deletion selector ... using the `:not` pseudo-class, for example https://developer.mozilla.org/en/docs/Web/CSS/:not
                    $('#vp' + vpTally).remove();

                    //// Prepare the viewpoint-tally for the next time the <VIEWPOINT> changes.
                    vpTally++;

                    //// Xx. 
                    currentRotation = newRotation;
                    currentPosition = newPosition.join(' ');

                }
            }
        }
    }
};