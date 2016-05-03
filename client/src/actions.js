import Config from './config';
import * as types from './constants/ActionTypes'
import store from './store'
import {setAudioAssets, playSound, playMusic} from './audio_controller';
import {createSocketConnection, emitSocketCyclingQueryEvent, emitSocketPlayerQueryEvent, emitSocketRegionQueryEvent, emitPlayerMove} from './helpers/socket';

let socket;
let dispatch;

function getState() {
    return store.getState();
}

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
    bindKeys();
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

function queryPlayerReception(data) {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.QUERY_PLAYER_RECEIVED); }
    let player       = getState().player.get('data');
    let nextRegionId = data.data.region.id;
    if (!player.region || (player.region.id != nextRegionId)) {
        dispatch({type: types.QUERY_REGION_REQUESTED, payload: {}});
        emitSocketRegionQueryEvent(nextRegionId);
    }
    dispatch({type: types.QUERY_PLAYER_RECEIVED, payload: data.data});
    return { type: types.QUERY_PLAYER_RECEIVED, payload: {data: data.data} }
}

export function queryRegion(id) {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.QUERY_REGION_REQUESTED); }
    emitSocketRegionQueryEvent(id);
    return { type: types.QUERY_REGION_REQUESTED, payload: {id: id} }
}

function queryRegionReception(data) {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.QUERY_REGION_RECEIVED); }
    dispatch({type: types.QUERY_REGION_RECEIVED, payload: data.data});
    return { type: types.QUERY_REGION_RECEIVED, payload: {data: data.data} }
}

export function queryCycling() {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.QUERY_CYCLING_REQUESTED); }
    emitSocketCyclingQueryEvent();
    return { type: types.QUERY_CYCLING_REQUESTED, payload: {} }
}

function queryCyclingReception(data) {
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

function bindKeys() {
    document.onkeydown = function(e) {
        let player = getState().player.get('data');
        switch (e.keyCode) {
            case 37:
            case 52:
            case 65:
                dispatch({type: types.MOVE_PLAYER_LEFT_REQUESTED});
                emitPlayerMove(player.region.id, (player.region.x - 1), player.region.y);
                break;
            case 38:
            case 56:
            case 87:
                dispatch({type: types.MOVE_PLAYER_UP_REQUESTED});
                emitPlayerMove(player.region.id, player.region.x, (player.region.y - 1));
                break;
            case 39:
            case 54:
            case 68:
                dispatch({type: types.MOVE_PLAYER_RIGHT_REQUESTED});
                emitPlayerMove(player.region.id, (player.region.x + 1), player.region.y);
                break;
            case 40:
            case 53:
            case 83:
                dispatch({type: types.MOVE_PLAYER_DOWN_REQUESTED});
                emitPlayerMove(player.region.id, player.region.x, (player.region.y + 1));
                break;
            case 55:
            case 81:
                dispatch({type: types.MOVE_PLAYER_LEFTUP_REQUESTED});
                emitPlayerMove(player.region.id, (player.region.x - 1), (player.region.y - 1));
                break;
            case 57:
            case 69:
                dispatch({type: types.MOVE_PLAYER_RIGHTUP_REQUESTED});
                emitPlayerMove(player.region.id, (player.region.x + 1), (player.region.y - 1));
                break;
            case 49:
            case 90:
                dispatch({type: types.MOVE_PLAYER_LEFTDOWN_REQUESTED});
                emitPlayerMove(player.region.id, (player.region.x - 1), (player.region.y + 1));
                break;
            case 51:
            case 67:
                dispatch({type: types.MOVE_PLAYER_RIGHTDOWN_REQUESTED});
                emitPlayerMove(player.region.id, (player.region.x + 1), (player.region.y + 1));
                break;
            default:
                break;
        }
    };
}