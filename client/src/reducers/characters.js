import {fromJS} from 'immutable';

import Config from './../config';
import * as types from './../constants/ActionTypes'

const initialState = fromJS({
    list       : {},
    coordinates: []
});

const characters = (state = initialState, action) => {
    let actionIsInCurrentReducer = true;
    let nextState;
    switch (action.type) {
        case types.ENTER_REGION_REQUESTED:
        case types.LEAVE_REGION_REQUESTED:
            break;
        case types.QUERY_CHARACTER_RECEIVED:
            // @TODO External Players Moved Inside Local Player Region
            break;
        case types.ENTER_REGION_RECEIVED:
            // @TODO External Players Entered Local Player Region
            break;
        case types.LEAVE_REGION_RECEIVED:
            // @TODO External Players Left Local Player Region
            break;
        default:
            actionIsInCurrentReducer = false;
            break;
    }
    if (Config.environment.isVerbose() && actionIsInCurrentReducer) { console.log('[Reducer  ] Character ' + action.type); }
    return nextState || state;
}

export default characters