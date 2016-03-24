import React from 'react';

import Player from './Player';
import Row    from './Row';
import Tile   from './Tile';

export default React.createClass({
    getInitialState() {
        return {
            cycle      : '',
            data       : null,
            rows       : [],
            player     : {}
        };
    },
    handleUpdate(data) {
        switch(data.type) {
            case 'player':
                if (data.self === true) {
                    return this._refreshPlayer(data.data);
                } else {
                    return this._refreshCharacter(data.data);
                }
            case 'region':
                return this._refreshCoordinates(data.data);
            case 'cycling':
                return this._refreshCycle(data.data);
            default:
                break;
        }
    },
    _refreshCoordinates(data) {
        console.log('Region Query Data Received', data);
        let newRows = [];
        for (var x in data.tiles) {
            if (!newRows[x]) {
                newRows[x] = [];
            }
            for (var y in data.tiles[x]) {
                newRows[x][y] = {
                    coordinates: {
                        x: x,
                        y: y
                    },
                    tile : data.tiles[x][y],
                    node : data.nodes[x][y],
                    items: data.items[x][y]
                };
            }
        }
        this.setState({
            data: data,
            rows: newRows
        });
    },
    _refreshPlayer(data) {
        console.log('Player Query Data Received', data);
        if (!this.state.data) {
            this.props.handleEventEmission('query', { 'type': 'region',  'id'  : data.region.id });
        }
        this.setState({ player: data });
    },
    _refreshCharacter(data) {
        console.log('Other Player Query Data Received', data);
        let updatedCharacters        = this.state.characters;
        updatedCharacters[data.name] = data;
        this.setState({ characters: updatedCharacters });
    },
    _refreshCycle(data) {
        console.log('Cycling Query Data Received', data);
        switch (data.cycle) {
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
        this.setState({ cycle: data.cycle });
    },
    render() {
        let aspectRatioRows = 100;
        let aspectRatioCols = 100;
        if (this.state.data) {
            let rows = this.state.data.tiles[0].length;
            let cols = this.state.data.tiles.length;
            if (cols > rows) {
                aspectRatioRows = Math.round((rows / cols) * 100);
            } else if (cols < rows) {
                aspectRatioCols = Math.round((cols / rows) * 100);
            }
        }
        aspectRatioRows += 'vmin';
        aspectRatioCols += 'vmin';
        return (
            <section className="region" style={{width:aspectRatioRows, height:aspectRatioCols}}>
                <div className={this.state.cycle}></div>
                {this.state.rows.map(function(row, index) {
                    let uid = 'row-' + index;
                    return (<Row ref="Row" key={uid} data={row} />);
                })}
            </section>
        );
    }
});