if (Meteor.isClient) {

    var x3dResize = function () {
        $('#x3d-main').css( 'height', $(window).height() );
        // setTimeout( function () { $('#x3d').focus(); }, 2000 ); // @todo is this working?
    };
    $(function() { // document ready
        $(window).on('resize', x3dResize);
        x3dResize();
    });

}
