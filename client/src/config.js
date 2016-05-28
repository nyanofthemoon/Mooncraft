let host     = window.location.hostname;
let name     = 'production';
let port     = '';
let verbose  = false;
let music    = true;
let sound    = true;
let rotation = false;

if (['localhost', '127.0.0.1'].indexOf(host) > -1) {
    name     = 'development';
    port     = ':8888';
    verbose  = true;
    music    = true;
    sound    = true;
    rotation = true;
}

export default {
    audio: {
        musicIsEnabled: function() {
            return music;
        },
        soundIsEnabled: function() {
            return sound;
        }
    },
    graphic: {
        viewport: {
            size: {
                small : (640*480),
                medium: (800*600)
            }
        },
        tile: {
            size: {
                small : 32,
                medium: 48,
                large : 64
            }
        }
    },
    player: {
        mustFaceDirectionBeforeMoving: function() {
            return rotation;
        }
    },
    environment: {
        name: name,
        host: host,
        port: port,
        isDevelopment: function() {
            return 'development' === name
        },
        isVerbose: function() {
            return true === verbose
        }
    },
    debounce: {
        keyUp       : {
            interval: 100,
            options : {
                leading: true
            }
        },
        windowResize: {
            interval: 500,
            options : {
                leading: false
            }
        }
    }
};