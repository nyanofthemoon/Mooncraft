import React, {Component} from 'react'

import Tile from './Tile'

class Row extends Component {
    render() {
        let player = this.props.player;
        return (
            <div className="region__row">
                {this.props.data.map(function(data, index) {
                    let tileData = data.tile.data;
                    let nodeData = data.node.data;
                    let itemData = data.node.items;
                    let uid      = 'tile-' + index;
                    return (
                        <Tile ref="Tile" key={uid} x={data.coordinates.x} y={data.coordinates.y} data={tileData} node={nodeData} items={itemData} player={player} />
                    );
                })}
            </div>
        );
    }
}

export default Row;