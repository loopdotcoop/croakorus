Config.tracks = {
    name:         'Tracks'
  , slug:         'tracks'
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

  , xFar: 40 // only subscribe to Tracks within 40 squares x-distance from teh viewpoint
  , zFar: 40 // as above, for z-distance

  , schema: new SimpleSchema({
        user: {
            type: Number,
            label: "User"
        }
      , xmin: {
            type: Number,
            label: "X Min Boundary"
        }
      , xmax: {
            type: Number,
            label: "X Max Boundary"
        }
      , zmin: {
            type: Number,
            label: "Z Max Boundary"
        }
      , zmax: {
            type: Number,
            label: "Z Max Boundary"
        }
      , markers: {
            type: [String],
            label: "Markers"
        }
    })

  , changelog: [
        '+ tracks@0.0.1-1    create ‘tiles’ as a feature of ‘desoot@0.1.21-1’; '
      , '+ tracks@0.0.1-2    `$ mrt add zurb-foundation`; style the ‘Make a Track’ button; '
      , '+ tracks@0.0.1-3    click ‘Make a Track’ to reveal ‘One Bar’, ‘Two Bars’, etc; '
      , '+ tracks@0.0.1-4    ‘tracks.collection.js’ based on ‘tiles.collection.js’;  \n' +
        '                    change singular ‘track’ to plural; render markers as `SlopedCylinder` nodes; '
      , '+ tracks@0.0.1-5    hide all markers when in ‘/track’ mode; click first marker to show others; '
    ], version:  '0.0.1-5'
};


// Attach the ‘Collection2’ schema defined above.
Tracks.attachSchema(Config.tracks.schema);


