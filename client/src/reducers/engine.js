import {fromJS} from 'immutable';

import Config from './../config';
import * as types from './../constants/ActionTypes'

const initialState = fromJS({
    status: 'loading',
    notifications: ['Welcome to MoonCraft!', 'https://mooncraft.protolicio.us', 'https://github.com/nyanofthemoon/Mooncraft', 'by Paule Lepage', '']
});

const engine = (state = initialState, action) => {
    let actionIsInCurrentReducer = true;
    let nextState;
    switch (action.type) {
        case types.ASSET_LOADER_COMPLETION:
        case types.CONNECT_SOCKET_REQUESTED:
            nextState = fromJS(state).set('status', 'loaded');
            break;
        case types.CONNECT_SOCKET_SUCCEEDED:
            nextState = fromJS(state).set('status', 'connected');
            break;
        case types.CONNECT_SOCKET_FAILED:
            nextState = fromJS(state).set('status', 'loaded');
            break;
        case types.QUERY_CYCLING_RECEIVED:
            nextState = fromJS(state).set('notifications', fromJS(state).get('notifications').push('The daily cycle has changed to the ' + action.payload.cycle + '.'));
            break;
        case types.CHARACTER_ENTER_REGION_RECEIVED:
            nextState = fromJS(state).set('notifications', fromJS(state).get('notifications').push(action.payload.name + ' enters the region.'));
            break;
        case types.CHARACTER_LEAVE_REGION_RECEIVED:
            nextState = fromJS(state).set('notifications', fromJS(state).get('notifications').push(action.payload.name + ' leaves the region.'));
            break;
        case types.CHARACTER_SAY_REGION_RECEIVED:
            nextState = fromJS(state).set('notifications', fromJS(state).get('notifications').push(action.payload.name + ' says "' + action.payload.message + '".'));
            break;
        case types.PLAYER_SAY_REGION_RECEIVED:
            nextState = fromJS(state).set('notifications', fromJS(state).get('notifications').push('You said "' + action.payload.message + '".'));
            break;
        case types.QUERY_COORDINATES_RECEIVED:
            nextState = fromJS(state).set('notifications', fromJS(state).get('notifications').push('You see... ' + action.payload.description));
            break;
        default:
            actionIsInCurrentReducer = false;
            break;
    }
    if (Config.environment.isVerbose() && actionIsInCurrentReducer) { console.log('[Reducer  ] Engine ' + action.type); }
    return nextState || state;
}

export default engine