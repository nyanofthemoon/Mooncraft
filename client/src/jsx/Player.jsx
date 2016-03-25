import React from 'react';

export default React.createClass({
    render() {
        let playerIcon = '';
        if (this.props.data.icon) {
            playerIcon = 'url(/img/' + this.props.data.icon + ')';
        }

        return (<div id="player" style={{backgroundImage: playerIcon}}></div>);
    }
});