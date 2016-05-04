import {fromJS} from 'immutable';

import Config from './../config';
import * as types from './../constants/ActionTypes'

const initialState = fromJS({
    data: {
        name: "Unnamed",
        icon: "players/default.gif",
        inventory: {},
        region: {
            id: null,
            x : 0,
            y : 0
        }
    },
    direction: "down"
})

const player = (state = initialState, action) => {
    let actionIsInCurrentReducer = true;
    let newState;
    switch (action.type) {
        case types.QUERY_PLAYER_REQUESTED:
            break;
        case types.QUERY_PLAYER_RECEIVED:
            // @TODO DIFFERENCIATE BEWTEEN LOCAL PLAYER AND EXTERNAL PLAYER
            // @TODO Received external players movements
            newState = fromJS(state).set('data', action.payload);
            break;
        case types.MOVE_UP_REQUESTED:
            newState = fromJS(state).set('direction', 'up');
            break;
        case types.MOVE_RIGHT_REQUESTED:
            newState = fromJS(state).set('direction', 'right');
            break;
        case types.MOVE_DOWN_REQUESTED:
            newState = fromJS(state).set('direction', 'down');
            break;
        case types.MOVE_LEFT_REQUESTED:
            newState = fromJS(state).set('direction', 'left');
            break;
        case types.MOVE_LEFTUP_REQUESTED:
            newState = fromJS(state).set('direction', 'leftup');
            break;
        case types.MOVE_RIGHTUP_REQUESTED:
            newState = fromJS(state).set('direction', 'rightup');
            break;
        case types.MOVE_LEFTDOWN_REQUESTED:
            newState = fromJS(state).set('direction', 'leftdown');
            break;
        case types.MOVE_RIGHTDOWN_REQUESTED:
            newState = fromJS(state).set('direction', 'rightdown');
            break;
        default:
            actionIsInCurrentReducer = false;
            break;
    }
    if (Config.environment.isVerbose() && actionIsInCurrentReducer) { console.log('[Reducer  ] Player ' + action.type); }
    return newState || state;
}

export default player