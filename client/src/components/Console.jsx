import {Sanitizer} from 'sanitizer';
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

class Console extends Component {
    _handleKeyUp(e) {
        if (13 === e.keyCode) {
            var message = Sanitizer.unescapeEntities(Sanitizer.sanitize(Sanitizer.escape(this.refs.message.value)));
            if (message.length >= 3) {
                this.refs.message.value = '';
                this.props.handleSubmit(message);
            }
        }
    }
    componentDidUpdate() {
        this.refs.textarea.scrollTop = this.refs.textarea.scrollHeight;
    }
    render() {
        const {engine} = this.props
        let contents = engine.get('notifications').reduce(function(list, notification) {
            return list + '\r\n' + notification.toString();
        });
        return (
          <div>
              <input className="console-content__checkbox" type="checkbox" id="console-content__checkbox"/>
              <div className="console-container">
                  <label className="console-content__icon" htmlFor="console-content__checkbox"></label>
                  <div className="console-content__list">
                      <textarea ref="textarea" readOnly={true} value={contents} rows="8"></textarea>
                      <input ref="message" id="console-input" type="text" onKeyUp={this._handleKeyUp.bind(this)}/>
                  </div>
              </div>
          </div>
        );
    }
};

Console.contextTypes = {
    store: PropTypes.object.isRequired
}

Console.propTypes = {
    engine: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        engine: state.engine
    }
}

export default connect(mapStateToProps)(Console);