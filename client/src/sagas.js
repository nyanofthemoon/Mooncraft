import { takeEvery, takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as types from './constants/ActionTypes'
import { createSocketConnection } from './helpers/socket'

function* connectSocket(action) {
    try {
        const socket = yield call(createSocketConnection, action.payload.username, action.payload.password);
        yield put({type: types.CONNECT_SOCKET_SUCCEEDED, socket: socket});
    } catch (e) {
        yield put({type: types.CONNECT_SOCKET_FAILED, message: e.message});
    }
}

export function* mySaga() {
    yield* takeLatest(types.CONNECT_SOCKET_REQUESTED, connectSocket);
}

