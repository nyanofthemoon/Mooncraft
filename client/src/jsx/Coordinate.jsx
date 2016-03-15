import React from 'react';

import Tile      from './Tile';
import Node      from './Node';
import Item      from './Item';
import Player    from './Player';
import Character from './Character';

export default React.createClass({
    getInitialState() {
        return {
        };
    },
    render() {
        return <div className="coordinate">
            <Tile ref="tile" data={this.props.tile} />
            <Node ref="node" data={this.props.node} />
            {this.props.items.map(function(item) {
                return <Item ref="item" key={item.id} data={item} />;
            })}
            {this.props.characters.map(function(character) {
                return <Character ref="character" key={character.id} data={character} />;
            })}
            <Player ref="player" data={player} />;
        </div>;
    }
});