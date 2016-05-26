import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Row from './../components/Row';

class Region extends Component {
    render() {
        const {region, player} = this.props

        let playerRegion = player.get('data').region
        let regionRows   = region.get('rows')

        let sliceStartX = 0;
        let sliceStartY = 0;
        let sliceEndX = 0;
        let sliceEndY = 0;
        let width, height;

        if (playerRegion && regionRows) {
            let playerX = playerRegion.x
            let playerY = playerRegion.y
            let maxX = region.get('maxX')
            let maxY = region.get('maxY')
            let sizeX = region.get('viewportRows')
            let sizeY = region.get('viewportCols')
            sliceStartX = playerX - sizeX;
            sliceStartY = playerY - sizeY;
            sliceEndX = playerX + sizeX;
            sliceEndY = playerY + sizeY;

            if (sliceStartX < 0) {
                sliceEndX = sliceEndX - sliceStartX;
                sliceStartX = 0;
            } else if (sliceEndX > maxX) {
                sliceStartX = sliceStartX - (sliceEndX - maxX);
                sliceEndX = maxX;
            }

            if (sliceStartY < 0) {
                sliceEndY = sliceEndY - sliceStartY;
                sliceStartY = 0;
            } else if (sliceEndY > maxY) {
                sliceStartY = sliceStartY - (sliceEndY - maxY);
                sliceEndY = maxY;
            }

            let ratio = sizeX / sizeY;
            width     = ratio * 100;
            height    = 100;
        }

        return (
            <section className="region" style={{width: width + 'vmin', height: height + 'vmin'}}>
                <div className={['cycle', 'cycle--' + region.get('cycle')].join(' ')}></div>
                {region.get('rows').slice(sliceStartY, sliceEndY + 1).map(function(row, index) {
                    return (<Row
                        key   = {'row-' + index}
                        cells = {row.slice(sliceStartX, sliceEndX + 1)}
                    />);
                })}
            </section>
        );

    }
}
5
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

export default connect(mapStateToProps)(Region);