import React from 'react';

export default React.createClass({
    _handleFormSubmit(e) {
        e.preventDefault();
        var username = this.refs.username.value;
        var password = this.refs.password.value;
        if (username.length >= 1 && password.length >= 1) {
            this.props.handleSubmit(username, password, this.context.store);
        }
    },
    contextTypes: {
        store: React.PropTypes.object.isRequired
    },
    render() {
        return (
            <form className="flex-horizontal-container" action="" onSubmit={this._handleFormSubmit}>
                <div>
                    <input type="text" ref="username" placeholder="username"/>
                </div>
                <div>
                    <input type="password" ref="password" placeholder="password"/>
                </div>
                <div>
                    <button type="submit">Play</button>
                </div>
            </form>);
    }
});