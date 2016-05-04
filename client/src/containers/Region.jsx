import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import Row from './../components/Row';

import {queryPlayer, queryRegion, enterRegion, leaveRegion} from './../actions';

class Region extends Component {
    constructor(props) {
        super(props);
    }
    // @TODO Support maps of different sizes
    render() {
        const {player, region, characters, actions} = this.props
        return (
            <section className="region">
                <div className={['cycle', 'cycle--' + region.get('cycle')].join(' ')}></div>
                {region.get('rows').map(function(row, index) {
                    return (<Row
                        key        = {'row-' + index}
                        cells      = {row}
                    />);
                })}
            </section>
        );
    }
}

Region.contextTypes = {
    store: PropTypes.object.isRequired
}

Region.propTypes = {
    player    : PropTypes.object.isRequired,
    region    : PropTypes.object.isRequired,
    characters: PropTypes.object.isRequired,
    actions   : PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        player    : state.player,
        region    : state.region,
        characters: state.characters
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            queryPlayer,
            queryRegion,
            enterRegion,
            leaveRegion
        }, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Region);