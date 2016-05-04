import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Tile from './Tile'

class Row extends Component {
    render() {
        return (
            <div className="region__row">
                {this.props.cells.map(function(cell, index) {
                    return (<Tile
                        key        = {'tile-' + index}
                        x          = {cell.getIn(['coordinates','x'])}
                        y          = {cell.getIn(['coordinates','y'])}
                        data       = {cell.getIn(['tile','data'])}
                        node       = {cell.getIn(['node','data'])}
                        items      = {cell.getIn(['items','data'])}
                    />);
                })}
            </div>
        );
    }
}

Row.contextTypes = {
    store: PropTypes.object.isRequired
}

Row.propTypes = {
    cells     : PropTypes.object.isRequired,
    player    : PropTypes.object.isRequired,
    characters: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        player    : state.player,
        characters: state.characters
    }
}

export default connect(mapStateToProps)(Row);