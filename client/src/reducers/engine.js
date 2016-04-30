import {fromJS} from 'immutable';

import Config from './../config';
import * as types from './../constants/ActionTypes'

const initialState = fromJS({
    status: 'loading'
});

const engine = (state = initialState, action) => {
    let actionIsInCurrentReducer = true;
    let newState = state;
    switch (action.type) {
        case types.ASSET_LOADER_COMPLETION:
        case types.CONNECT_SOCKET_REQUESTED:
            newState = state.set('status', 'loaded');
            break;
        case types.CONNECT_SOCKET_SUCCEEDED:
            newState = state.set('status', 'connected');
            break;
        case types.CONNECT_SOCKET_FAILED:
            newState = state.set('status', 'loaded');
            break;
        case types.QUERY_CYCLING_REQUESTED:
        case types.QUERY_CYCLING_RECEIVED:
            break;
        default:
            actionIsInCurrentReducer = false;
    }
    if (Config.environment.isVerbose() && actionIsInCurrentReducer) { console.log('[Reducer  ] Engine ' + action.type); }
    return newState;
}

export default engine