import {fromJS} from 'immutable';

import * as types from './../constants/ActionTypes'

const initialState = fromJS({
    status: 'loading',
    socket: null
});

const engine = (state = initialState, action) => {
    switch (action.type) {
        case types.LOADER_COMPLETION:
        case types.CONNECT_SOCKET_REQUESTED:
            return state.set('status', 'loaded')
        case types.CONNECT_SOCKET_SUCCEEDED:
            return state.set('status', 'connected')
        case types.CONNECT_SOCKET_FAILED:
            return state.set('status', 'loaded')
        default:
            return state
    }
}

export default engine