import {fromJS} from 'immutable';

import Config from './../config';
import * as types from './../constants/ActionTypes'

const initialState = fromJS({
    cycle: 'daytime',
    data: {
        id: null,
        name: "Unnamed",
        description: "",
        tiles: [],
        nodes: [],
        items: []
    },
    rows: []
});

const region = (state = initialState, action) => {
    let actionIsInCurrentReducer = true;
    let nextState;
    switch (action.type) {
        case types.QUERY_CYCLING_REQUESTED:
        case types.QUERY_REGION_REQUESTED:
            break;
        case types.QUERY_CYCLING_RECEIVED:
            nextState = fromJS(state).set('cycle', action.payload.cycle);
            break;
        case types.QUERY_REGION_RECEIVED:
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
                            x: x,
                            y: y
                        },
                        tile      : nextTiles[x][y],
                        node      : nextNodes[x][y],
                        items     : nextItems[x][y]
                    };
                }
            }
            nextState = fromJS(state).merge({
                data: action.payload,
                rows: nextRows,
                rowSize: nextRows[0].length
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