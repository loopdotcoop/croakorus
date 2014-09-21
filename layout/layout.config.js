Config.layout = {
    name:         'Layout'
  , slug:         'layout'
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

  , changelog: [
        '+ layout@0.0.2      paste ‘public/layout/icon/’ and ‘layout/’ from looptopia@0.2.16; amend code; '
    ], version:  '0.0.2'
};


//// Run clientside config which must wait until the app is ready.
if (Meteor.isClient) {

    //// Initialize the jQuery and DOM references.
    Config.layout.x3dMain    = null;
    Config.layout.$canvas    = null;
    Config.layout.$viewpoint = null;

    //// Values for X3Dom <PARAM> elements. http://x3dom.org/download/1.4/docs/html/configuration.html#configuration
    Config.layout.x3dShowLog            = false;
    Config.layout.x3dShowStat           = false;
    Config.layout.x3dShowProgress       = true; // 'true|false|bar'
    Config.layout.x3dDisableDoubleClick = true;
    Config.layout.x3dDisableRightDrag   = false; // @todo fix

    //// Values for the X3Dom `runtime` object.
    Config.layout.x3dProcessIndicator   = false; // @todo fix
    Config.layout.x3dTogglePoints       = false;

    //// Belt and braces approach to waiting until the app is ready.
    Meteor.startup(function () {
        jQuery(function($) {

            //// Get a jQuery reference to the main <CANVAS> element. @todo is this actually needed?
            Config.layout.$canvas = $('#x3dom-x3d-main-canvas');

            //// Get a jQuery reference to the main <VIEWPOINT>. @todo is this actually needed?
            Config.layout.$viewpoint = $('#vp0'); // The main <VIEWPOINT> at startup, which will be updated by `viewpoint.js` as the player moves around the tarrain

            //// Get a DOM reference to the main <X3D> element.
            Config.layout.x3dMain = document.getElementById('x3d-main');

            //// Set up x3dom debugging tools. http://x3dom.org/docs-old/api.html @todo test on all devices
            var
                timeout = 5 // we poll for `x3dMain.runtime.isReady` at increasing intervals. @todo why does `Config.layout.x3dMain.ready()` never fire? http://x3dom.org/download/1.4/docs/html/api.html#ready
              , init = function () {
                    if ( 5000 < (timeout *= 2) ) { throw new Error('Tested `Config.layout.x3dMain.isReady` ten times!', Config.layout.x3dMain); }
                    if ('undefined' === typeof Config.layout.x3dMain.runtime || ! Config.layout.x3dMain.runtime.isReady) {
                        window.setTimeout(init, timeout);
                    } else {
                        // Config.layout.x3dMain.runtime.debug(            Config.layout.x3dShowLog        ); // @todo delete this line if <PARAM> does the job
                        // Config.layout.x3dMain.runtime.statistics(       Config.layout.x3dShowStat       ); // @todo delete this line if <PARAM> does the job
                        Config.layout.x3dMain.runtime.processIndicator( Config.layout.x3dProcessIndicator );
                        if (Config.layout.x3dTogglePoints) { Config.layout.x3dMain.runtime.togglePoints(); }

                        //// Let the system know that X3Dom is ready.
                        Config.layout.x3dom = 'ready';

                        //// If the window has loaded with position coords, X3Dom will not have been ready to update the <VIEWPOINT> when `Session.get('position')` was updated.
                        Api.viewpoint.update();

                    }
                }
            ;
            window.setTimeout(init, timeout);

        });
    });

}

