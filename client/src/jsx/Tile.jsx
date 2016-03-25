import React from 'react';

import Node      from './Node';
import Player    from './Player';
//import Character from './Character';
//import Item      from './Item';

export default React.createClass({
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
});