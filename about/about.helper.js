if (Meteor.isClient) {

    //// Add some handy variables to Handlebars scope https://github.com/raix/Meteor-handlebar-helpers/tree/master#add-objects-to-the-cope
    Helpers.addScope('Config', Config);
    Helpers.addScope('Api', Api);
    // Helpers.addScope('Router', Router);


    //// Check whether the current user has superadministrator privileges.
    UI.registerHelper('isSuper', function () {
        return true; // @todo implement this, linked to looptopia user database
    });


    //// Handy for formatting values in <PRE> tables.
    UI.registerHelper('truncate', function (value, length) {
        return (value + '          ').slice(0, length);
    });


    //// Handy for formatting values in <PRE> tables.
    UI.registerHelper('pad', function (value, length) {
        return ('          ' + value).slice(-length);
    });

    //// Get the current path.
    UI.registerHelper('currentPath', function () {
        return Router.current() ? Router.current().path : null;
    });

}

//// http://stackoverflow.com/a/19131165
Handlebars.registerHelper('key_value', function(context, options) {
    var result = [];
    _.each(context, function(value, key, list) {
        result.push({key:key, value:value});
    });
    return result;
});
