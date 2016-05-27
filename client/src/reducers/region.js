import {fromJS} from 'immutable';

import Config from './../config';
import * as types from './../constants/ActionTypes'

const initialState = fromJS({
    cycle: "afternoon",
    data: {
        id: null,
        name: "Unnamed",
        description: "",
        tiles: [],
        nodes: [],
        items: []
    },
    rows: [],
    rowCount : 0,
    cellCount: 0,
    maxRows  : 0,
    maxCells : 0
});

const region = (state = initialState, action) => {
    let actionIsInCurrentReducer = true;
    let nextState;
    switch (action.type) {
        case types.QUERY_CYCLING_REQUESTED:
        case types.QUERY_REGION_REQUESTED:
        case types.PLAYER_ENTER_REGION_REQUESTED:
        case types.PLAYER_LEAVE_REGION_REQUESTED:
        case types.PLAYER_HARVEST_REGION_REQUESTED:
            break;
        case types.QUERY_CYCLING_RECEIVED:
            nextState = fromJS(state).set('cycle', action.payload.cycle);
            break;
        case types.QUERY_REGION_RECEIVED:
        case types.QUERY_REGENERATION_RECEIVED:
            let nextTiles = action.payload.tiles;
            let nextNodes = action.payload.nodes;
            let nextItems = action.payload.items;
            let nextRows  = [];
            for (var x in nextTiles) {
                if (!nextRows[x]) {
                    nextRows[x] = [];
                }
                for (var y in nextTiles[x]) {
                    nextRows[x][y] = {
                        coordinates: {
                            x: y,
                            y: x
                        },
                        tile : nextTiles[x][y],
                        node : nextNodes[x][y],
                        items: nextItems[x][y]
                    };
                }
            }
            nextState = fromJS(state).merge({
                data: action.payload,
                rows: nextRows,
                rowCount: nextRows.length,
                cellCount: nextRows[0].length
            });
            break;
        case types.WINDOW_RESIZE_EVENT_RECEIVED:
            //@TODO Fix with real tile sizes
            let maxRows  = Math.floor((((action.payload.width) / 32) / 4));
            let maxCells = Math.floor((((action.payload.height) / 32) / 4));
            nextState = fromJS(state).merge({
                maxRows : maxRows,
                maxCells: maxCells
            });
            break;
        default:
            actionIsInCurrentReducer = false;
            break;
    }
    if (Config.environment.isVerbose() && actionIsInCurrentReducer) { console.log('[Reducer  ] Region ' + action.type); }
    return nextState || state;
}

export default region