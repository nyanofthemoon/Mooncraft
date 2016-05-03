import React, {Component} from 'react'

import Node from './Node'
import Player from './Player'

class Tile extends Component {
    render() {
        let backgroundImage = 'url(/img/tiles/' + this.props.data.icon+')';
        let player          = '';
        if (this.props.y == this.props.player.region.y && this.props.x == this.props.player.region.x) {
            player = (<Player ref="Player" data={this.props.player} />);
        }

        return (<div className="region__row__tile" style={{backgroundImage: backgroundImage}}>
            <Node ref="Node" data={this.props.node} />
            {player}
        </div>);
    }
}

export default Tile;