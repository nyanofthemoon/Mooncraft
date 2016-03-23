import React from 'react';

export default React.createClass({
    getInitialState() {
        return {
            data: {}
        };
    },
    render() {
        console.log(this.state.data);

        let playerIcon = '';
        if (this.state.data.icon) {
            playerIcon = 'url(/img/' + this.state.data.icon + ')';
        }
        return (<div id="player" style={{backgroundImage: playerIcon}}></div>);
    }
});