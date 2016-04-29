import {combineReducers} from 'redux'
import engine from './engine'
import player from './player'
import region from './region'

const rootReducer = combineReducers({
    engine,
    player,
    region
})

export default rootReducer