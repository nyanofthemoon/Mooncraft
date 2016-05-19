import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import Loader from './../components/Loader';
import ConnectionForm from './../components/ConnectionForm';
import Region from './Region';
import Console from './../components/Console';

import {assetLoaderCompletion, connectSocket, sayRegion} from './../actions';

class App extends Component {
    render() {
        const {engine, actions} = this.props
        switch(engine.get('status')) {
            default:
            case 'loading':
                return (<div className="flex-vertical-container light-text">
                    <h1 className="logo">MoonCraft</h1>
                    <Loader handleCompletion={actions.assetLoaderCompletion}/>
                    <div className="titlescreen titlescreen__background"></div>
                    <div className="titlescreen titlescreen__overlay"></div>
                </div>);
            case 'loaded':
                return (<div className="flex-vertical-container light-text">
                    <h1 className="logo">MoonCraft</h1>
                    <ConnectionForm handleSubmit={actions.connectSocket}/>
                    <div className="titlescreen titlescreen__background"></div>
                    <div className="titlescreen titlescreen__overlay"></div>
                </div>);
            case 'connected':
                return (<div className="flex-vertical-container light-text">
                    <Console ref="Console" handleSubmit={actions.sayRegion}/>
                    <Region ref="Region" />
                </div>);
                break;
        }
    }
}

App.propTypes = {
    engine: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        engine: state.engine
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            assetLoaderCompletion,
            connectSocket,
            sayRegion
        }, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);