if (Meteor.isClient) {

    Template['tiles.list'].tiles = function () {
        return Tiles.find({});
    };

    Template['tiles.list'].tilesTable = function () {
        var key, val
          , table = { // 
                columns: []
              , subscription: 'tilesTable'
              , debug: false
            }
          , renderers = {
                height: function (data, type, row) { return data.split(' ').length + ' elements' }
            }
        ;

        //// Convert ‘key’ and ‘label’ from the ‘SimpleSchema’ object into the ‘data’ and ‘title’ of the ‘DataTable’ config object.
        for (key in Config.tiles.schema._schema) { // @todo will the order always be correct? also, `._schema` seems hacky; it could break in a future simple-schema release
            val = Config.tiles.schema._schema[key];
            if (renderers[key]) {
                table.columns.push({ data:key, title:val.label, mRender:renderers[key] }); // Add special rendering functionality to some columns
            } else {
                table.columns.push({ data:key, title:val.label });
            }
        }

        return table;
    };

}