if (Meteor.isClient) {

    //// Add some handy variables to Handlebars scope https://github.com/raix/Meteor-handlebar-helpers/tree/master#add-objects-to-the-cope
    Helpers.addScope('Config', Config);
    // Helpers.addScope('Router', Router);

}

//// http://stackoverflow.com/a/19131165
Handlebars.registerHelper('key_value', function(context, options) {
    var result = [];
    _.each(context, function(value, key, list) {
        result.push({key:key, value:value});
    });
    return result;
});
