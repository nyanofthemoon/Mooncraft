import {fromJS} from 'immutable';

import * as types from './../constants/ActionTypes'

const initialState = fromJS({
    username: ''
})

const player = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state
    }
}

export default player