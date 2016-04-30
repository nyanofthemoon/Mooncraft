import {fromJS} from 'immutable';

import Config from './../config';
import * as types from './../constants/ActionTypes'

const initialState = fromJS({
    id: 'T0'
});

const region = (state = initialState, action) => {
    let actionIsInCurrentReducer = true;
    let newState = state;
    switch (action.type) {
        case types.QUERY_REGION_REQUESTED:
        case types.QUERY_REGION_RECEIVED:
            break;
        default:
            actionIsInCurrentReducer = false;
    }
    if (Config.environment.isVerbose() && actionIsInCurrentReducer) { console.log('[Reducer  ] Region ' + action.type); }
    return newState;
}

export default region