if (Meteor.isClient) {

    //// Allow any template to use `{{#each tracks}}`.
    UI.registerHelper('tracks', function() {

        var tracks, i, j, track, l, m, marker
          , position = Session.get('looptopianPosition') // @todo user db
          , x = position[0]
          , z = position[2]
          , xFar = Config.tracks.xFar
          , zFar = Config.tracks.zFar

            //// Restrict to nearby tracks.
          , selector = {
              //   xmin: { $gte: x - xFar }
              // , xmax: { $lte: x + xFar }
              // , zmin: { $gte: z - zFar }
              // , zmax: { $lte: z + zFar }
            }
        ;

        //// Find all nearby Tracks.
        tracks = Tracks.find(selector).fetch();

        //// Convert each Track to a format which Handlebars can easily parse.
        for (i=0, l=tracks.length; i<l; i++) {
            track = tracks[i];

            //// Convert each marker from a string to an array.
            for (j=0, m=track.markers.length; j<m; j++) {
                marker = track.markers[j].split(' '); // each part will be a string, not a number, but that’s fine for inserting into a DOM attribute
                track.markers[j] = { // replace the string with an object
                    use:   'dst-tracks-wait-' + marker[0] // marker type (`1|2|3|4`), becomes an X3D `use` attribute
                  , x:     marker[1]
                  , z:     marker[2]
                  , turn:  marker[3]
                  , mkrid: track._id + '-' + j
                  , trkid: 'dst-tracks-' + track._id
                  , order: j
                }
            }
        }

        return tracks;

    });


    //// Hide or show Track markers.
    UI.registerHelper('trackMarkerIsVisible', function() {
        var routerCurrent = Router.current();
               if ( routerCurrent && '/track/make' === routerCurrent.path ) {
            return 'false';
        } else if ( routerCurrent && '/track/play' === routerCurrent.path ) { // @todo playing THIS Track
            return 'true';
        } else if (0 === this.order) {
            return 'true';
        } else {
            return 'false';
        }
    });


}
