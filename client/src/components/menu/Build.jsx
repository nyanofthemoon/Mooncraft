import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

class BuildMenu extends Component {
    render() {
        const {player} = this.props
        return (
          <div>
            <input className="menu-content__checkbox" type="checkbox" id="buildmenu-content__checkbox"/>
            <div className="menu-container">
              <label className="menu-content__icon" htmlFor="buildmenu-content__checkbox"></label>
              <div className="menu-content__list">
                Hello Build Menu
              </div>
            </div>
          </div>
        );
    }
};

BuildMenu.contextTypes = {
    store: PropTypes.object.isRequired
}

BuildMenu.propTypes = {
    player: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        player: state.player
    }
}

export default connect(mapStateToProps)(BuildMenu);