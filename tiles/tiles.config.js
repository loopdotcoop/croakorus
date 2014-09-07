Config.tiles = {
    name:         'Tiles'
  , slug:         'tiles'
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

  , schema: new SimpleSchema({
        rand: {
            type: Number,
            label: "Random"
        }
    })

  , changelog: [
        '+ tiles@0.0.1-1   create ‘tiles’ as a feature of ‘desoot@0.1.1-1’;  \n' +
        '                  paste ‘tiles/tiles.*.*’ from looptopia@0.2.18 ‘topians/topians.*.*’ and edit code; '
      , '+ tiles@0.0.1-2   `$ mrt add autoform`; '
      , '+ tiles@0.0.1-3   `$ mrt add jquery-datatables`; '
    ], version: '0.0.1-3'
};


// Attach the ‘Collection2’ schema defined above.
Tiles.attachSchema(Config.tiles.schema);


