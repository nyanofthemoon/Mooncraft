import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Config from './../config'
import Node from './Node'
import Player from './Player'
import Character from './Character'

class Tile extends Component {
    render() {
        const {player, characters} = this.props
        let playerComponent = ''
        if (this.props.x == player.get('data').region.x && this.props.y == player.get('data').region.y) {
            playerComponent = (<Player />)
        }
        let list        = []
        let coordinates = characters.getIn(['coordinates', this.props.x, this.props.y])
        if (coordinates) {
            coordinates.keySeq().toArray().map(function(key) {
                list.push(coordinates.get(key))
            })
        }

        let info   = ''
        let border = ''
        if (Config.environment.isDevelopment()) {
            border = '1px solid white'
            info = this.props.x + 'x' + this.props.y
        }

        return (<div className="region__row__tile" style={{width: this.props.size, height: this.props.size, backgroundImage: 'url(/img/tiles/' + this.props.data.get('icon')+')', border: border}}>
            <Node data={this.props.node}/>
            {playerComponent}
            {list.map(function(character, index) {
                return (<Character key={'tile-' + index} data={character}/>)
            })}
            {info}
        </div>)
    }
}

Tile.contextTypes = {
    store: PropTypes.object.isRequired
}

Tile.propTypes = {
    x    : PropTypes.string.isRequired,
    y    : PropTypes.string.isRequired,
    size : PropTypes.number.isRequired,
    data : PropTypes.object.isRequired,
    node : PropTypes.object.isRequired,
    items: PropTypes.array
}

function mapStateToProps(state) {
    return {
        player    : state.player,
        characters: state.characters
    }
}

export default connect(mapStateToProps)(Tile)