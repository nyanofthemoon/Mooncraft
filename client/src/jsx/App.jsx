import io from 'socket.io-client';
import React from 'react';

import Loader  from './Loader';
import Console from './Console';
import Player  from './Player';
import Region  from './Region';

export default React.createClass({
    getInitialState() {
        return {
            status: 'loading',
            socket: null
        };
    },
    handleLoaderCompletion() {
        if (this.refs.Player) {
            this.refs.Player.setState({ status: 'connecting' });
        }
        this.setState({
            status: 'loaded'
        });
    },
    handlePlayerConnection(username, password) {
        var that = this;
        this.state.socket = io.connect('//' + document.location.hostname + ":8888", { "query": { "name": username, "pass": password } });
        this.state.socket.on('connect', function(data) {
            that.state.socket.on('disconnect', function(data) {
                that.setState({
                    status: 'loaded'
                });
            });
            that.state.socket.on('query', function(data) {
                if (data.type === 'player') {
                    that.refs.Player.setState({
                        status: 'connected'
                    });
                    that.refs.Player.handleUpdate(data);
                } else {
                    that.refs.Region.handleUpdate(data);
                }
            });
            that.state.socket.emit('query', { type: 'player' });
            that.setState({
                status: 'connected'
            });
        });
    },
    render() {
        switch(this.state.status) {
            case 'loading':
                return (
                    <div>
                        <h1 className="title">MoonCraft</h1>
                        <Loader ref="Loader" handleCompletion={this.handleLoaderCompletion} />
                    </div>
                );
            case 'loaded':
                return (
                    <div>
                        <h1 className="title">MoonCraft</h1>
                        <h2>Loaded</h2>
                        <Player ref="Player" handleConnection={this.handlePlayerConnection} />
                    </div>
                );
            case 'connected':
                return (
                    <div>
                        <Player ref="Player" />
                        <Region ref="Region" />
                        <Console ref="Console" />
                    </div>
                );
            default:
                return (
                    <div>
                        <h1 className="title">MoonCraft</h1>
                    </div>
                );
        }
    }
});