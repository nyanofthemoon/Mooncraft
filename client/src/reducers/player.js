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
    }
})

const player = (state = initialState, action) => {
    let actionIsInCurrentReducer = true;
    let newState;
    switch (action.type) {
        case types.QUERY_PLAYER_REQUESTED:
            break;
        case types.QUERY_PLAYER_RECEIVED:
            newState = fromJS(state).set('data', action.payload);
            break;
        default:
            actionIsInCurrentReducer = false;
            break;
    }
    if (Config.environment.isVerbose() && actionIsInCurrentReducer) { console.log('[Reducer  ] Player ' + action.type); }
    return newState || state;
}

export default player