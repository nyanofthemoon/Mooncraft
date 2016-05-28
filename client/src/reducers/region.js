import {fromJS} from 'immutable'

import Config from './../config'
import * as types from './../constants/ActionTypes'

const initialState = fromJS({
    cycle: 'afternoon',
    data: {
        id: null,
        name: 'Unnamed',
        description: '',
        tiles: [],
        nodes: [],
        items: []
    },
    rows: [],
    mapY     : 0,
    mapX     : 0,
    tileSize : 0,
    boundaryY: 0,
    boundaryX: 0
})

const region = (state = initialState, action) => {
    let actionIsInCurrentReducer = true
    let nextState
    switch (action.type) {
        case types.QUERY_CYCLING_REQUESTED:
        case types.QUERY_REGION_REQUESTED:
        case types.PLAYER_ENTER_REGION_REQUESTED:
        case types.PLAYER_LEAVE_REGION_REQUESTED:
        case types.PLAYER_HARVEST_REGION_REQUESTED:
            break
        case types.QUERY_CYCLING_RECEIVED:
            nextState = fromJS(state).set('cycle', action.payload.cycle)
            break
        case types.QUERY_REGION_RECEIVED:
        case types.QUERY_REGENERATION_RECEIVED:
            let nextTiles = action.payload.tiles
            let nextNodes = action.payload.nodes
            let nextItems = action.payload.items
            let nextRows  = []
            for (var x in nextTiles) {
                if (!nextRows[x]) {
                    nextRows[x] = []
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
                    }
                }
            }
            nextState = fromJS(state).merge({
                data: action.payload,
                rows: nextRows,
                mapY: nextRows.length,
                mapX: nextRows[0].length
            })
            break
        case types.WINDOW_RESIZE_EVENT_RECEIVED:
            let surface  = action.payload.width * action.payload.height
            let tileSize = Config.graphic.tile.size.large
            if (surface <= Config.graphic.viewport.size.small) {
                tileSize = Config.graphic.tile.size.small
            } else if (surface <= Config.graphic.viewport.size.medium) {
                tileSize = Config.graphic.tile.size.medium
            }
            nextState = fromJS(state).merge({
                tileSize : tileSize,
                boundaryY: ((roundToNearestUnevenNumber((action.payload.height / tileSize)) - 1) / 2),
                boundaryX: ((roundToNearestUnevenNumber((action.payload.width  / tileSize)) - 1) / 2)
            })
            break
        default:
            actionIsInCurrentReducer = false
            break
    }
    if (Config.environment.isVerbose() && actionIsInCurrentReducer) { console.log('[Reducer  ] Region ' + action.type) }
    return nextState || state
}

function roundToNearestUnevenNumber(n) {
    return Math.floor(n/2)*2 - 1
}

export default region