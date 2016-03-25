import React from 'react';

export default React.createClass({
    render() {
        let backgroundImage = 'url(/img/nodes/' + this.props.data.icon+')';
        return (<div className="region__row__tile__node" style={{backgroundImage: backgroundImage}}></div>);
    }
});