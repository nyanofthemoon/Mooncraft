'use strict';

import Promise from 'bluebird';
import {Howl} from 'howler';

export function loadAudio(track) {
    return new Promise(function(resolve, reject) {
        let howl = new Howl({
            urls: [track.url],
            loop: track.loop,
            onload: function() {
                resolve({
                    id   : track.id,
                    track: howl
                });
            },
            onerror: function(err) {
                reject(err);
            }
        });
    });
}

export function loadAllAudiosWithProgress(tracks, progressCallback, concurrency = 2) {
    return Promise.resolve(tracks).map(function(track) {
        return loadAudio(track).then(
            function(loadedTrack) {
                progressCallback(loadedTrack);
                return loadedTrack;
            },
            function(err) {
                throw err;
            }
        )
    }, concurrency);
}