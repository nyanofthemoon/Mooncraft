let host     = window.location.hostname;
let name     = 'production';
let port     = '';
let verbose  = false;
let music    = true;
let sound    = true;
let rotation = false;

if (host === 'localhost') {
    name     = 'development';
    port     = ':8888';
    verbose  = true;
    music    = false;
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
    player: {
        mustFaceDirectionBeforeMoving: function() {
            return rotation;
        }
    },
    environment: {
        name     :    name,
        host     :    host,
        port     :    port,
        isDevelopment: function() {
            return name === 'development'
        },
        isVerbose: function() {
            return verbose === true
        }
    }
};