//// Client and server.
Tracks = new Meteor.Collection('tracks');

Tracks.allow({
  //   insert: function () { return true; }
  // , update: function () { return true; }
  // , remove: function () { return true; }
});




//// Client only.
if (Meteor.isClient) {

    Meteor.subscribe('tracks');

}




//// Server only.
if (Meteor.isServer) {
    Tracks.allow({
        insert: function () { return true; }
    });
    // console.log( 'There are currently ' + Tracks.find({}).count() + ' Tracks.' );

    Meteor.publish('tracks', function () {
        return Tracks.find({});
    });

    TracksTable = new DataTableComponent({
        subscription: 'tracksTable'
      , collection: Tracks
    });
    TracksTable.publish();
}
