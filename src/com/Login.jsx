import React, {Component} from 'react';
import {mapStateAndActions} from '../store/storeUtils';
import {Button, Form, Input} from 'antd';
import './Login.less';
import {login} from '../api/user';

class Login extends Component {
    componentDidMount() {
        const {storeState, history} = this.props;
        const {webToken} = storeState;
        if (webToken) {
            history.replace({pathname: '/'});
        }
    }

    login(data) {
        const {setToken} = this.props.storeOperations;
        login(data).then(res => {
            const {account, token} = res;
            setToken(token, account);
            this.props.history.replace({pathname: '/'});
        });
    }

    render() {
        return (
            <div className="login">
                <div className="form-wrapper">
                    <h2>登录</h2>
                    <Form labelCol={{span: 3}} onFinish={data => this.login(data)}>
                        <Form.Item label="登录名" name="loginName" rules={[{required: true, message: '请输入登录名'}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="密码" name="password" rules={[{required: true, message: '请输入密码'}]}>
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit" type="primary" className="login-btn">登录</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        );
    }
}

export default mapStateAndActions(Login);
