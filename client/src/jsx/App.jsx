import io from 'socket.io-client';
import React from 'react';

import Config  from './../config'
import Loader  from './Loader';
import Console from './Console';
import Region  from './Region';
import LoginForm  from './LoginForm';

const STATE_LOADING = 'loading';
const STATE_LOADED  = 'loaded';
const STATE_RUNNING = 'running';

export default React.createClass({
    getInitialState() {
        return {
            status: STATE_LOADING,
            socket: null,
            audio : {
                music: [],
                sound: []
            }
        };
    },
    _handleLoaderCompletion(musics, sounds) {
        let audio = {
            music : musics,
            sounds: sounds
        };
        this.setState({
            audio : audio,
            status: STATE_LOADED
        });
        this._playMusic('intro');
    },
    _handlePlayerConnection(username, password) {
        var that = this;
        this.state.socket = io.connect('//' + Config.environment.host + Config.environment.port, { "query": { "name": username, "pass": password } });
        this.state.socket.on('connect', function(data) {
            that.setState({ status: STATE_RUNNING });
            that.state.socket.on('query', function(data) {
                that.refs.Region.handleUpdate(data);
            });
            that.state.socket.on('say', function(data) {
                that.refs.Console.handleUpdate(data);
            });
            that.state.socket.on('enter', function(data) {
                that.refs.Console.handleUpdate(data);
            });
            that.state.socket.on('leave', function(data) {
                that.refs.Console.handleUpdate(data);
            });
            that._emitSocketEvent('query', { type: 'cycling' });
            that._emitSocketEvent('query', { type: 'player' });
        });
    },
    _emitSocketEvent(type, data) {
        this.state.socket.emit(type, data);
    },
    _playMusic(id) {
        this.state.audio.music.forEach(function(music) {
            music.track.stop();
            if (id === music.id) {
                music.track.play();
            }
        });
    },
    _playSound(id) {
        this.state.audio.sound.forEach(function(sound) {
            if (id === sound.id) {
                sound.track.play();
                return;
            }
        });
    },
    render() {
        switch(this.state.status) {
            default:
            case STATE_LOADING:
                return (
                    <div className="flex-vertical-container light-text">
                        <h1 className="logo">MoonCraft</h1>
                        <Loader ref="Loader" handleCompletion={this._handleLoaderCompletion} />
                        <div className="title_background"></div>
                        <div className="title_animation_overlay"></div>
                    </div>
                );
            case STATE_LOADED:
                return (
                    <div className="flex-vertical-container light-text">
                        <h1 className="logo">MoonCraft</h1>
                        <LoginForm ref="LoginForm" handleConnection={this._handlePlayerConnection}  />
                        <div className="title_background"></div>
                        <div className="title_animation_overlay"></div>
                    </div>
                );
            case STATE_RUNNING:
                return (
                    <div className="dark-text">
                        <Region ref="Region" handlePlayMusic={this._playMusic} handleEventEmission={this._emitSocketEvent} handlePlaySound={this._playSound} />
                        <Console ref="Console" />
                    </div>
                );
        }
    }
});