import Config from './config';
import * as types from './constants/ActionTypes'
import {setAudioAssets, playSound, playMusic} from './audio_controller';
import {createSocketConnection, emitSocketCyclingQueryEvent, emitSocketPlayerQueryEvent, emitSocketRegionQueryEvent} from './helpers/socket';

let socket;
let dispatch;

export function assetLoaderCompletion(musics, sounds) {
    if (Config.environment.isVerbose()) { console.log('[Redux    ] Run ' + types.ASSET_LOADER_COMPLETION); }
    setAudioAssets(musics, sounds)
    playSound('intro')
    return {type: types.ASSET_LOADER_COMPLETION}
}

export function connectSocket(username, password, store) {
    if (Config.environment.isVerbose()) { console.log('[Redux    ] Run ' + types.CONNECT_SOCKET_REQUESTED); }
    socket   = createSocketConnection(username, password, store);
    dispatch = store.dispatch;
    socket.on('error', connectSocketFailure)
    socket.on('connect', connectSocketSuccess);
    return {type: types.CONNECT_SOCKET_REQUESTED};
}

function connectSocketSuccess() {
    if (Config.environment.isVerbose()) { console.log('[Redux    ] Run ' + types.CONNECT_SOCKET_SUCCEEDED); }
    dispatch({type: types.CONNECT_SOCKET_SUCCEEDED});
    socket.on('query', function(data) {
        switch(data.type) {
            case 'region' : return queryRegionReception(data);
            case 'player' : return queryPlayerReception(data);
            case 'cycling': return queryCyclingReception(data);
            default       : return queryUnknownReception(data);
        }
    });
    emitSocketPlayerQueryEvent();
    return {type: types.CONNECT_SOCKET_SUCCEEDED};
}

function connectSocketFailure(message) {
    if (Config.environment.isVerbose()) { console.log('[Redux    ] Run ' + types.CONNECT_SOCKET_FAILED); }
    dispatch({type: types.CONNECT_SOCKET_FAILED});
    return {type: types.CONNECT_SOCKET_FAILED, payload: {message: message}};
}

export function queryPlayer(id) {
    if (Config.environment.isVerbose()) { console.log('[Redux    ] Run ' + types.QUERY_PLAYER_REQUESTED); }
    emitSocketPlayerQueryEvent();
    return { type: types.QUERY_PLAYER_REQUESTED, payload: {id: id} }
}

function queryPlayerReception(data) {
    if (Config.environment.isVerbose()) { console.log('[Redux    ] Run ' + types.QUERY_PLAYER_RECEIVED); }
    dispatch({type: types.QUERY_PLAYER_RECEIVED, payload: data});
    return { type: types.QUERY_PLAYER_RECEIVED, payload: {data: data} }
}

export function queryRegion(id) {
    if (Config.environment.isVerbose()) { console.log('[Redux    ] Run ' + types.QUERY_REGION_REQUESTED); }
    emitSocketRegionQueryEvent(id);
    return { type: types.QUERY_REGION_REQUESTED, payload: {id: id} }
}

function queryRegionReception(data) {
    if (Config.environment.isVerbose()) { console.log('[Redux    ] Run ' + types.QUERY_REGION_RECEIVED); }
    dispatch({type: types.QUERY_REGION_RECEIVED, payload: data});
    return { type: types.QUERY_REGION_RECEIVED, payload: {data: data} }
}

export function queryCycling() {
    if (Config.environment.isVerbose()) { console.log('[Redux    ] Run ' + types.QUERY_CYCLING_REQUESTED); }
    emitSocketCyclingQueryEvent();
    return { type: types.QUERY_CYCLING_REQUESTED, payload: {} }
}

function queryCyclingReception(data) {
    if (Config.environment.isVerbose()) { console.log('[Redux    ] Run ' + types.QUERY_CYCLING_RECEIVED); }
    dispatch({type: types.QUERY_CYCLING_RECEIVED, payload: data});
    return { type: types.QUERY_CYCLING_RECEIVED, payload: {data: data} }
}

function queryUnknownReception(data) {
    if (Config.environment.isVerbose()) { console.log('[Redux    ] Run ' + types.QUERY_UNKNOWN_RECEIVED); }
    dispatch({type: types.QUERY_UNKNOWN_RECEIVED, payload: data});
    return { type: types.QUERY_UNKNOWN_RECEIVED, payload: {data: data} }
}