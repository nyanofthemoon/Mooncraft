import React, {Component} from 'react'

class Node extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let backgroundImage = 'url(/img/nodes/' + this.props.data.icon+')';
        return (<div className="region__row__tile__node" style={{backgroundImage: backgroundImage}}></div>);
    }
}

export default Node;