//// Client and server.

Tiles = new Meteor.Collection('tiles');

Tiles.allow({
  //   insert: function () { return true; }
  // , update: function () { return true; }
  // , remove: function () { return true; }
});




//// Client only.

if (Meteor.isClient) {

    Meteor.subscribe('tiles');

}




//// Server only.

if (Meteor.isServer) {
    Tiles.allow({
        insert: function () { return true; }
    });
    // Tiles.insert({ rand: Math.floor( Math.random() * 100 ) });
    console.log( 'There are currently ' + Tiles.find({}).count() + ' Tiles.' );

    Meteor.publish('tiles', function () {
        return Tiles.find({});
    });

    TilesTable = new DataTableComponent({
        subscription: 'tilesTable'
      , collection: Tiles
    });
    TilesTable.publish();
}
