import React, {Component} from 'react';
import {mapStateAndActions} from '../store/storeUtils';
import {Avatar, Button, Col, Form, Input, message, Modal, Row, Typography} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {fetchMe, resetPassword, updateUserInfo} from '../api/user';
import './UserInfo.less';

const {Title} = Typography;

class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            resetPasswordModalVisible: false,
        };
        this.updateUser.bind(this);
    }

    refreshUserInfo() {
        const _this = this;
        fetchMe().then(user => {
            _this.setState({user: user});
            if (this.userInfoForm) {
                this.userInfoForm.setFieldsValue(user);
            }
        });
    }

    componentDidMount() {
        const {storeOperations} = this.props;
        storeOperations.setTitle('用户信息', '用户信息维护');
        this.refreshUserInfo();
    }

    showResetPasswordModal(show) {
        this.setState({resetPasswordModalVisible: show})
    }

    updateUser(data) {
        updateUserInfo(data).then(res => {
            message.success(`用户[${res.username}]更新成功！`);
        });
    }

    doResetPassword(data) {
        const {rePassword, password, oldPassword} = data;
        if (rePassword !== password) {
            message.error('两次输入密码不一至！');
            return;
        }
        const param = {
            password,
            oldPassword
        };
        const _this = this;
        resetPassword(param).then(res => {
            message.success(`用户[${res.loginName}]密码重置成功`);
            _this.showResetPasswordModal(false);
        });
    }

    render() {
        const {resetPasswordModalVisible} = this.state;
        return (
            <div className="user-info">
                <Title level={3}>用户信息编辑:</Title>
                <Row>
                    <Col span={12}>
                        <Form ref={form => this.userInfoForm = form} onFinish={this.updateUser}>
                            <Form.Item name="username" label="用户名" rules={[{required: true, message: '请输入用户名'}]}>
                                <Input/>
                            </Form.Item>
                            <Form.Item name="loginName" label="登录名">
                                <Input disabled={true}/>
                            </Form.Item>
                            <Form.Item>
                                <Button htmlType="submit" type="primary">保存</Button>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col span={12}>
                        <div className="avatar-wrapper">
                            <Avatar className="avatar">
                                <UserOutlined/>
                            </Avatar>
                        </div>
                        <div className="right-btns">
                            <Button type="primary" onClick={() => this.showResetPasswordModal(true)}>重置密码</Button>
                        </div>
                    </Col>
                </Row>
                <Modal title="重置密码" visible={resetPasswordModalVisible}
                       onCancel={() => this.showResetPasswordModal(false)}
                       cancelText="取消" okText="确定"
                       onOk={() => this.resetPasswordForm && this.resetPasswordForm.submit()} closable={false}
                       maskClosable={false}>
                    <Form ref={form => this.resetPasswordForm = form} onFinish={data => this.doResetPassword(data)}>
                        <Form.Item label="原密码" name="oldPassword" rules={[{required: true, message: '请输入原密码'}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="新密码" name="password" rules={[{required: true, message: '请输入新密码'}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="重复密码" name="rePassword" rules={[{required: true, message: '请重复输入新密码'}]}>
                            <Input/>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default mapStateAndActions(UserInfo);
