import * as _ from 'lodash';
import Config from './config';
import * as types from './constants/ActionTypes'
import * as keycodes from './constants/KeyCodes'
import Store from './store'
import {setAudioAssets, playSound, playMusic} from './helpers/audio/controller';
import {createSocketConnection, emitSocketCyclingQueryEvent, emitSocketPlayerQueryEvent, emitSocketRegionQueryEvent, emitPlayerMove, emitPlayerEnter, emitPlayerLeave, emitPlayerSay, emitPlayerHarvest, emitPlayerInvestigate} from './helpers/socket';
import {getLineOfSightCoordinates} from './helpers/player';

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
            case 'coordinates' : return queryCoordinatesReception(data);
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
    socket.on('say', function(data) {
        if (Config.environment.isVerbose()) { console.log('[WebSocket] Received Say', data); }
        return sayRegionReception(data);
    });
    dispatch({type: types.QUERY_PLAYER_REQUESTED});
    emitSocketPlayerQueryEvent();
    dispatch({type: types.QUERY_CYCLING_REQUESTED});
    emitSocketCyclingQueryEvent();
    bindKeys();
    bindWindowResizeEvent();
    window.dispatchEvent(new Event('resize'));
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

export function sayRegion(message) {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.PLAYER_SAY_REGION_REQUESTED); }
    let player = _getState().player.get('data');
    emitPlayerSay(player.region.id, message);
    return { type: types.PLAYER_SAY_REGION_REQUESTED, payload: {id: player.region.id, message: message} }
}

function leaveRegionReception(data) {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.CHARACTER_LEAVE_REGION_RECEIVED); }
    dispatch({type: types.CHARACTER_LEAVE_REGION_RECEIVED, payload: data.data});
}

function sayRegionReception(data) {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.CHARACTER_SAY_REGION_RECEIVED); }
    let player = _getState().player.get('data');
    if (data.name !== player.name) {
        dispatch({type: types.CHARACTER_SAY_REGION_RECEIVED, payload: data});
    } else {
        dispatch({type: types.PLAYER_SAY_REGION_RECEIVED, payload: data});
    }
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

function queryCoordinatesReception(data) {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.QUERY_COORDINATES_RECEIVED); }
    dispatch({type: types.QUERY_COORDINATES_RECEIVED, payload: data.data});
}

function queryUnknownReception(data) {
    if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.QUERY_UNKNOWN_RECEIVED); }
    dispatch({type: types.QUERY_UNKNOWN_RECEIVED, payload: data});
}

function toggleConsole() {
    let consoleCheckbox     = document.querySelector('#console-content__checkbox');
    consoleCheckbox.checked = !consoleCheckbox.checked;
    let consoleInput        = document.querySelector('#console-input');
    if (false === consoleCheckbox.checked) {
        consoleInput.blur();
    } else {
        consoleInput.focus();
    }
}

function toggleBuildMenu() {
    let buildmenuCheckbox     = document.querySelector('#buildmenu-content__checkbox');
    buildmenuCheckbox.checked = !buildmenuCheckbox.checked;
}

function consoleInputIsFocused() {
    let focusedElement = document.querySelector(":focus")
    if (focusedElement && 'console-input' === focusedElement.id) {
        return true
    }

    return false
}

