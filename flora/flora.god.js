God.flora = {
    types: [
        {
            name:   'Stone Circle'
          , plural: 'Stone Circles'
          , slug:   'stone-circle'
          , min: 0.01 // minimum number of this type of flora, as a fraction of empty Tiles
          , max: 0.1  // maximum, also as a fraction of empty Tiles
          , generate: function () {
                if (Meteor.isClient) { return; }
                console.log('generate a ' + this.name);
            }
          , init: function () {
                if (Meteor.isClient) { return; }
                console.log('flora.god.js: generate ' + Math.ceil(this.min * Config.tiles.lowlandTileCount) + ' ' + this.plural);
                for (var i = Math.ceil(this.min * Config.tiles.lowlandTileCount); i>0; i--) {
                    this.generate();
                }
            }
        }
      , {
            name:   'Cactus'
          , plural: 'Cacti'
          , slug:   'cactus'
          , min: 0.005 // minimum number of this type of flora, as a fraction of empty Tiles
          , max: 0.05  // maximum, also as a fraction of empty Tiles
          , generate: function () {
                if (Meteor.isClient) { return; }
                console.log('generate a ' + this.name);
            }
          , init: function () {
                if (Meteor.isClient) { return; }
                console.log('flora.god.js: generate ' + Math.ceil(this.min * Config.tiles.lowlandTileCount) + ' ' + this.plural);
                for (var i = Math.ceil(this.min * Config.tiles.lowlandTileCount); i>0; i--) {
                    this.generate();
                }
            }
        }
    ]
};


//// Generate a handy lookup-table of flora types. @todo is this needed?
God.flora.typeLut = {};
God.flora.types.forEach(function (value) {
    God.flora.typeLut[value.slug] = value;
});

