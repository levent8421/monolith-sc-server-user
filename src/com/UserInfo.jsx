import React, {Component} from 'react';
import {mapStateAndActions} from '../store/storeUtils';
import {Avatar, Button, Col, Form, Input, Modal, Row, Typography} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {fetchMe} from '../api/user';
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

    showUpdateUserModal(show) {
        console.log(show);
        this.setState({resetPasswordModalVisible: show})
    }

    updateUser(data) {

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
                            <Button type="primary" onClick={() => this.showUpdateUserModal(true)}>重置密码</Button>
                        </div>
                    </Col>
                </Row>
                <Modal title="重置密码" visible={resetPasswordModalVisible}
                       onCancel={() => this.showUpdateUserModal(false)}
                       cancelText="取消" okText="确定">
                    <Form ref={form => this.resetPasswordForm = form}>
                        <Form.Item label="原密码">
                            <Input/>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default mapStateAndActions(UserInfo);
