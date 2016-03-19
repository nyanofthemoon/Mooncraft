import React from 'react';

export default React.createClass({
    getInitialState() {
        return {
            status: 'connecting',
            data:   {}
        };
    },
    handleClick() {
        return this.props.handleConnection(this.refs.username.value, this.refs.password.value);
    },
    handleUpdate(data) {
        console.log('Player Update Data Received', data);
    },
    render() {
        switch (this.state.status) {
            case 'connecting':
                return <form>
                    <h1>Connect Form</h1>
                    Username <input type="text" ref="username" />
                    Password <input type="password" ref="password" />
                    <input type="button" value="Play" onClick={this.handleClick} />
                </form>;
            default:
                return <div>
                    Connected
                </div>;
        }
    }
});