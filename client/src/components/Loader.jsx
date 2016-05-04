import React, {Component} from 'react'

import {loadAllAudiosWithProgress}   from '../helpers/audio/loader';
import {loadAllGraphicsWithProgress} from '../helpers/graphic/loader';

const GRAPHICAL_ASSETS = require('./../package/graphic.js');
const AUDIO_ASSETS     = require('./../package/audio.js');

class Loader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step     : 'information',
            musics   : {},
            sounds   : {},
            count    : 0,
            progress : 0
        };
    }
    componentWillMount() {
        var count  = 0;
        var assets = {
            audio: {},
            graphic: {}
        };
        Object.keys(AUDIO_ASSETS).map(function(key) {
            assets.audio[key] = Object.keys(AUDIO_ASSETS[key]).length;
            count += assets.audio[key];
        });
        Object.keys(GRAPHICAL_ASSETS).map(function(key) {
            assets.graphic[key] = GRAPHICAL_ASSETS[key].length;
            count += assets.graphic[key];
        });
        this.setState({
            remaining: assets,
            count: count
        });
    }
    componentDidMount() {
        var that  = this;
        function updateProgress() {
            that.setState({
                progress: (that.state.progress + 1)
            });
        }
        this.setState({ step: 'music' });
        loadAllAudiosWithProgress(AUDIO_ASSETS.MUSIC, updateProgress)
            .then(
                function(musicTracks) {
                    that.setState({
                        step: 'sounds',
                        musics: musicTracks
                    });
                    return loadAllAudiosWithProgress(AUDIO_ASSETS.SOUND, updateProgress);
                }
            ).then(
            function(soundTracks) {
                that.setState({
                    step: 'tiles',
                    sounds: soundTracks
                });
                return loadAllGraphicsWithProgress(GRAPHICAL_ASSETS.TILES, updateProgress);
            }
        ).then(
            function(tileGraphics) {
                that.setState({ step: 'nodes' });
                return loadAllGraphicsWithProgress(GRAPHICAL_ASSETS.NODES, updateProgress);
            }
        ).then(
            function(nodeGraphics) {
                that.setState({ step: 'items' });
                return loadAllGraphicsWithProgress(GRAPHICAL_ASSETS.ITEMS, updateProgress);
            }
        ).then(
            function(itemGraphics) {
                that.props.handleCompletion(that.state.musics, that.state.sounds);
            }
        );
    }
    render() {
        let percentage = Math.ceil((this.state.progress / this.state.count) * 100);
        return (
            <div className="text-centered">
                <h2 className="loading">Loading {this.state.step.toLowerCase()}</h2>
                <div className="progressbar">
                    <span style={{width:percentage + '%'}} />
                </div>
            </div>
        );
    }
}

export default Loader;