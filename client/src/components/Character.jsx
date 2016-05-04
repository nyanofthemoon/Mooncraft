import React, {Component, PropTypes} from 'react'

class Character extends Component {
    render() {
        //@TODO Implement direction from this.props.get('direction')
        return (<div className="region__row__tile__character" style={{backgroundImage: 'url(/img/' + this.props.data.get('icon') + ')'}}></div>);
    }
}

Character.contextTypes = {
    data: PropTypes.object.isRequired
}

export default Character;