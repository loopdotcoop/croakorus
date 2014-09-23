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

  , xFar: 40 // only subscribe to Tracks within 40 squares x-distance from the viewpoint
  , zFar: 40 // as above, for z-distance

  , schema: new SimpleSchema({
        user: {
            type: String,
            label: "User"
        }
      , markers: {
            type: [String],
            label: "Markers"
        }
      , start: {
            type: String,
            label: "Start"
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
    })

  , changelog: [
        '+ tracks@0.0.1-1    create ‘tiles’ as a feature of ‘desoot@0.1.21-1’; '
      , '+ tracks@0.0.1-2    `$ mrt add zurb-foundation`; style the ‘Make a Track’ button; '
      , '+ tracks@0.0.1-3    click ‘Make a Track’ to reveal ‘One Bar’, ‘Two Bars’, etc; '
      , '+ tracks@0.0.1-4    ‘tracks.collection.js’ based on ‘tiles.collection.js’;  \n' +
        '                    change singular ‘track’ to plural; render markers as `SlopedCylinder` nodes; '
      , '+ tracks@0.0.1-5    hide all markers when in ‘/track’ mode; click first marker to show others; '
      , '+ tracks@0.0.1-6    add `start` field to Tracks; '
      , '+ tracks@0.0.1-7    reordered Track fields; '
      , '+ tracks@0.0.1-8    respond to ‘/130e214’; update URL after drag-and-rotate; `Config.layout.x3dom`;  \n' +
        '                    more succinct `Session` variables; top-level `API` object, eg ‘viewpoint.api.js’;  \n' +
        '                    user friendly click-vs-drag detection, using `Config.viewpoint.dragTime`; '
      , '+ tracks@0.0.1-9    tidy code; '
      , '+ tracks@0.0.1-10   use `parseClasses()` to get data from X3Dom els; respond to click on Track marker; '
      , '+ tracks@0.0.1-11   router respond to click on Track marker; '
      , '+ tracks@0.0.1-12   proper route on Track marker click; proper position and rotation on Track marker click; '
      , '+ tracks@0.0.1-13   while playing, update route (and move) on each bar-start; '
      , '+ tracks@0.0.1-14   ‘Stop Playing Track’ button works; '
      , '+ tracks@0.0.1-15   records a user-generated Track; '
    ], version:  '0.0.1-15'
};


// Attach the ‘Collection2’ schema defined above.
Tracks.attachSchema(Config.tracks.schema);