function bindKeys() {
    document.addEventListener('keyup', _.debounce(function(e) {
        if (Config.environment.isVerbose()) { console.log('[KeyUp    ] ' + e.keyCode); }
        let player    = _getState().player.get('data');
        let direction = _getState().player.get('direction');
        switch (e.keyCode) {
            case keycodes.ESCAPE:
                toggleConsole();
                break;
            case keycodes.B:
                if (false === consoleInputIsFocused()) {
                    toggleBuildMenu();
                }
                break;
            case keycodes.ARROW_UP:
            case keycodes.NUMPAD_8:
            case keycodes.W:
                if (false === consoleInputIsFocused()) {
                    dispatch({type: types.PLAYER_MOVE_UP_REQUESTED});
                    if (!Config.player.mustFaceDirectionBeforeMoving() || 'up' === direction) {
                        emitPlayerMove(player.region.id, player.region.x, (player.region.y - 1));
                    }
                }
                break;
            case keycodes.ARROW_RIGHT:
            case keycodes.NUMPAD_6:
            case keycodes.D:
                if (false === consoleInputIsFocused()) {
                    dispatch({type: types.PLAYER_MOVE_RIGHT_REQUESTED});
                    if (!Config.player.mustFaceDirectionBeforeMoving() || 'right' === direction) {
                        emitPlayerMove(player.region.id, (player.region.x + 1), player.region.y);
                    }
                }
                break;
            case keycodes.ARROW_DOWN:
            case keycodes.NUMPAD_5:
            case keycodes.S:
                if (false === consoleInputIsFocused()) {
                    dispatch({type: types.PLAYER_MOVE_DOWN_REQUESTED});
                    if (!Config.player.mustFaceDirectionBeforeMoving() || 'down' === direction) {
                        emitPlayerMove(player.region.id, player.region.x, (player.region.y + 1));
                    }
                }
                break;
            case keycodes.ARROW_LEFT:
            case keycodes.NUMPAD_4:
            case keycodes.A:
                if (false === consoleInputIsFocused()) {
                    dispatch({type: types.PLAYER_MOVE_LEFT_REQUESTED});
                    if (!Config.player.mustFaceDirectionBeforeMoving() || 'left' === direction) {
                        emitPlayerMove(player.region.id, (player.region.x - 1), player.region.y);
                    }
                }
                break;
            case keycodes.NUMPAD_7:
            case keycodes.Q:
                if (false === consoleInputIsFocused()) {
                    dispatch({type: types.PLAYER_MOVE_LEFTUP_REQUESTED});
                    if (!Config.player.mustFaceDirectionBeforeMoving() || 'leftup' === direction) {
                        emitPlayerMove(player.region.id, (player.region.x - 1), (player.region.y - 1));
                    }
                }
                break;
            case keycodes.NUMPAD_9:
            case keycodes.E:
                if (false === consoleInputIsFocused()) {
                    dispatch({type: types.PLAYER_MOVE_RIGHTUP_REQUESTED});
                    if (!Config.player.mustFaceDirectionBeforeMoving() || 'rightup' === direction) {
                        emitPlayerMove(player.region.id, (player.region.x + 1), (player.region.y - 1));
                    }
                }
                break;
            case keycodes.NUMPAD_1:
            case keycodes.Z:
                if (false === consoleInputIsFocused()) {
                    dispatch({type: types.PLAYER_MOVE_LEFTDOWN_REQUESTED});
                    if (!Config.player.mustFaceDirectionBeforeMoving() || 'leftdown' === direction) {
                        emitPlayerMove(player.region.id, (player.region.x - 1), (player.region.y + 1));
                    }
                }
                break;
            case keycodes.NUMPAD_3:
            case keycodes.C:
                if (false === consoleInputIsFocused()) {
                    dispatch({type: types.PLAYER_MOVE_RIGHTDOWN_REQUESTED});
                    if (!Config.player.mustFaceDirectionBeforeMoving() || 'rightdown' === direction) {
                        emitPlayerMove(player.region.id, (player.region.x + 1), (player.region.y + 1));
                    }
                }
                break;
            case keycodes.H:
            case keycodes.I:
                if (false === consoleInputIsFocused()) {
                    let coordinates = getLineOfSightCoordinates(direction, player.region.x, player.region.y)
                    if (keycodes.H === e.keyCode) {
                        if (Config.environment.isVerbose()) {
                            console.log('[Action   ] Run ' + types.PLAYER_HARVEST_REGION_REQUESTED + ' towards ' + direction);
                        }
                        if (Config.audio.soundIsEnabled()) {
                            playSound('harvest');
                        }
                        dispatch({type: types.PLAYER_HARVEST_REGION_REQUESTED});
                        emitPlayerHarvest(player.region.id, coordinates.x, coordinates.y);
                    } else {
                        if (Config.environment.isVerbose()) {
                            console.log('[Action   ] Run ' + types.QUERY_COORDINATES_REQUESTED + ' towards ' + direction);
                        }
                        dispatch({type: types.QUERY_COORDINATES_REQUESTED});
                        emitPlayerInvestigate(player.region.id, coordinates.x, coordinates.y);
                    }
                }
                break;
            default:
                break;
        }
    }, Config.debounce.keyUp.interval, Config.debounce.keyUp.options));
}

function bindWindowResizeEvent() {
    window.addEventListener('resize', _.debounce(function(e) {
        if (Config.environment.isVerbose()) { console.log('[Action   ] Run ' + types.WINDOW_RESIZE_EVENT_RECEIVED); }
        let width = window.innerWidth   || document.documentElement.clientWidth  || document.body.clientWidth;
        let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        dispatch({type: types.WINDOW_RESIZE_EVENT_RECEIVED, payload: {width: width, height:height} });
    }, Config.debounce.windowResize.interval, Config.debounce.windowResize.options));
}