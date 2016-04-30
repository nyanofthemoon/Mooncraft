import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import Loader    from './../components/Loader';
import LoginForm from './../components/Login';

import * as AppActions from './../actions';

class App extends Component {
    render() {
        const {engine, player, region, actions} = this.props
        switch(engine.get('status')) {
            default:
            case 'loading':
                return (<div className="flex-vertical-container light-text">
                    <h1 className="logo">MoonCraft</h1>
                    <Loader ref="Loader" handleCompletion={actions.assetLoaderCompletion}/>
                    <div className="titlescreen titlescreen__background"></div>
                    <div className="titlescreen titlescreen__overlay"></div>
                </div>);
            case 'loaded':
                return (<div className="flex-vertical-container light-text">
                    <h1 className="logo">MoonCraft</h1>
                    <LoginForm ref="LoginForm" handleSubmit={actions.connectSocket}/>
                    <div className="titlescreen titlescreen__background"></div>
                    <div className="titlescreen titlescreen__overlay"></div>
                </div>);
            case 'connected':
                return (<div className="flex-vertical-container light-text">
                    CONNECTED!
                </div>);
                break;
        }
    }
}

App.propTypes = {
    engine: PropTypes.object.isRequired,
    player: PropTypes.object.isRequired,
    region: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        engine: state.engine,
        player: state.player,
        region: state.region
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(AppActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);