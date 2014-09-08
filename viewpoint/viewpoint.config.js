Config.viewpoint = {
    name:         'Viewpoint'
  , slug:         'viewpoint'
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
        '+ viewpoint@0.0.1-1   create ‘viewpoint’ as a feature of ‘desoot@0.1.1-1’;  \n' +
        '                      paste ‘viewpoint.js’ from 20140720-desoot-v0.1.9 ‘viewpoint.js’ and edit code;  \n' +
        '                      add `Config.viewpoint.$ref` to ‘viewpoint.config.js’;  \n' +
        '                      add `Config.layout.x3dMain` to ‘layout.config.js’; '
    ], version:     '0.0.1-1'
};


//// When the page is ready, a reference to the main <VIEWPOINT>. @todo is this actually needed?
if (Meteor.isClient) {
    Config.viewpoint.$ref = null;
    jQuery(function($) { // jQuery document ready
        Config.viewpoint.$ref = $('#vp0'); // The main <VIEWPOINT> at startup, which will be updated by `viewpoint.js` as the player moves around the tarrain
    });
}