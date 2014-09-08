if (Meteor.isClient) {

    Session.set('looptopianPosition', [40,2,40]); // @todo user db

    UI.body.helpers({
        looptopianPosition: function () {
            return Session.get('looptopianPosition').join(' ');
        }
      , viewpointPosition: function () {
            var lp = Session.get('looptopianPosition');
            return lp[0] + ' ' + (lp[1] + 6) + ' ' + (lp[2] + 10);
        }
    });

    var vpTally = 0;

    UI.body.events({
        "mousedown x3d": function () {
            dragged = false;
        }
      , "mousemove x3d": function () {
            dragged = true;
        }
      , "mouseup shape": function (evt) {

            if (dragged) { return; }

            var x = Math.floor(evt.worldX + evt.normalX / 2) + 0.5
              , y =            evt.worldY + evt.normalY / 2 // @todo height of center of square, from looking up terrain-data
              , z = Math.floor(evt.worldZ + evt.normalZ / 2) + 0.5
            ;

            if (1 === evt.button) {
                console.log('Left Click ', x, y, z, evt.currentTarget.id, vpTally);
                Session.set('looptopianPosition', [x,y,z]);

                //// Create a new <VIEWPOINT> after the current one, and give it a unique ID.
                Config.viewpoint.$ref = $('#vp' + vpTally).after('<viewpoint id="vp' + (++vpTally) + '" centerOfRotation="' + [x,y,z].join(' ') + '" position="' + x + ' ' + (y + 2) + ' ' + (z + 10) + '" orientation="1 0 0  -.2"></viewpoint>'); //@todo do we actually need to record `Config.viewpoint.$ref`?

                //// Tell X3DOM to animate smoothly to the new <VIEWPOINT>.
                Config.layout.x3dMain.runtime.nextView();

                //// Delete the previous <VIEWPOINT>. @todo does this ever miss a deletion? if so, we could use a more aggressive deletion selector ... using the `:not` pseudo-class, for example https://developer.mozilla.org/en/docs/Web/CSS/:not
                $('#vp' + (vpTally - 1) ).remove();

            } else if (2 === evt.button || 4 === evt.button) {
                console.log('Right Click ', x, y, z, evt.currentTarget.id);
            }
        }
    });

}