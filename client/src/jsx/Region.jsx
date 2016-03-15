import React from 'react';

import Coordinate from './Coordinate';

export default React.createClass({
    getInitialState() {
        return {
            coordinates: []
        };
    },
    handleUpdate(data) {
        console.log('Region Update Data Received', data);
    },
    render() {
        return <div className="region">
            {this.state.coordinates.map(function(coordinate) {
                return <Coordinate key={coordinate.id} tile={coordinate.tile} node={coordinate.node} items={coordinate.items} characters={coordinate.characters} player={coordinate.player} />;
            })}
        </div>;
    }
});