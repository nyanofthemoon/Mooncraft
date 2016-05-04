import React, {Component, PropTypes} from 'react'

import Tile from './Tile'

class Row extends Component {
    render() {
        return (
            <div className="region__row">
                {this.props.cells.map(function(cell, index) {
                    return (<Tile
                        key   = {'tile-' + index}
                        x     = {cell.getIn(['coordinates','x'])}
                        y     = {cell.getIn(['coordinates','y'])}
                        data  = {cell.getIn(['tile','data'])}
                        node  = {cell.getIn(['node','data'])}
                        items = {cell.getIn(['items','data'])}
                    />);
                })}
            </div>
        );
    }
}

Row.propTypes = {
    cells: PropTypes.object.isRequired
}

export default Row;