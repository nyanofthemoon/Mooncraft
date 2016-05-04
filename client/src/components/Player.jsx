import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

class Player extends Component {
    render() {
        //@TODO Implement direction from this.props.get('direction')
        const {player} = this.props
        return (<div id="player" style={{backgroundImage: 'url(/img/' + player.get('data').icon + ')'}}></div>);
    }
}

Player.contextTypes = {
    store: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        player: state.player
    }
}

export default connect(mapStateToProps)(Player);