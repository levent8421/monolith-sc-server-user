import React, {Component} from 'react';
import {fetchSceneById} from '../../api/scene';
import {mapStateAndActions} from '../../store/storeUtils';
import {Button, Form, Input, message, Modal, Table} from 'antd';
import {fetchStationByScene, updateStation} from '../../api/station';

class SceneStations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scene: {},
            updateModalVisible: false,
            updatingStation: {},
        };
    }

    componentDidMount() {
        const {params} = this.props.match;
        this.sceneId = params.id;
        this.refreshScene(params.id);
        this.props.storeOperations.setTitle('场景站点管理', 'Loading......');
        this.refreshStations();
    }

    refreshStations() {
        fetchStationByScene(this.sceneId).then(res => {
            for (let station of res) {
                station.key = station.id;
            }
            this.setState({stations: res});
        });
    }

    refreshScene(id) {
        fetchSceneById(id).then(res => {
            const {name} = res;
            this.setState({scene: res});
            this.props.storeOperations.setTitle(`场景【${name}】站点管理`, '管理场景站点');
        });
    }

    showUpdateModal(show, station) {
        this.setState({
            updateModalVisible: show,
            updatingStation: station,
        });
        if (this.updateForm) {
            this.updateForm.setFieldsValue(station);
        }
    }

    updateStationInfo(data) {
        data.id = this.state.updatingStation.id;
        updateStation(data).then(res => {
            message.success('更新成功');
            this.showUpdateModal(false, {});
            this.refreshStations();
        });
    }

    renderTableOperations(data) {
        const {history} = this.props;
        const {id} = data;
        return (<>
            <div>
                <Button type="link">解除绑定</Button>
                <Button type="link" onClick={() => this.showUpdateModal(true, data)}>修改</Button>
            </div>
            <div>
                <Button type="link" onClick={() => history.push({pathname: `/station-slots/${id}`})}>货道管理</Button>
                <Button type="link" onClick={() => history.push({pathname: `/station-slot-state/${id}`})}>货道看板</Button>
            </div>
        </>);
    }

    render() {
        const {stations} = this.state;
        const {updateModalVisible, updatingStation} = this.state;
        return (
            <div className="scene-stations">
                <Table dataSource={stations}>
                    <Table.Column dataIndex="id" title="#" key="id"/>
                    <Table.Column dataIndex="name" title="站点名称" key="name"/>
                    <Table.Column dataIndex="description" title="描述" key="description"/>
                    <Table.Column title="操作" key="operations" render={data => this.renderTableOperations(data)}/>
                </Table>
                <Modal title="修改站点信息"
                       visible={updateModalVisible}
                       okText="确认"
                       cancelText="取消"
                       maskClosable={false}
                       onCancel={() => this.showUpdateModal(false, {})}
                       onOk={() => this.updateForm && this.updateForm.submit()}>
                    <Form ref={form => this.updateForm = form}
                          onFinish={data => this.updateStationInfo(data)}
                          initialValues={updatingStation}>
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

export default mapStateAndActions(SceneStations);
