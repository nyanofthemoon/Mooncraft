import React from 'react';

const ASSETS = require('./../package/assets.js');

export default React.createClass({
    getInitialState() {
        return {
            status  : '',
            step    : 'information',
            progress: 0
        };
    },
    componentDidMount() {
        var that = this;
        for (let assetName in ASSETS) {
            let assetNameQuantity = ASSETS[assetName].length;
            for (let assetNameIndex in ASSETS[assetName]) {
                let assetNameProgress =  Math.round((assetNameIndex / assetNameQuantity) * 100);
                var image    = new Image();
                image.onload = function() {
                    that.setState({
                        step    : assetName,
                        progress: assetNameProgress
                    });
                };
                image.onerror = function() {
                    console.log('[LOADER] Error loading ' + this.src);
                }
                image.src = '/img/' + ASSETS[assetName][assetNameIndex];
            }
        }

        this.props.handleLoaderCompletion();
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