import React, {Component} from 'react';
import {fetchSceneById} from '../../api/scene';
import {mapStateAndActions} from '../../store/storeUtils';
import {Button, Table} from 'antd';
import {fetchStationByScene} from '../../api/station';

class SceneStations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scene: {},
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

    renderTableOperations(data) {
        const {history} = this.props;
        const {id} = data;
        return (<>
            <Button type="link">解除绑定</Button>
            <Button type="link" onClick={() => history.push({pathname: `/station-slots/${id}`})}>货道管理</Button>
            <Button type="link">修改</Button>
        </>);
    }

    render() {
        const {stations} = this.state;
        return (
            <div className="scene-stations">
                <Table dataSource={stations}>
                    <Table.Column dataIndex="id" title="#" key="id"/>
                    <Table.Column dataIndex="name" title="站点名称" key="name"/>
                    <Table.Column dataIndex="description" title="描述" key="description"/>
                    <Table.Column title="操作" key="operations" render={data => this.renderTableOperations(data)}/>
                </Table>
            </div>
        );
    }
}

export default mapStateAndActions(SceneStations);
