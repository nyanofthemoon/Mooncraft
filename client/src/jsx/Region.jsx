import React from 'react';

import Player     from './Player';
import Coordinate from './Coordinate';

export default React.createClass({
    getInitialState() {
        return {
            cycle      : '',
            coordinates: [],
            player     : {},
            players    : {},
        };
    },
    handleUpdate(data) {
        switch(data.type) {
            case 'player':
                if (data.self === true) {
                    return this._refreshPlayer(data.data);
                } else {
                    return this._refreshOtherPlayer(data.data);
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
        // @TODO
        /*
         let newCoordinates = [];
         this.setState({
         coordinates: newCoordinates
         });
         */
    },
    _refreshPlayer(data) {
        console.log('Player Query Data Received', data);
        this.setState({ player: data });
    },
    _refreshOtherPlayer(data) {
        console.log('Other Player Query Data Received', data);
        let updatedCharacters        = this.state.characters;
        updatedCharacters[data.name] = data;
        this.setState({ players: updatedCharacters });
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

        // @TODO
        /*
         return <section classNameName="region">
         {this.state.coordinates.map(function(coordinate) {
         return <Coordinate key={coordinate.id} tile={coordinate.tile} node={coordinate.node} items={coordinate.items} characters={coordinate.characters} player={coordinate.player} />;
         })}
         </section>;
         */

        return (
            <section className="region" style={{width:'100vmin', height:'100vmin'}}>
                <div className={this.state.cycle}></div>
                <div className="row">
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                </div>

                <div className="row">
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                        <div className="character" style={{backgroundImage: 'url(/img/characters/default.gif)'}}></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                        <Player data={this.props.player} />
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_3.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_3.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_3.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_2.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                </div>

                <div className="row">
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node" style={{backgroundImage: 'url(/img/nodes/radiated-space.gif)'}}></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_3.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_3.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_3.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_2.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_2.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                </div>

                <div className="row">
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node" style={{backgroundImage: 'url(/img/nodes/radiated-space-bone-pile.gif)'}}></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_2.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_2.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_3.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                </div>

                <div className="row">
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                </div>

                <div className="row">
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                </div>

                <div className="row">
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                </div>

                <div className="row">
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile" style={{backgroundImage: 'url(/img/tiles/grass_1.gif)'}}>
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                </div>

                <div className="row">
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                    <div className="tile">
                        <div className="node"></div>
                    </div>
                </div>
            </section>);
    }
});