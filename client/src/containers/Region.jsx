import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import Row from './../components/Row';

class Region extends Component {
    // @TODO Support maps of different sizes
    render() {
        const {region} = this.props
        return (
            <section className="region">
                <div className={['cycle', 'cycle--' + region.get('cycle')].join(' ')}></div>
                {region.get('rows').map(function(row, index) {
                    return (<Row
                        key   = {'row-' + index}
                        cells = {row}
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
    region: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        region: state.region
    }
}

export default connect(mapStateToProps)(Region);