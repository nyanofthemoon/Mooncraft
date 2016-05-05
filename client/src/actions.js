import Config from './config';
import * as types from './constants/ActionTypes'
import Store from './store'
import {setAudioAssets, playSound, playMusic} from './helpers/audio/controller';
import {createSocketConnection, emitSocketCyclingQueryEvent, emitSocketPlayerQueryEvent, emitSocketRegionQueryEvent, emitPlayerMove, emitPlayerEnter, emitPlayerLeave, emitPlayerHarvest} from './helpers/socket';

let socket;
let dispatch;

function _getState() {
    return Store.getState();
}

export function assetLoaderCompletion(musics, sounds) {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.ASSET_LOADER_COMPLETION); }
    setAudioAssets(musics, sounds)
    if (Config.audio.musicIsEnabled()) {
        playMusic('intro')
    }
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
            case 'region'      : return queryRegionReception(data);
            case 'player'      : return queryPlayerReception(data);
            case 'cycling'     : return queryCyclingReception(data);
            case 'regeneration': return queryRegenerationReception(data);
            default            : return queryUnknownReception(data);
        }
    });
    socket.on('enter', function(data) {
        if (Config.environment.isVerbose()) { console.log('[WebSocket] Received Enter', data); }
        return enterRegionReception(data);
    });
    socket.on('leave', function(data) {
        if (Config.environment.isVerbose()) { console.log('[WebSocket] Received Leave', data); }
        return leaveRegionReception(data);
    });
    dispatch({type: types.QUERY_PLAYER_REQUESTED});
    emitSocketPlayerQueryEvent();
    dispatch({type: types.QUERY_CYCLING_REQUESTED});
    emitSocketCyclingQueryEvent();
    bindKeys();
}

function connectSocketFailure(message) {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.CONNECT_SOCKET_FAILED); }
    dispatch({type: types.CONNECT_SOCKET_FAILED});
}

export function queryPlayer() {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.QUERY_PLAYER_REQUESTED); }
    emitSocketPlayerQueryEvent();
    return { type: types.QUERY_PLAYER_REQUESTED, payload: {} }
}

function queryPlayerReception(data) {
    if (data.self === false) {
        if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.QUERY_CHARACTER_RECEIVED + ' for Character'); }
        dispatch({type: types.QUERY_CHARACTER_RECEIVED, payload: data.data});
    } else {
        if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.QUERY_PLAYER_RECEIVED + ' for Player'); }
        let currentRegion = _getState().player.getIn(['data', 'region']);
        let nextRegionId  = data.data.region.id;
        if (currentRegion && currentRegion.id != nextRegionId) {
            if (currentRegion.id) {
                dispatch({type: types.PLAYER_LEAVE_REGION_REQUESTED, payload: {}});
                emitPlayerLeave(currentRegion.id);
                dispatch({type: types.PLAYER_ENTER_REGION_REQUESTED, payload: {}});
                emitPlayerEnter(nextRegionId);
            }
            dispatch({type: types.QUERY_REGION_REQUESTED, payload: {}});
            emitSocketRegionQueryEvent(nextRegionId);
        }
        dispatch({type: types.QUERY_PLAYER_RECEIVED, payload: data.data});
    }
}

export function queryRegion(id) {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.QUERY_REGION_REQUESTED); }
    emitSocketRegionQueryEvent(id);
    return { type: types.QUERY_REGION_REQUESTED, payload: {id: id} }
}

function queryRegionReception(data) {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.QUERY_REGION_RECEIVED); }
    dispatch({type: types.QUERY_REGION_RECEIVED, payload: data.data});
}

export function enterRegion(id) {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.PLAYER_ENTER_REGION_REQUESTED); }
    emitPlayerEnter(id);
    return { type: types.PLAYER_ENTER_REGION_REQUESTED, payload: {id: id} }
}

function enterRegionReception(data) {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.CHARACTER_ENTER_REGION_RECEIVED); }
    dispatch({type: types.CHARACTER_ENTER_REGION_RECEIVED, payload: data.data});
}

export function leaveRegion(id) {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.PLAYER_LEAVE_REGION_REQUESTED); }
    emitPlayerLeave(id);
    return { type: types.PLAYER_LEAVE_REGION_REQUESTED, payload: {id: id} }
}

function leaveRegionReception(data) {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.CHARACTER_LEAVE_REGION_RECEIVED); }
    dispatch({type: types.CHARACTER_LEAVE_REGION_RECEIVED, payload: data.data});
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
            if (Config.audio.musicIsEnabled()) {
                playMusic('daytime');
            }
            break;
        case 'evening':
        case 'night':
            if (Config.audio.musicIsEnabled()) {
                playMusic('nighttime');
            }
            break;
    }
    dispatch({type: types.QUERY_CYCLING_RECEIVED, payload: data.data});
}

