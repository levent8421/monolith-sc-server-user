import React, {Component} from 'react';
import {mapStateAndActions} from '../store/storeUtils';
import {bindStationScene, fetchConnectedStations} from '../api/station';
import {Button, Form, message, Modal, Select, Table} from 'antd';
import {UndoOutlined} from '@ant-design/icons';
import './StationScan.less';
import {fetchMyScenes} from '../api/userScene';

class StationScan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stations: [],
            scenes: [],
            bindingStation: {},
            bindModalVisible: false,
        };
    }

    componentDidMount() {
        const {storeOperations} = this.props;
        storeOperations.setTitle('站点扫描', '已连接站点列表');
        this.refreshStations();
    }

    refreshStations() {
        fetchConnectedStations().then(res => {
            res = res.map(s => {
                s.key = s.name;
                return s
            });
            this.setState({
                stations: res,
            });
        });
    }

    renderOperations(data) {
        return (<>
            <Button type="link" onClick={() => this.showSceneBindModal(true, data)}>绑定场景</Button>
        </>);
    }

    showSceneBindModal(show, station) {
        if (show) {
            fetchMyScenes().then(res => {
                const scenes = res.map(us => us.scene);
                this.setState({scenes: scenes});
            });
        }
        this.setState({bindModalVisible: show, bindingStation: station});
    }

    bindScene(data) {
        const {bindingStation} = this.state;
        const {sceneId} = data;
        bindStationScene(bindingStation.id, sceneId).then(() => {
            message.success('绑定成功！');
            this.showSceneBindModal(false, {});
            this.refreshStations();
        });
    }

    render() {
        const {stations, bindModalVisible, scenes, bindingStation} = this.state;
        return (
            <div className="station-scan">
                <div className="btn-group">
                    <Button icon={<UndoOutlined/>} type="primary" onClick={() => this.refreshStations()}>重新扫描</Button>
                </div>
                <Table dataSource={stations}>
                    <Table.Column dataIndex="name" title="连接名称" key="name"/>
                    <Table.Column dataIndex="sn" title="设备序列号" key="sn"/>
                    <Table.Column title="操作" key="operations" render={d => this.renderOperations(d)}/>
                </Table>
                <Modal title={`绑定场景：${bindingStation.name}`}
                       visible={bindModalVisible}
                       okText="绑定"
                       cancelText="取消"
                       onCancel={() => this.showSceneBindModal(false, {})}
                       onOk={() => this.bindForm && this.bindForm.submit()}>
                    <Form labelCol={{span: 3}}
                          ref={form => this.bindForm = form}
                          onFinish={data => this.bindScene(data)}>
                        <Form.Item label="场景" name="sceneId" rules={[{required: true, message: '请选择绑定的场景'}]}>
                            <Select>
                                {
                                    scenes.map(scene => (
                                        <Select.Option value={scene.id} key={scene.id}> {scene.name}</Select.Option>))
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default mapStateAndActions(StationScan);
