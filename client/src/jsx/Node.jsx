import React from 'react';

export default React.createClass({
    render() {
        let backgroundImage = 'url(/img/nodes/' + this.props.data.icon+')';
        return (<div className="node" style={{backgroundImage: backgroundImage}}></div>);
    }
});