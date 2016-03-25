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
                } else if (data.name != this.state.player.name) {
                    return this._refreshCharacter(data.data);
                }
                break;
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
        let newRows  = [];
        for (var x in data.tiles) {
            if (!newRows[x]) {
                newRows[x] = [];
            }
            for (var y in data.tiles[x]) {
                let rowCharacters = {};
                let rowPlayer     = {};
                if (this.state.rows[x]) {
                    rowCharacters = this.state.rows[x][y].characters;
                }
                newRows[x][y] = {
                    coordinates: {
                        x: x,
                        y: y
                    },
                    tile      : data.tiles[x][y],
                    node      : data.nodes[x][y],
                    items     : data.items[x][y],
                    characters: rowCharacters
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
        let newRows = this.state.rows;
        delete newRows[data.region.last.x][data.region.last.y].characters[data.name];
        newRows[data.region.x][data.region.y].characters[data.name] = data;
        this.setState({ rows: newRows });
    },
    _appendCharacter(data) {
        console.log('Enter Query Data Received', data);
    },
    _removeCharacter(data) {
        console.log('Leave Query Data Received', data);
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
        let player          = this.state.player;
        let aspectRatioRows = 100;
        let aspectRatioCols = 70;
        /* // @TODO Forcing view to 20x14 surrounding player
        if (this.state.data) {
            let rows = this.state.data.tiles[0].length;
            let cols = this.state.data.tiles.length;
            if (cols > rows) {
                aspectRatioRows = Math.round((rows / cols) * 100);
            } else if (cols < rows) {
                aspectRatioCols = Math.round((cols / rows) * 100);
            }
        }*/
        aspectRatioRows += 'vmax';
        aspectRatioCols += 'vmax';

        let minRow = 0;
        let maxRow = 14;
        if (this.state.data && this.state.player) {
            maxRow = this.state.player.region.y + 7;
            minRow = this.state.player.region.y - 7;
            if (minRow < 0) {
                maxRow += Math.abs(minRow);
                minRow = 0;
            }
            if (maxRow > this.state.data.tiles.length) {
                maxRow = this.state.data.tiles.length;
            }
        }

        return (
            <section className="region" style={{width:aspectRatioRows, height:aspectRatioCols}}>
                <div className={['cycle', 'cycle--' + this.state.cycle].join(' ')}></div>
                {this.state.rows.slice(minRow, maxRow).map(function(row, index) {
                    let uid = 'row-' + index;
                    return (<Row ref="Row" key={uid} data={row} player={player}/>);
                })}
            </section>
        );
    }
});