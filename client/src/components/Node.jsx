import React, {Component, PropTypes} from 'react'

class Node extends Component {
    render() {
        return (<div className="region__row__tile__node" style={{backgroundImage: 'url(/img/nodes/' + this.props.data.get('icon')+')'}}></div>);
    }
}

Node.propTypes = {
    data: PropTypes.object.isRequired
}

export default Node;