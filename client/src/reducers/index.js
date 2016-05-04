import {combineReducers} from 'redux'
import engine from './engine'
import player from './player'
import region from './region'
import characters from './characters'

const rootReducer = combineReducers({
    engine,
    player,
    region,
    characters
})

export default rootReducer