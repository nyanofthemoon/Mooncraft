let host    = window.location.hostname;
let name    = 'production';
let port    = '';
let verbose = false;

if (host === 'localhost') {
    name    = 'development';
    port    = ':8888';
    verbose = true;
}

export default {
    environment: {
        name     :    name,
        host     :    host,
        port     :    port,
        isVerbose: function() {
            return verbose === true;
        }
    }
};