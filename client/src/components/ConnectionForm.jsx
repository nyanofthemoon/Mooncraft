import React, {Component, PropTypes} from 'react'

class ConnectionForm extends Component {
    _handleFormSubmit(e) {
        e.preventDefault();
        var username = this.refs.username.value;
        var password = this.refs.password.value;
        if (username.length >= 1 && password.length >= 1) {
            this.props.handleSubmit(username, password, this.context.store);
        }
    }
    render() {
        return (
            <form className="flex-horizontal-container" action="" onSubmit={this._handleFormSubmit.bind(this)}>
                <div>
                    <input type="text" ref="username" placeholder="username"/>
                </div>
                <div>
                    <input type="password" ref="password" placeholder="password"/>
                </div>
                <div>
                    <button type="submit">Play</button>
                </div>
            </form>
        );
    }
}

ConnectionForm.contextTypes = {
    store: React.PropTypes.object.isRequired
}

export default ConnectionForm;