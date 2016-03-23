import React from 'react';

import Tile from './Tile';

export default React.createClass({
    render() {
        return (
            <div className="row">
                {this.props.data.map(function(data, index) {
                    let tileData        = data.tile.data;
                    let nodeData        = data.node.data;
                    let itemData        = data.node.items;
                    let uid             = 'tile-' + index;
                    return (
                       <Tile ref="Tile" key={uid} data={tileData} node={nodeData} items={itemData}  />
                   );
                })}
            </div>
        );
    }
});