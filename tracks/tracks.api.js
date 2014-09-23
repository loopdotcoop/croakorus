//// 
Api.tracks = {
}

if (Meteor.isClient) {
    Api.tracks.trackplay = false; // ‘tracks.route.js’ will set this to `{ next:'/140s147/track/140s147bq/7', wait:1, until:4 }`, during track-playback
    Api.tracks.tracknew  = false; // an `xrz` value after user has clicked ‘Make a Track’
    Api.tracks.trackadd  = false; // `[]` before the first marker of a Track has been added, then `['4 140 s 147']` after the first marker is added, then `['3 140 s 147', '1 145 e 138']` after the second, etc
}

