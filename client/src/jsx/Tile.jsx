import React from 'react';

import Node      from './Node';
//import Item      from './Item';
//import Character from './Character';

export default React.createClass({
    render() {
        let backgroundImage = 'url(/img/tiles/' + this.props.data.icon+')';
        return (<div className="tile" style={{backgroundImage: backgroundImage}}>
            <Node ref="Node" data={this.props.node} />
        </div>);
    }
});