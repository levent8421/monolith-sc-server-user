import React, {Component} from 'react';
import {mapStateAndActions} from '../store/storeUtils';
import {createScene, fetchMyScenes} from '../api/userScene';
import SceneCard from './commons/SceneCard';
import {Button, Form, Input, message, Modal} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import './Scenes.less';

class Scenes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scenes: [],
            createModalVisible: false,
        };
    }

    componentDidMount() {
        const {storeOperations} = this.props;
        storeOperations.setTitle('场景管理', '场景列表');
        this.refreshScenes();
    }

    refreshScenes() {
        fetchMyScenes().then(res => {
            const scenes = [];
            for (let uc of res) {
                const scene = {...uc.scene};
                const role = uc.role;
                const createTime = uc.createTime;
                scene.role = role;
                scene.bindTime = createTime;
                scenes.push(scene);
            }
            this.setState({scenes: scenes});
        });
    }

    showCreateModal(show) {
        this.setState({createModalVisible: show});
    }

    createScene(data) {
        createScene(data).then(res => {
            const {scene} = res;
            message.success(`场景[${scene.name}]创建成功！`);
            this.showCreateModal(false);
            this.refreshScenes();
        });
    }

    render() {
        const {scenes, createModalVisible} = this.state;
        return (
            <div className="scenes">
                <div className="operation-btns">
                    <Button icon={<PlusOutlined/>}
                            type="primary"
                            onClick={() => this.showCreateModal(true)}>
                        创建场景
                    </Button>
                </div>
                <div className="cards">
                    {
                        scenes.map(scene => (<SceneCard key={scene.id} scene={scene}
                                                        onClick={() => this.props.history.push({pathname: `/scene/${scene.id}`})}/>))
                    }
                </div>
                <Modal visible={createModalVisible}
                       title="创建场景"
                       okText="创建"
                       cancelText="取消"
                       onOk={() => this.createForm && this.createForm.submit()}
                       onCancel={() => this.showCreateModal(false)}>
                    <Form ref={form => this.createForm = form}
                          onFinish={data => this.createScene(data)}
                          labelCol={{span: 3}}>
                        <Form.Item label="名称" name="name" rules={[{required: true, message: '请输入名称'}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="描述" name="description">
                            <Input.TextArea/>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default mapStateAndActions(Scenes);
