import React from 'react';

const STATE_DISCONNECTED = 'disconnected';
const STATE_CONNECTED    = 'connected';

export default React.createClass({
    getInitialState() {
        return {
            status: STATE_DISCONNECTED,
            data:   {}
        };
    },
    _handleConnectionFormButtonClick() {
        var username = this.refs.username.value;
        var password = this.refs.password.value;
        if (username.length >= 1 && password.length >= 1) {
            this.props.handleConnection(username, password);
        }
    },
    handleUpdate(data) {
        console.log('Player Query Data Received', data);
        // @TODO
        let newData = {};
        this.setState({
            status: STATE_CONNECTED,
            data  : newData
        });
    },
    render() {
        switch (this.state.status) {
            default:
            case STATE_DISCONNECTED:
                return (<form className="text-centered">
                    <div>
                        <input type="text" ref="username" placeholder="username" />
                    </div>
                    <div>
                        <input type="password" ref="password" placeholder="password" />
                    </div>
                    <div>
                        <input type="button" value="PLAY" onClick={this._handleConnectionFormButtonClick} />
                    </div>
                </form>);
            case STATE_CONNECTED:
                return (<div>[ PLACE HERE ]</div>);
        }
    }
});