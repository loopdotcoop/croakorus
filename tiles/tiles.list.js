if (Meteor.isClient) {

    Template['tiles.list'].tiles = function () {
        return Tiles.find({});
    };

    Template['tiles.list'].tilesTable = function () {
        return {
            columns: [{
                title: 'Rand'
              , data:  'rand'
            },{
                title: 'ID'
              , data:  '_id'
            }]
          // , rows: Tiles.find({}).fetch()
          , subscription: 'tilesTable'
          , debug: false
        };
    };

}