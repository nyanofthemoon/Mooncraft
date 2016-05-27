import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Row from './../components/Row';
import {getAspectRatio, getRowsSliceBoundaries, getCellsSliceBoundaries} from '../helpers/region';

class Region extends Component {
    render() {
        const {region, player} = this.props

        let maxRow, maxRows, maxCell, maxCells, playerX, playerY = 0
        let playerRegion = player.get('data').region
        let regionRows   = region.get('rows')
        if (playerRegion && regionRows) {
            maxRow  = region.get('rowCount') - 1
            maxCell = region.get('cellCount') - 1
            maxCells    = region.get('maxCells')
            maxRows     = region.get('maxRows')
            playerX     = playerRegion.x
            playerY     = playerRegion.y
        }

        let aspectRatio        = getAspectRatio((maxCells+1), (maxRows+1))
        let rowSliceBoundaries = getRowsSliceBoundaries(playerY, maxRows, maxRow)
        let celSliceBoundaries = getCellsSliceBoundaries(playerX, maxCells, maxCell)
        return (
            <section className="region" style={{width: aspectRatio.width + 'vmin', height: aspectRatio.height + 'vmin'}}>
                <div className={['cycle', 'cycle--' + region.get('cycle')].join(' ')}></div>
                {region.get('rows').slice(rowSliceBoundaries.start, rowSliceBoundaries.end).map(function(row, index) {
                    return (<Row
                        key   = {'row-' + index}
                        cells = {row.slice(celSliceBoundaries.start, celSliceBoundaries.end)}
                    />)
                })}
            </section>
        )

    }
}

Region.contextTypes = {
    store: PropTypes.object.isRequired
}

Region.propTypes = {
    region: PropTypes.object.isRequired,
    player: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        region: state.region,
        player: state.player
    }
}

export default connect(mapStateToProps)(Region)