import {fromJS} from 'immutable';

import * as types from './../constants/ActionTypes'

const initialState = fromJS({
    id: 'T0'
});

const region = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state
    }
}

export default region