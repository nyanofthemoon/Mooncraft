import React from 'react';

let Howler = require('howler').Howl;

const GRAPHICAL_ASSETS = require('./../package/assets.js');
const AUDIO_ASSETS     = require('./../package/audio.js');

export default React.createClass({
    getInitialState() {
        return {
            status   : '',
            step     : 'information',
            remaining: 0,
            progress : 0
        };
    },
    getRemaining() {
        return this.state.remaining;
    },
    componentWillMount() {
        var totalAssets = 0;
        for (let assetName in GRAPHICAL_ASSETS) {
            totalAssets += GRAPHICAL_ASSETS[assetName].length;
        }
        this.setState({
            remaining: totalAssets
        });
    },
    componentDidMount() {
        var that  = this;
        var audio = {
            music: {},
            sound: {}
        };
        for (let musicName in AUDIO_ASSETS.MUSIC) {
            audio.music[musicName] = new Howler({
                urls: [AUDIO_ASSETS.MUSIC[musicName]],
                loop: true
            });
        }
        for (let soundName in AUDIO_ASSETS.SOUND) {
            audio.sound[soundName] = new Howler({
                urls: [AUDIO_ASSETS.SOUND[soundName]],
                loop: false
            });
        }

        for (let assetName in GRAPHICAL_ASSETS) {
            let assetNameQuantity = GRAPHICAL_ASSETS[assetName].length;
            for (let assetNameIndex in GRAPHICAL_ASSETS[assetName]) {
                let assetNameProgress = ((parseInt(assetNameIndex)+1) / assetNameQuantity) * 100;
                var image    = new Image();
                image.onload = function () {
                    let remainingCount = that.getRemaining() - 1;
                    that.setState({
                        step     : assetName,
                        progress : assetNameProgress,
                        remaining: remainingCount
                    });
                    if (remainingCount == 0) {
                        that.props.handleCompletion(audio);
                    }
                };
                image.onerror = function () {
                    console.log('[LOADER] Error loading ' + this.src);
                };
                image.src = '/img/' + GRAPHICAL_ASSETS[assetName][assetNameIndex];
            }
        }
    },
    render() {
        return (
            <div>
                <h3>Loading {this.state.step.toLowerCase()}</h3>
                <div className="progress_bar">
                    <span style={{width:this.state.progress + '%'}} />
                </div>
            </div>
        );
    }
});