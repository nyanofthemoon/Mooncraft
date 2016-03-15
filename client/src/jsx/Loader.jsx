import React from 'react';

const ASSETS = require('./../package/assets.js');

export default React.createClass({
    getInitialState() {
        return {
            status   : '',
            step     : 'information',
            progress : 0,
            remaining: 0
        };
    },
    getRemaining() {
        return this.state.remaining;
    },
    componentWillMount() {
        var totalAssets = 0;
        for (let assetName in ASSETS) {
            totalAssets += ASSETS[assetName].length;
        }
        this.setState({
            remaining: totalAssets
        });
    },
    componentDidMount() {
        var that = this;
        for (let assetName in ASSETS) {
            let assetNameQuantity = ASSETS[assetName].length;
            for (let assetNameIndex in ASSETS[assetName]) {
                let assetNameProgress =  Math.round((assetNameIndex / assetNameQuantity) * 100);
                var image    = new Image();
                image.onload = function() {
                    let remainingCount = that.getRemaining() - 1;
                    if (remainingCount > 0) {
                        that.setState({
                            step     : assetName,
                            progress : assetNameProgress,
                            remaining: remainingCount
                        });
                    } else {
                        that.props.handleCompletion();
                    }
                };
                image.onerror = function() {
                    console.log('[LOADER] Error loading ' + this.src);
                }
                image.src = '/img/' + ASSETS[assetName][assetNameIndex];
            }
        }
    },
    render() {
        return (
            <div>
                <h2>Loading {this.state.step}</h2>
                <h3>{this.state.progress} %</h3>
            </div>
        );
    }
});