function queryRegenerationReception(data) {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.QUERY_REGENERATION_RECEIVED); }
    if (Config.audio.soundIsEnabled()) {
        playSound('suspense');
    }
    dispatch({type: types.QUERY_REGENERATION_RECEIVED, payload: data.data});
}

function queryUnknownReception(data) {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.QUERY_UNKNOWN_RECEIVED); }
    dispatch({type: types.QUERY_UNKNOWN_RECEIVED, payload: data});
}

function bindKeys() {
    document.onkeyup = function(e) {
        let player    = _getState().player.get('data');
        let direction = _getState().player.get('direction');
        switch (e.keyCode) {
            case 38:
            case 56:
            case 87:
                dispatch({type: types.PLAYER_MOVE_UP_REQUESTED});
                if (!Config.player.mustFaceDirectionBeforeMoving() || 'up' === direction) { emitPlayerMove(player.region.id, player.region.x, (player.region.y - 1)); }
                break;
            case 39:
            case 54:
            case 68:
                dispatch({type: types.PLAYER_MOVE_RIGHT_REQUESTED});
                if (!Config.player.mustFaceDirectionBeforeMoving() || 'right' === direction) { emitPlayerMove(player.region.id, (player.region.x + 1), player.region.y); }
                break;
            case 40:
            case 53:
            case 83:
                dispatch({type: types.PLAYER_MOVE_DOWN_REQUESTED});
                if (!Config.player.mustFaceDirectionBeforeMoving() || 'down' === direction) { emitPlayerMove(player.region.id, player.region.x, (player.region.y + 1)); }
                break;
            case 37:
            case 52:
            case 65:
                dispatch({type: types.PLAYER_MOVE_LEFT_REQUESTED});
                if (!Config.player.mustFaceDirectionBeforeMoving() || 'left' === direction) { emitPlayerMove(player.region.id, (player.region.x - 1), player.region.y); }
                break;
            case 55:
            case 81:
                dispatch({type: types.PLAYER_MOVE_LEFTUP_REQUESTED});
                if (!Config.player.mustFaceDirectionBeforeMoving() || 'leftup' === direction) { emitPlayerMove(player.region.id, (player.region.x - 1), (player.region.y - 1)); }
                break;
            case 57:
            case 69:
                dispatch({type: types.PLAYER_MOVE_RIGHTUP_REQUESTED});
                if (!Config.player.mustFaceDirectionBeforeMoving() || 'rightup' === direction) { emitPlayerMove(player.region.id, (player.region.x + 1), (player.region.y - 1)); }
                break;
            case 49:
            case 90:
                dispatch({type: types.PLAYER_MOVE_LEFTDOWN_REQUESTED});
                if (!Config.player.mustFaceDirectionBeforeMoving() || 'leftdown' === direction) { emitPlayerMove(player.region.id, (player.region.x - 1), (player.region.y + 1)); }
                break;
            case 51:
            case 67:
                dispatch({type: types.PLAYER_MOVE_RIGHTDOWN_REQUESTED});
                if (!Config.player.mustFaceDirectionBeforeMoving() || 'rightdown' === direction) { emitPlayerMove(player.region.id, (player.region.x + 1), (player.region.y + 1)); }
                break;
            case 72:
                if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.PLAYER_HARVEST_REGION_REQUESTED + ' towards ' + direction); }
                if (Config.audio.soundIsEnabled()) {
                    playSound('harvest');
                }
                let harvestX  = player.region.x;
                let harvestY  = player.region.y;
                switch(direction) {
                    case 'up':
                        harvestY--;
                        break;
                    case 'right':
                        harvestX++;
                        break;
                    case 'down':
                        harvestY++;
                        break;
                    case 'left':
                        harvestX--;
                        break;
                    case 'leftup':
                        harvestY--;
                        harvestX--;
                        break;
                    case 'rightup':
                        harvestY--;
                        harvestX++;
                        break;
                    case 'leftdown':
                        harvestY++;
                        harvestX--;
                        break;
                    case 'rightdown':
                        harvestY++;
                        harvestX++;
                        break;
                    default:
                        break;
                }
                dispatch({type: types.PLAYER_HARVEST_REGION_REQUESTED});
                emitPlayerHarvest(player.region.id, harvestX, harvestY);
                break;
            default:
                break;
        }
    };
}