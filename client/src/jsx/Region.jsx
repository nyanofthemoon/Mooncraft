import React from 'react';

import Coordinate from './Coordinate';

export default React.createClass({
    getInitialState() {
        return {
            coordinates: []
        };
    },
    handleUpdate(data) {
        console.log('Region Query Data Received', data);
        let newCoordinates = [];
        // @TODO
        this.setState({
            coordinates: newCoordinates
        });
    },
    handleCycling(data) {
        console.log('Cycling Query Data Received', data);
        switch (data.data.cycle) {
            default:
            case 'morning':
            case 'afternoon':
                this.props.handlePlayMusic('daytime');
                break;
            case 'evening':
            case 'night':
                this.props.handlePlayMusic('nighttime');
                break;
        }
    },
    render() {
        return <div className="region">
            {this.state.coordinates.map(function(coordinate) {
                return <Coordinate key={coordinate.id} tile={coordinate.tile} node={coordinate.node} items={coordinate.items} characters={coordinate.characters} player={coordinate.player} />;
            })}
        </div>;
    }
});