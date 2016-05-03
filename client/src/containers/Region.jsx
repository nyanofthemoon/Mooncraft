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
        // @TODO Switch to Immutable
        let playerJS = {}; if (player) { playerJS = player.get('data'); }
        let rowsJS   = []; if (region) { rowsJS   = region.get('rows').toJS(); }
        // @TODO Support maps of different sizes
        return (
            <section className="region">
                <div className={['cycle', 'cycle--' + region.get('cycle')].join(' ')}></div>
                {rowsJS.map(function(row, index) {
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