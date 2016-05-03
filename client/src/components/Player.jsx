import React, {Component} from 'react'

class Player extends Component {
    render() {
        let playerIcon = '';
        if (this.props.data.icon) {
            playerIcon = 'url(/img/' + this.props.data.icon + ')';
        }

        return (<div id="player" style={{backgroundImage: playerIcon}}></div>);
    }
}

export default Player;