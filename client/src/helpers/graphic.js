'use strict';

import Promise from 'bluebird';

export function loadGraphic(graphic) {
    return new Promise(function(resolve, reject) {
        var image    = new Image();
        image.onload = function() {
            resolve({
                id     : graphic.id,
                graphic: image
            });
        };
        image.onerror = function(err) {
            reject(err);
        };
        image.src = '/img/' + graphic.url;
    });
}

export function loadAllGraphicsWithProgress(graphics, progressCallback, concurrency = 2) {
    return Promise.resolve(graphics).map(function(graphic) {
        return loadGraphic(graphic).then(
            function(loadedGraphic) {
                progressCallback(loadedGraphic);
                return loadedGraphic;
            },
            function(err) {
                throw err;
            }
        )
    }, concurrency);
}