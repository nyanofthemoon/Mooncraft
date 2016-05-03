import Config from './config';
import * as types from './constants/ActionTypes'
import store from './store'
import {setAudioAssets, playSound, playMusic} from './audio_controller';
import {createSocketConnection, emitSocketCyclingQueryEvent, emitSocketPlayerQueryEvent, emitSocketRegionQueryEvent} from './helpers/socket';

let socket;
let dispatch;

export function assetLoaderCompletion(musics, sounds) {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.ASSET_LOADER_COMPLETION); }
    setAudioAssets(musics, sounds)
    playMusic('intro')
    return {type: types.ASSET_LOADER_COMPLETION}
}

export function connectSocket(username, password, store) {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.CONNECT_SOCKET_REQUESTED); }
    socket   = createSocketConnection(username, password, store);
    dispatch = store.dispatch;
    socket.on('error', function(error) {
        if (Config.environment.isVerbose()) { console.log('[WebSocket] Received Error', error); }
        connectSocketFailure();
    });
    socket.on('connect', function() {
        if (Config.environment.isVerbose()) { console.log('[WebSocket] Received Connect'); }
        connectSocketSuccess();
    });
    return {type: types.CONNECT_SOCKET_REQUESTED};
}

function connectSocketSuccess() {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.CONNECT_SOCKET_SUCCEEDED); }
    dispatch({type: types.CONNECT_SOCKET_SUCCEEDED});
    socket.on('query', function(data) {
        if (Config.environment.isVerbose()) { console.log('[WebSocket] Received Query', data); }
        switch(data.type) {
            case 'region' : return queryRegionReception(data);
            case 'player' : return queryPlayerReception(data);
            case 'cycling': return queryCyclingReception(data);
            default       : return queryUnknownReception(data);
        }
    });
    dispatch({type: types.QUERY_PLAYER_REQUESTED});
    emitSocketPlayerQueryEvent();
    dispatch({type: types.QUERY_CYCLING_REQUESTED});
    emitSocketCyclingQueryEvent();
    return {type: types.CONNECT_SOCKET_SUCCEEDED};
}

function connectSocketFailure(message) {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.CONNECT_SOCKET_FAILED); }
    dispatch({type: types.CONNECT_SOCKET_FAILED});
    return {type: types.CONNECT_SOCKET_FAILED, payload: {message: message}};
}

export function queryPlayer() {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.QUERY_PLAYER_REQUESTED); }
    emitSocketPlayerQueryEvent();
    return { type: types.QUERY_PLAYER_REQUESTED, payload: {} }
}

export function queryPlayerReception(data) {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.QUERY_PLAYER_RECEIVED); }
    let currentStore = store.getState();
    let currentPlayerRegionId = currentStore.player.getIn(['data', 'region', 'id']);
    let nextPlayerRegionId    = data.data.region.id;
    if (!currentPlayerRegionId || (currentPlayerRegionId != nextPlayerRegionId)) {
        _changeRegion(nextPlayerRegionId);
    }
    dispatch({type: types.QUERY_PLAYER_RECEIVED, payload: data.data});
    return { type: types.QUERY_PLAYER_RECEIVED, payload: {data: data.data} }
}

function _changeRegion(id) {
    // @TODO Reset Characters
    dispatch({type: types.QUERY_REGION_REQUESTED, payload: {id: id}});
    emitSocketRegionQueryEvent(id);
}

export function queryRegion(id) {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.QUERY_REGION_REQUESTED); }
    emitSocketRegionQueryEvent(id);
    return { type: types.QUERY_REGION_REQUESTED, payload: {id: id} }
}

export function queryRegionReception(data) {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.QUERY_REGION_RECEIVED); }
    dispatch({type: types.QUERY_REGION_RECEIVED, payload: data.data});
    return { type: types.QUERY_REGION_RECEIVED, payload: {data: data.data} }
}

export function queryCycling() {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.QUERY_CYCLING_REQUESTED); }
    emitSocketCyclingQueryEvent();
    return { type: types.QUERY_CYCLING_REQUESTED, payload: {} }
}

export function queryCyclingReception(data) {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.QUERY_CYCLING_RECEIVED); }
    switch (data.data.cycle) {
        default:
        case 'morning':
        case 'afternoon':
            playMusic('daytime');
            break;
        case 'evening':
        case 'night':
            playMusic('nighttime');
            break;
    }
    dispatch({type: types.QUERY_CYCLING_RECEIVED, payload: data.data});
    return { type: types.QUERY_CYCLING_RECEIVED, payload: {data: data.data} }
}

function queryUnknownReception(data) {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.QUERY_UNKNOWN_RECEIVED); }
    dispatch({type: types.QUERY_UNKNOWN_RECEIVED, payload: data});
    return { type: types.QUERY_UNKNOWN_RECEIVED, payload: {data: data} }
}