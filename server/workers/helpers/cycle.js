'use strict';

const MORNING   = 'morning';
const AFTERNOON = 'afternoon';
const EVENING   = 'evening';
const NIGHT     = 'night';

class Cycle {

    static evaluate() {
        let hour = new Date().getHours();
        if (hour >= 5 && hour <= 12) {
            return MORNING;
        } else if (hour >= 12 && hour <= 17) {
            return AFTERNOON;
        } else if (hour >= 17 && hour <= 21) {
            return EVENING;
        } else {
            return NIGHT;
        }
    }

    static isDaytime() {
        return evaluate() == (MORNING || AFTERNOON);
    }

    static isNighttime() {
        return evaluate() == (EVENING || NIGHT);
    }

};

module.exports = Cycle;