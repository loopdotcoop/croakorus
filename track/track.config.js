Config.track = {
    name:         'Track'
  , slug:         'track'
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
        '+ track@0.0.1-1    create ‘tiles’ as a feature of ‘desoot@0.1.21-1’; '
      , '+ track@0.0.1-2    `$ mrt add zurb-foundation`; style the ‘Make a Track’ button; '
      , '+ track@0.0.1-3    click ‘Make a Track’ to reveal ‘One Bar’, ‘Two Bars’, etc; '
    ], version: '0.0.1-3'
};
