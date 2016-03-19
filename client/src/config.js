let host    = window.location.hostname;
let name    = 'production';
let port    = '';
let verbose = false;

if (host === 'localhost') {
    name    = 'development';
    port    = ':8000';
    verbose = true;
}

export default {
    environment: {
        name:      name,
        host:      host,
        port:      port,
        verbose:   verbose
    }
};