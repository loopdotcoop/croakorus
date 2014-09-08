Config.home = {
    name:         'Home'
  , slug:         'home'
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
        '+ home@0.0.1-1   create ‘home’ as a feature of ‘desoot@0.1.1-1’;  \n' +
        '                 remove iron-router’s ‘yield’ system, as this interferes with x3dom; '
      , '+ home@0.0.2     the ‘home’ route is blank, for now; '
    ], version:'0.0.2'
};
