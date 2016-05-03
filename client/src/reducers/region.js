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
    row: 0,
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
                            x: y,
                            y: x
                        },
                        tile      : nextTiles[x][y],
                        node      : nextNodes[x][y],
                        items     : nextItems[x][y]
                    };
                }
            }
            nextState = fromJS(state).merge({
                data: action.payload,
                rows: nextRows
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


/*
handleUpdate(data) {
    switch(data.type) {
        case 'player':
            if (data.self === true) {
                return this._refreshPlayer(data.data);
            } else if (data.name != this.state.player.name) {
                return this._refreshCharacter(data.data);
            }
            break;
        case 'region':
            return this._refreshCoordinates(data.data);
        case 'cycling':
            return this._refreshCycle(data.data);
        default:
            break;
    }
},
_refreshCoordinates(data) {
    console.log('Region Query Data Received', data);
    let newRows  = [];
    for (var x in data.tiles) {
        if (!newRows[x]) {
            newRows[x] = [];
        }
        for (var y in data.tiles[x]) {
            let rowCharacters = {};
            let rowPlayer     = {};
            if (this.state.rows[x]) {
                rowCharacters = this.state.rows[x][y].characters;
            }
            newRows[x][y] = {
                coordinates: {
                    x: x,
                    y: y
                },
                tile      : data.tiles[x][y],
                node      : data.nodes[x][y],
                items     : data.items[x][y],
                characters: rowCharacters
            };

        }
    }
    this.setState({
        data: data,
        rows: newRows
    });
},
_refreshPlayer(data) {
    console.log('Player Query Data Received', data);
    if (!this.state.data) {
        this.props.handleEventEmission('query', { 'type': 'region',  'id'  : data.region.id });
    }
    this.setState({ player: data });
},
_refreshCharacter(data) {
    console.log('Other Player Query Data Received', data);
    let newRows = this.state.rows;
    delete newRows[data.region.last.x][data.region.last.y].characters[data.name];
    newRows[data.region.x][data.region.y].characters[data.name] = data;
    this.setState({ rows: newRows });
},
_appendCharacter(data) {
    console.log('Enter Query Data Received', data);
},
_removeCharacter(data) {
    console.log('Leave Query Data Received', data);
},
_refreshCycle(data) {
    console.log('Cycling Query Data Received', data);
    switch (data.cycle) {
        default:
        case 'morning':
        case 'afternoon':
            this.props.handlePlayMusic('daytime');
            break;
        case 'evening':
        case 'night':
            this.props.handlePlayMusic('nighttime');
            break;
    }
    this.setState({ cycle: data.cycle });
},*/