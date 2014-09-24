if (Meteor.isServer) {
    Meteor.startup(function () {
        Flora.remove({});

        //// The first time the app starts, generate initial Flora and record them into the `Flora` collection.
        if ( 0 !== Flora.find().count() ) {
            // console.log( Flora.find().count() );
        } else {
            console.log('The ‘Flora’ collection is empty...');
            for (var i=0, l=God.flora.types.length; i<l; i++) {
                God.flora.types[i].init();
            }
        }
    });
}
