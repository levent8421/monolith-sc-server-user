import React, {Component} from 'react';
import {fetchSceneById, updateScene} from '../../api/scene';
import {mapStateAndActions} from '../../store/storeUtils';
import {Button, Form, Input, message} from 'antd';
import './SceneDetial.less';

class SceneDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scene: {}
        };
    }

    componentDidMount() {
        const {params} = this.props.match;
        this.props.storeOperations.setTitle('场景详情', 'Loading......');
        this.refreshSceneInfo(params.id);
    }

    refreshSceneInfo(id) {
        fetchSceneById(id).then(res => {
            this.setState({
                scene: res,
            });
            this.props.storeOperations.setTitle('场景详情', res.name);
            this.form && this.form.setFieldsValue(res);
        });
    }

    updateScene(data) {
        const {scene} = this.state;
        data.id = scene.id;
        updateScene(data).then(res => {
            const {name} = res;
            message.success(`场景[${name}]更新成功！`);
        });
    }

    render() {
        const {scene} = this.state;
        return (
            <div className="scene-detail">
                <div className="operation-links">
                    <h2>操作</h2>
                    <div className="links">
                        <span>操作：</span>
                        <Button type="link"
                                onClick={() => this.props.history.push({pathname: `/scene-skus/${scene.id}`})}>
                            物料管理
                        </Button>
                        <Button type="link"
                                onClick={() => this.props.history.push({pathname: `/scene-stations/${scene.id}`})}>
                            站点管理
                        </Button>
                    </div>
                </div>
                <h2>基本信息</h2>
                <Form labelCol={{span: 2}}
                      labelAlign="left"
                      ref={form => this.form = form}
                      onFinish={data => this.updateScene(data)}>
                    <Form.Item label="name" name="name" rules={[{required: true, message: '请输入名称'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="描述" name="description">
                        <Input.TextArea rows={6}/>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit" type="primary">保存更改</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default mapStateAndActions(SceneDetail);
