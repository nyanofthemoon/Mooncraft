let host    = window.location.hostname;
let name    = 'production';
let port    = '';
let verbose = false;
let music   = true;
let sound   = true;

if (host === 'localhost') {
    name    = 'development';
    port    = ':8888';
    verbose = true;
    music   = false;
    sound   = true;
}

export default {
    audio: {
        musicIsEnabled: function () {
            return music;
        },
        soundIsEnabled: function () {
            return sound;
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