import React, {Component} from 'react';
import {fetchStationById} from '../../api/station';
import {mapStateAndActions} from '../../store/storeUtils';
import {fetchLastRecordsByStation} from '../../api/slotDataRecord';
import {Button, message, Space, Table} from 'antd';
import {ClearOutlined, CloudDownloadOutlined, ReloadOutlined} from '@ant-design/icons';
import './StationSlotState.less';
import {
    asDifferenceStateString,
    asRefreshReasonString,
    asSlotStateString,
    asWeightStateString
} from '../../util/converter';

const renderWeight = record => {
    if (!record) {
        return '未知';
    }
    const {dataWeight, dataWeightState} = record;
    const state = asWeightStateString(dataWeightState);
    return `(${dataWeight} g)/${state}`;
};

const renderDifference = record => {
    if (!record) {
        return '未知';
    }
    const {dataDifference, dataDifferenceState} = record;
    const state = asDifferenceStateString(dataDifferenceState);
    return `(${dataDifference} g)/${state}`;
};

const renderSlotState = record => {
    if (!record) {
        return '未知';
    }
    const {slotState} = record;
    return asSlotStateString(slotState);
};

const renderReason = record => {
    if (!record) {
        return '未知';
    }
    const {refreshReason} = record;
    return asRefreshReasonString(refreshReason);
};

const renderSku = record => {
    if (!record) {
        return '未知';
    }
    const {skuName, skuApw, skuTolerance} = record;
    return `${skuName}/${skuApw} g/${skuTolerance} g`;
};

class StationSlotState extends Component {
    constructor(props) {
        super(props);
        this.state = {
            station: {},
            records: [],
        };
    }

    componentDidMount() {
        const {id} = this.props.match.params;
        this.stationId = id;
        fetchStationById(id).then(res => {
            this.setState({
                station: res,
            });
            this.props.storeOperations.setTitle(`站点【${res.name}】货道数据看板`, res.sn);
        });
        this.refreshSlotState();
    }

    refreshSlotState() {
        fetchLastRecordsByStation(this.stationId).then(res => {
            const records = [];
            for (const record of res) {
                record.key = record.slot.id;
                records.push(record);
            }
            this.setState({
                records: records
            });
        });
    }

    render() {
        const {records} = this.state;
        console.log(records);
        return (
            <div className="station-slot-state">
                <Space className="btn-group">
                    <Button icon={<ReloadOutlined/>} type="primary"
                            onClick={() => this.refreshSlotState()}>刷新数据</Button>
                    <Button icon={<ClearOutlined/>} type="primary">清除数据</Button>
                    <Button icon={<CloudDownloadOutlined/>} type="primary"
                            onClick={() => message.warn('开发中')}>强制采集</Button>
                </Space>
                <Table dataSource={records} className="record-table">
                    <Table.Column title="刷新时间" dataIndex="lastData" render={v => v ? v.createTime : '未上报'}/>
                    <Table.Column title="货道号" dataIndex="slot" render={v => v && v.slotNo}/>
                    <Table.Column title="货道地址" dataIndex="slot" render={v => v && v.originAddress}/>
                    <Table.Column title="重量" dataIndex="lastData" render={renderWeight}/>
                    <Table.Column title="误差" dataIndex="lastData" render={renderDifference}/>
                    <Table.Column title="SKU" dataIndex="lastData" render={renderSku}/>
                    <Table.Column title="货道状态" dataIndex="lastData" render={renderSlotState}/>
                    <Table.Column title="刷新原因" dataIndex="lastData" render={renderReason}/>
                </Table>
            </div>
        );
    }
}

export default mapStateAndActions(StationSlotState);
