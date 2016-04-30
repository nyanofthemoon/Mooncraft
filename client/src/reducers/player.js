import {fromJS} from 'immutable';

import Config from './../config';
import * as types from './../constants/ActionTypes'

const initialState = fromJS({
    username: ''
})

const player = (state = initialState, action) => {
    let actionIsInCurrentReducer = true;
    let newState = state;
    switch (action.type) {
        case types.QUERY_PLAYER_REQUESTED:
        case types.QUERY_PLAYER_RECEIVED:
            break;
        default:
            actionIsInCurrentReducer = false;
    }
    if (Config.environment.isVerbose() && actionIsInCurrentReducer) { console.log('[Reducer  ] Player ' + action.type); }
    return newState;
}

export default player