//// Client and server.
Flora = new Meteor.Collection('flora');

Flora.allow({
  //   insert: function () { return true; }
  // , update: function () { return true; }
  // , remove: function () { return true; }
});




//// Client only.
if (Meteor.isClient) {

    Meteor.subscribe('flora');

}




//// Server only.
if (Meteor.isServer) {
    Flora.allow({
        insert: function () { return true; }
    });
    // console.log( 'There are currently ' + Flora.find({}).count() + ' Flora.' );

    Meteor.publish('flora', function () {
        return Flora.find({});
    });

    FloraTable = new DataTableComponent({
        subscription: 'floraTable'
      , collection: Flora
    });
    FloraTable.publish();
}
