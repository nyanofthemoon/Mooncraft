'use strict';

let chalk = require('chalk');

class Logger {

    constructor(namespace, config) {
        this.namespace = namespace;
        if (config && config.environment.verbose) {
            this.debug = true
        } else {
            this.debug = false;
        }
    }

    log(color, message) {
        console.log(chalk[color](chalk.bold(this.namespace) + ' ' + message));
    }

    error(message) {
        this.log('red', message);
    }

    info(message) {
        this.log('cyan', message);
    }

    success(message) {
        this.log('green', message);
    }

    verbose(message) {
        if (this.debug) {
            this.log('grey', message);
        }
    }

    warning(message) {
        this.log('yellow', message);
    }

};

module.exports = Logger;