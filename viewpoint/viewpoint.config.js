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
      , '+ viewpoint@0.0.1-2   viewpoint rotates if click position is within 20% of window edge; '
      , '+ viewpoint@0.0.1-3   cannot click on high terrain; cursor suggests movement or look-around; '
      , '+ viewpoint@0.0.1-4   limit viewpoint angles, to prevent seeing underneath; better mountain colors; '
      , '+ viewpoint@0.0.2     better land colors; highest mountains have more varied height; underground-plane; '
      , '+ viewpoint@0.0.3-1   underground-plane shows correct cursor when hovering over gap in terrain; '
      , '+ viewpoint@0.0.3-2   sky-planes show correct cursor when hovering over sky; '
      , '+ viewpoint@0.0.4     only show low hills which are nearby; replace `data-is-high` with `data-bulk`; '
      , '+ viewpoint@0.0.5-1   paste ‘client.init.js’ from 20140720-desoot-v0.1.9 into ‘layout.config.js’;  \n' +
        '                      move `Config.viewpoint.$ref` from ‘viewpoint.config.js’ to ‘layout.config.js’; '
      , '+ viewpoint@0.0.5-2   prevent zooming using the mousewheel or trackpad gesture;  \n' +
        '                      update the `viewpointRotation` session variable as the user looks around; '
      , '+ viewpoint@0.0.5-3   cursor PNGs from ‘ARTWORK/20140911-cursor-icons/01-cursor-icons.tif’;  \n' +
        '                      poll for `x3dMain.runtime.isReady` at increasing intervals in ‘layout.config.js’; '
      , '+ viewpoint@0.0.6     can click on mountains or sky to move forward a fixed amount; '
    ], version:     '0.0.6'
};

