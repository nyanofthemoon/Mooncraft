import React from 'react';

import Loader  from './Loader';
import Console from './Console';
import Player  from './Player';

export default React.createClass({
    getInitialState() {
        return {
            status: 'loading'
        };
    },
    componentDidMount() {
        this.setState({
            status: 'loading'
        });
    },
    handleLoaderCompletion() {
        this.setState({
            status: 'loaded'
        });
        console.log('App.handleLoader');
    },
    render() {
        switch(this.state.status) {
            case 'loading':
                return (
                    <div>
                        <h1 className="title">MoonCraft</h1>
                        <Loader handleLoaderCompletion={this.handleLoaderCompletion} />
                    </div>
                );
            case 'loaded':
                return (
                    <div>
                        <h1 className="title">MoonCraft</h1>
                        <h2>Loaded</h2>
                        <Console />
                        <Player />
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