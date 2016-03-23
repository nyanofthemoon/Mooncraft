import React from 'react';

export default React.createClass({
    getInitialState() {
        return {
            contents: []
        };
    },
    handleUpdate(data) {
        switch(data.type) {
            case 'enter':
                return this._handleEnter(data.data);
            case 'leave':
                return this._handleLeave(data.data);
            case 'say':
                return this._handleSay(data.data);
            default:
                break;
        }
    },
    _handleEnter(data) {
        console.log('Region Enter Data Received', data);
    },
    _handleLeave(data) {
        console.log('Region Leave Data Received', data);
    },
    _handleSay(data) {
        console.log('Region Say Data Received', data);
    },
    render() {
        return <div id="console"></div>;
    }
});