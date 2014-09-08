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


//// When the page is ready, get a DOM reference to the main <X3D> element.
if (Meteor.isClient) {
    Config.layout.x3dMain = null;
    Config.layout.$canvas = null;
    jQuery(function($) { // jQuery document ready
        Config.layout.x3dMain = document.getElementById('x3d-main');
        Config.layout.$canvas = $('#x3dom-x3d-main-canvas');
    });
}

