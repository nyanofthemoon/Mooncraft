import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Node from './Node'
import Player from './Player'

class Tile extends Component {
    //@TODO Implement characters
    render() {
        const {player, characters} = this.props
        let playerComponent = '';
        if (this.props.x == player.get('data').region.x && this.props.y == player.get('data').region.y) {
            playerComponent = (<Player />);
        }
        return (<div className="region__row__tile" style={{backgroundImage: 'url(/img/tiles/' + this.props.data.get('icon')+')'}}>
            <Node data={this.props.node}/>
            {playerComponent}
        </div>);
    }
}

Tile.contextTypes = {
    store: PropTypes.object.isRequired
}

Tile.propTypes = {
    x    : PropTypes.number.isRequired,
    y    : PropTypes.number.isRequired,
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

export default connect(mapStateToProps)(Tile);