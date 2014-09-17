if (Meteor.isClient) {

    Template['flora'].patternArray = function () {
try { // @ needed?
        var pt, l, dtl // point, length, detail
          , drawPoint  = God.flora.typeLut[this.type].drawPoint
          // , drawDetail = God.flora.typeLut[this.type].drawDetail
          , pattern = this.pattern.split('')
          , out = []
        ;
// console.log(this.type, typeof God.flora.typeLut[this.type]);
        for (pt=0, l=pattern.length; pt<l; pt++) {
            dtl = pattern[pt];
            if ('.' === dtl) { continue; } // ignore silent points
            out.push({
                lx:   drawPoint[pt].lx      // local x-position, relative to the (0,0) corner of the container Tile
              , lz:   drawPoint[pt].lz      // local z-position, relative to the (0,0) corner of the container Tile
              , turn: drawPoint[pt].turn    // for `rotation` attribute
              , use:  this.type + '-' + dtl // for `<transform use="{{use}}" ... ></transform>`
              , pt:   'point-' + pt         // for `<transform ... class="{{pt}}"></transform>`
            });
        }
        return out;
} catch (error) { console.log(error); }
    };

}

