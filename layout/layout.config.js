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
        '+ layout@0.0.2      paste and ‘public/layout/icon/’ and ‘layout/’ from looptopia@0.2.16; amend code; '
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
    Config.layout.x3dProcessIndicator   = true; // @todo fix
    Config.layout.x3dTogglePoints       = false;

    //// Belt and braces approach to waiting until the app is ready.
    Meteor.startup(function () {
        jQuery(function($) {

            //// Get a DOM reference to the main <X3D> element.
            Config.layout.x3dMain = document.getElementById('x3d-main');

            //// Get a jQuery reference to the main <CANVAS> element. @todo is this actually needed?
            Config.layout.$canvas = $('#x3dom-x3d-main-canvas');

            //// Get a jQuery reference to the main <VIEWPOINT>. @todo is this actually needed?
            Config.layout.$viewpoint = $('#vp0'); // The main <VIEWPOINT> at startup, which will be updated by `viewpoint.js` as the player moves around the tarrain

            //// Set up x3dom debugging tools. http://x3dom.org/docs-old/api.html
            var init = function () {
                // Config.layout.x3dMain.runtime.debug(            Config.layout.x3dShowLog        ); // @todo delete this line if <PARAM> does the job
                // Config.layout.x3dMain.runtime.statistics(       Config.layout.x3dShowStat       ); // @todo delete this line if <PARAM> does the job
                Config.layout.x3dMain.runtime.processIndicator( Config.layout.x3dProcessIndicator );
                if (Config.layout.x3dTogglePoints) { Config.layout.x3dMain.runtime.togglePoints(); }
            };

            //// `x3dMain.runtime` is not available yet, but it will be available at the first `requestAnimationFrame()` frame. @todo test on all devices
            requestAnimationFrame(init);

        });
    });

}

