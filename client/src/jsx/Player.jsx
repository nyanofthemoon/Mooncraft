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
        return this.props.handleConnection(this.refs.username.value, this.refs.password.value);
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
                return (<form>
                    <h1>Connect Form</h1>
                    Username <input type="text" ref="username" />
                    Password <input type="password" ref="password" />
                    <input type="button" value="Play" onClick={this._handleConnectionFormButtonClick} />
                </form>);
            case STATE_CONNECTED:
                return (<div>[ PLACE HERE ]</div>);
        }
    }
});