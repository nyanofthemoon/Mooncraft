import React from 'react';

import Tile from './Tile';

export default React.createClass({
    render() {
        let player = this.props.player;
        let minCol = 0;
        let maxCol = 20;
        if (player.region) {
            maxCol = player.region.x + 10;
            minCol = player.region.x - 10;
            if (minCol < 0) {
                maxCol += Math.abs(minCol);
                minCol = 0;
            }
            if (maxCol > this.props.data.length) {
                maxCol = this.props.data.length;
            }
        }

        return (
            <div className="region__row">
                {this.props.data.splice(minCol, maxCol).map(function(data, index) {
                    let tileData        = data.tile.data;
                    let nodeData        = data.node.data;
                    let itemData        = data.node.items;
                    let characterData   = data.characters;
                    let uid             = 'tile-' + index;
                    return (
                       <Tile ref="Tile" key={uid} y={data.coordinates.y} x={data.coordinates.x} data={tileData} node={nodeData} items={itemData} player={player} characters={characterData} />
                   );
                })}
            </div>
        );
    }
});