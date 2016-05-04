import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

class Player extends Component {
    render() {
        const {player} = this.props
        let iconParts = player.get('data').icon.split('.')
        let icon      = iconParts[0] + '_' + player.get('direction') + '.' + iconParts[1]
        return (<div id="player" style={{backgroundImage: 'url(/img/' + icon + ')'}}></div>);
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