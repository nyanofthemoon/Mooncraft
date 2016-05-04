import {fromJS} from 'immutable';

import Config from './../config';
import * as types from './../constants/ActionTypes'

const initialState = fromJS({
    list       : {},
    coordinates: {}
});

const characters = (state = initialState, action) => {

    function _updateCharacterInList(character, list) {
        list[character.name] = character;
        return list;
    }
    function _removeCharacterFromList(character, list) {
        delete list[character.name];
        return list;
    }
    function _updateCharacterInCoordinates(character, list, coordinates) {
        let currentCharacter = list[character.name]
        if (currentCharacter) {
            coordinates = _removeCharacterFromCoordinates(currentCharacter, coordinates);
        }
        let nextX = character.region.x;
        let nextY = character.region.y;
        if (!coordinates[nextX])               { coordinates[nextX]        = {}; coordinates[nextX][nextY] = {};
        } else if (!coordinates[nextX][nextY]) { coordinates[nextX][nextY] = {} }
        coordinates[nextX][nextY][character.name] = character;
        return coordinates;
    }
    function _removeCharacterFromCoordinates(character, coordinates) {
        if (coordinates[character.region.x] && coordinates[character.region.x][character.region.y]) {
            delete coordinates[character.region.x][character.region.y][character.name];
        }
        return coordinates;
    }

    let actionIsInCurrentReducer = true;
    let nextState;
    switch (action.type) {
        case types.QUERY_CHARACTER_RECEIVED:
            let currentQueryList = fromJS(state).toJS().list;
            nextState = fromJS(state).merge({
                'coordinates': _updateCharacterInCoordinates(action.payload, currentQueryList, fromJS(state).toJS().coordinates),
                'list'       : _updateCharacterInList(action.payload, currentQueryList)
            });
            break;
        case types.CHARACTER_ENTER_REGION_RECEIVED:
            nextState = fromJS(state).set('list', _updateCharacterInList(action.payload, fromJS(state).toJS().list));
            break;
        case types.CHARACTER_LEAVE_REGION_RECEIVED:
            nextState = fromJS(state).merge({
                'coordinates': _removeCharacterFromCoordinates(action.payload, fromJS(state).toJS().coordinates),
                'list'       : _removeCharacterFromList(action.payload, fromJS(state).toJS().list)
            });
            break;
        default:
            actionIsInCurrentReducer = false;
            break;
    }
    if (Config.environment.isVerbose() && actionIsInCurrentReducer) { console.log('[Reducer  ] Character ' + action.type); }
    return nextState || state;
}

export default characters