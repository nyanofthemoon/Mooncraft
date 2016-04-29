import * as types from './constants/ActionTypes'

import {setAudioAssets, playSound, playMusic} from './audio_controller';
import {createSocketConnection, emitSocketPlayerQueryEvent, emitSocketRegionQueryEvent} from './helpers/socket';

export function loaderCompletion(musics, sounds) {
    setAudioAssets(musics, sounds)
    playSound('intro')
    return { type: types.LOADER_COMPLETION }
}

export function connectSocket(username, password) {
    return {type: types.CONNECT_SOCKET_REQUESTED, payload: {username: username, password: password}};
}

export function connectSocketSuccess(socket) {
    return {type: types.CONNECT_SOCKET_SUCCEEDED, payload: {socket: socket}};
}

export function connectSocketFailure(message) {
    return {type: types.CONNECT_SOCKET_FAILED, payload: {message: message}};
}

export function queryPlayer(id) {
    return { type: types.QUERY_PLAYER, id }
}

export function queryRegion(id) {
    return { type: types.QUERY_REGION, id }
}

export function updatePlayer(data) {
    return { type: types.UPDATE_PLAYER, data }
}

export function updateRegion(data) {
    return { type: types.UPDATE_REGION, data }
}

export function disconnectSocket(id) {
    return { type: types.DISCONNECT_SOCKET, id }
}