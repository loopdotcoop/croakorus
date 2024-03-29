Config.flora = {
    name:         'Flora'
  , slug:         'flora'
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

  , xFloraFar: 50
  , zFloraFar: 50

  , decodedAudio: {}

  , schema: new SimpleSchema({
        x: {
            type: Number
          , label: "X"
        }
      , z: {
            type: Number
          , label: "Z"
        }
      , color: {
            type: String
          , label: "Color"
        }
      , type: {
            type: String
          , label: "Type"
        }
      , bulk: {
            type: Number // @todo check for integer?
          , label: "Bulk"
        }
      , pattern: {
            type: String
          , label: "Pattern"
        }
    })

  , changelog: [
        '+ flora@0.0.1-1   create ‘flora’ as a feature of ‘desoot@0.1.11-1’;  \n' +
        '                  `$ touch` eight empty files, following the ‘tiles’ feature;  \n' +
        '                  paste and edit code of ‘flora.config.js’ and ‘flora.collection.js’; '
      , '+ flora@0.0.1-2   create ‘flora.god.js’ and ‘about.god.js’, and the global ‘God’ object; '
      , '+ flora@0.0.1-3   adds ‘Cacti’ to the ‘Flora’ collection; '
      , '+ flora@0.0.1-4   renders cacti as simple cubes; cursor is `default` hovering over cacti; '
      , '+ flora@0.0.2     pause ‘flora’ development until ‘audio’ feature has been set up; '
      , '+ flora@0.0.3-1   add remaining beats from the `stone-circle-xxx00-XXXXXXX.mp3` files; '
      , '+ flora@0.0.3-2   solo a Flora when its distance is `0` (the user has clicked on it); '
      , '+ flora@0.0.3-3   render the remaining beats as sugarloafs; '
      , '+ flora@0.0.3-4   stones jump up when playing; '
      , '+ flora@0.0.4     tighter hit-box for Flora; spotlight when soloing Flora; '
    ], version: '0.0.4'
};


// Attach the ‘Collection2’ schema defined above.
Flora.attachSchema(Config.flora.schema);


