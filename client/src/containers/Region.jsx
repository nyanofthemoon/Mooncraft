import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import Row from './../components/Row';

import {queryPlayer, queryPlayerReception, queryRegion, queryRegionReception, queryCycling, queryCyclingReception} from './../actions';

class Region extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {player, region, actions} = this.props
        let playerJS = {}; if (player) { playerJS = player.get('data'); }
        let rowsJS   = []; if (region) { rowsJS = region.get('rows').toJS(); }

        let aspectRatioRows = 100;
        let aspectRatioCols = 70;
         /* // @TODO Forcing view to 20x14 surrounding player
         if (this.state.data) {
         let rows = this.state.data.tiles[0].length;
         let cols = this.state.data.tiles.length;
         if (cols > rows) {
         aspectRatioRows = Math.round((rows / cols) * 100);
         } else if (cols < rows) {
         aspectRatioCols = Math.round((cols / rows) * 100);
         }
         }
         */
        aspectRatioRows += 'vmax';
        aspectRatioCols += 'vmax';

        let minRow  = 0;
        let maxRow  = 14;
        if (playerJS.region) {
            maxRow = playerJS.region.y + 7;
            minRow = playerJS.region.y - 7;
            if (minRow < 0) {
                maxRow += Math.abs(minRow);
                minRow = 0;
            }
        }

        if (rowsJS.length > 0) {
            let rowSize = rowsJS[0].length;
            if (maxRow > rowSize) {
                maxRow = rowSize;
            }
        }

        return (
            <section className="region" style={{width:aspectRatioRows, height:aspectRatioCols}}>
                <div className={['cycle', 'cycle--' + region.get('cycle')].join(' ')}></div>
                {rowsJS.slice(minRow, maxRow).map(function(row, index) {
                    let uid = 'row-' + index;
                    return (<Row ref="Row" key={uid} data={row} player={playerJS}/>);
                })}
            </section>
        );
    }
}

Region.contextTypes = {
    store: React.PropTypes.object.isRequired
}

Region.propTypes = {
    player: PropTypes.object.isRequired,
    region: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        player: state.player,
        region: state.region
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            queryPlayer,
            queryPlayerReception,
            queryRegion,
            queryRegionReception,
            queryCycling,
            queryCyclingReception
        }, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Region);