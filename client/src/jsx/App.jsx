import io from 'socket.io-client';
import React from 'react';

let Howler = require('howler').Howl;

import Loader  from './Loader';
import Console from './Console';
import Player  from './Player';
import Region  from './Region';

const STATE_LOADING = 'loading';
const STATE_LOADED  = 'loaded';
const STATE_RUNNING = 'running';

export default React.createClass({
    getInitialState() {
        return {
            status: STATE_LOADING,
            socket: null,
            audio : {
                music: {},
                sound: {}
            }
        };
    },
    _handleLoaderCompletion(audio) {
        this.setState({
            audio : audio,
            status: STATE_LOADED
        });
        this._playMusic('intro');
    },
    _handlePlayerConnection(username, password) {
        var that = this;
        this.state.socket = io.connect('//' + document.location.hostname + ":8888", { "query": { "name": username, "pass": password } });
        this.state.socket.on('connect', function(data) {
            that.state.socket.on('query', function(data) {
                if (data.type === 'player') {
                    that.refs.Player.handleUpdate(data);
                } else {
                    that.refs.Region.handleUpdate(data);
                }
            });
            that._playMusic('theme');
            that.setState({ status: STATE_RUNNING });
            that._emitSocketEvent('query', { type: 'player' });
        });
    },
    _emitSocketEvent(type, data) {
        this.state.socket.emit(type, data);
    },
    _playMusic(name) {
        for (let musicName in this.state.audio.music) {
            this.state.audio.music[musicName].stop();
        }
        this.state.audio.music[name].play();
    },
    _playSound(name) {
        this.state.audio.sound[name].play();
    },
    render() {
        switch(this.state.status) {
            default:
            case STATE_LOADING:
                return (
                    <div className="centered">
                        <h1 className="title">MoonCraft</h1>
                        <Loader ref="Loader" handleCompletion={this._handleLoaderCompletion} />
                    </div>
                );
            case STATE_LOADED:
                return (
                    <div className="centered">
                        <h1 className="title">MoonCraft</h1>
                        <Player ref="Player" handleConnection={this._handlePlayerConnection} handleEventEmission={this._emitSocketEvent} handlePlaySound={this._playSound} />
                    </div>
                );
            case STATE_RUNNING:
                return (
                    <div>
                        <Player ref="Player" handleEventEmission={this._emitSocketEvent} handlePlaySound={this._playSound} />
                        <Region ref="Region" />
                        <Console ref="Console" />
                    </div>
                );
        }
    }
});