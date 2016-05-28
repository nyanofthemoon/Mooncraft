import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Row from './../components/Row';
import {getAspectRatio, getSliceBoundaries} from '../helpers/region';

class Region extends Component {
    render() {
        const {region, player} = this.props

        let mapY, boundaryY, mapX, boundaryX, playerX, playerY = 0
        let playerRegion = player.get('data').region
        let regionRows   = region.get('rows')
        if (playerRegion && regionRows) {
            mapY      = region.get('mapY')
            mapX      = region.get('mapX')
            boundaryY = region.get('boundaryY')
            boundaryX = region.get('boundaryX')
            playerX   = playerRegion.x
            playerY   = playerRegion.y
        }

        let rowSliceBoundaries = getSliceBoundaries(playerY, boundaryY, mapY)
        let celSliceBoundaries = getSliceBoundaries(playerX, boundaryX, mapX)
        return (
            <section className="region">
                <div className={['cycle', 'cycle--' + region.get('cycle')].join(' ')}></div>
                {region.get('rows').slice(rowSliceBoundaries.start, rowSliceBoundaries.end).map(function(row, index) {
                    return (<Row
                        key   = {'row-' + index}
                        size  = {region.get('tileSize')}
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