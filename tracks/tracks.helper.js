if (Meteor.isClient) {

    //// Allow any template to use `{{#each tracks}}`.
    UI.registerHelper('tracks', function() {

        var tracks, i, j, track, l, m, marker
          , position = Session.get('position') // @todo user db
          , x = position[0]
          , z = position[2]
          , xFar = Config.tracks.xFar
          , zFar = Config.tracks.zFar

            //// Restrict to nearby tracks. @todo enable selector
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

            //// Convert each marker from a string to an object.
            for (j=0, m=track.markers.length; j<m; j++) {
                marker = track.markers[j].split(' '); // each part will be a string, not a number, but that’s fine for inserting into a DOM attribute
                track.markers[j] = {
                    use: 'dst-tracks-wait-' + marker[0] // marker type (`1|2|3|4`), becomes an X3D `use` attribute
                  , x: marker[1]
                  , r: marker[2]
                  , z: marker[3]
                  , turn: { n: .5 * Math.PI, e: 0 , s: 1.5 * Math.PI, w: Math.PI }[ marker[2] ]
                  , mkri:  j + 1 // the first marker is `1`, not `0`
                  , mkrid: track._id + '-' + (j + 1) // the first marker is `1`, not `0`
                  , start: track.start
                  , trkid: 'dst-tracks-' + track._id
                  , order: j
                }
            }
        }

        return tracks;

    });


    //// Hide or show Track markers.
    UI.registerHelper('trackMarkerIsVisible', function() {
try {
        var
            routerCurrent = Router.current() || { path:'' } // eg '/140e147/track/140e147bq/1'
          , playResult = routerCurrent.path.match(/^\/(\d+)([nesw])(\d+)\/track\/(\d+)([nesw])(\d+)([a-z]{0,4})\/(\d+)$/) // eg `[ '/140e147/track/140e147bq/1', '140', 'e', '147', '140', 'e', '147', 'bq', '1' ]`
        ;
// console.log(playResult);
               if ( routerCurrent && '/track/make' === routerCurrent.path ) {
            return 'false';
        } else if (playResult && playResult[4] + playResult[5] + playResult[6] + playResult[7] === this.start) { // @todo playing THIS Track
// console.log(playResult[4] + playResult[5] + playResult[6] + playResult[7], this.start);
            return 'true';
        } else if (0 === this.order) {
            return 'true';
        } else {
            return 'false';
        }
} catch(e){console.log(e)}
    });


    //// Hide or show the ‘Make a Track’ button.
    UI.registerHelper('canMakeATrack', function() {
return false; // @todo enable again, with more intuitive gui
        var routerCurrent = Router.current();
        if (! routerCurrent) { return false; }
        if ( -1 === routerCurrent.path.indexOf('/track') ) { return true; }
        return false;
    });


    //// Return a string representing the user’s current coords and rotation.
    UI.registerHelper('xrz', function() {
        var
            xz = Session.get('position')
          , r = Session.get('rotation')
        ;
        return xz[0] + r + xz[2];
    });


    //// Xx.
    UI.registerHelper('nextMkri', function() {
        var trackadd = Api.tracks.trackadd;
        return (trackadd ? trackadd.length : 0) + 1;
    });


    var iconClickHandler = function (evt) {
        var xz, r;

        //// Deal with a click on a ‘Wait X Bars’ icon.
        if ( 'ldc-tracks-wait-' === evt.currentTarget.id.substr(0, 16) ) {
            xz = Session.get('position');
            r = Session.get('rotation');
            Api.tracks.trackadd.push(evt.currentTarget.id.substr(16) + ' ' + xz[0] + ' ' + r + ' ' + xz[2]);
        } else if ('ldc-tracks-abandon' === evt.currentTarget.id) {
            Api.tracks.tracknew = false;
            Api.tracks.trackadd = false;
        } else if ('ldc-tracks-release' === evt.currentTarget.id) {
console.log('release', Api.tracks.tracknew, Api.tracks.trackadd);

            Tracks.insert({
                user:    'blue-cat' // signifies generated by a user @todo get real username
              , start:   Api.tracks.tracknew
              , markers: Api.tracks.trackadd
              , xmin:    1
              , xmax:    2
              , zmin:    3
              , zmax:    4
            });

            Api.tracks.tracknew = false;
            Api.tracks.trackadd = false;
        }
    };

    Template['track.new'].events({
        "click a.ldc-icon": iconClickHandler
    });
    Template['track.add'].events({
        "click a.ldc-icon": iconClickHandler
    });

}
