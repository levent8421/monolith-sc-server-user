import React, {Component} from 'react';
import {mapStateAndActions} from '../store/storeUtils';

class UserInfo extends Component {
    componentDidMount() {
        const {storeOperations} = this.props;
        storeOperations.setTitle('用户信息', '用户信息维护');
    }

    render() {
        return (
            <div className="user-info">
                User Info
            </div>
        );
    }
}

export default mapStateAndActions(UserInfo);
