import React, {Component} from 'react';
import {mapStateAndActions} from '../../store/storeUtils';
import {createSlot, fetchSlotsByStation, setElabelState, setSku} from '../../api/slot';
import {Button, Form, Input, InputNumber, message, Modal, Select, Switch, Table} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import './StationSlots.less';
import {SlotTypeOffsetTable} from '../../context/metaData';
import SkuSelectModal from '../commons/SkuSelectModal';
import {fetchStationById} from '../../api/station';

const PAGE_ROWS = 20;

class StationSlots extends Component {
    constructor(props) {
        super(props);
        this.state = {
            station: {},
            slots: [],
            pageNum: 1,
            pageRows: PAGE_ROWS,
            totalRows: 0,
            createModalVisible: false,
            skuSelectModalVisible: false,
            skuSelectSlot: {},
        };
    }

    componentDidMount() {
        this.props.storeOperations.setTitle('站点货道管理', '货道管理');
        const {id} = this.props.match.params;
        this.stationId = id;
        this.refreshSlots(1, PAGE_ROWS);
        this.refreshStation();
    }

    refreshStation() {
        fetchStationById(this.stationId).then(res => {
            this.setState({station: res});
            this.props.storeOperations.setTitle(`站点${res.name}货道管理`, `站点序列号:${res.sn}`);
        });
    }

    refreshSlots(page, rows) {
        fetchSlotsByStation(this.stationId, page, rows).then(res => {
            const {list, pageNum, total, pageSize} = res;
            for (let slot of list) {
                slot.key = slot.id;
            }
            this.setState({
                slots: list,
                pageNum,
                pageRows: pageSize,
                totalRows: total,
            });
        });
    }

    showCreateModal(show) {
        this.setState({createModalVisible: show});
    }

    createSlot(data) {
        data.stationId = this.stationId;
        data.type = data.typeOffset + data.typeValue;
        const {
            pageNum,
            pageRows
        } = this.state;
        createSlot(data).then(res => {
            const {slotNo} = res;
            message.success(`货道[${slotNo}]创建成功！`);
            this.refreshSlots(pageNum, pageRows);
            this.showCreateModal(false);
        });
    }

    showSkuSelectModal(show, slot) {
        this.setState({
            skuSelectSlot: slot,
            skuSelectModalVisible: show,
        });
    }

    renderTableOperations(data) {
        return (<>
            <Button type="link">状态</Button>
            <Button type="link" onClick={() => this.showSkuSelectModal(true, data)}>物料</Button>
            <Button type="link">修改</Button>
        </>);
    }

    setElabelEnable(slot, state) {
        const {pageNum, pageRows} = this.state;
        setElabelState(slot.id, state).then(res => {
            message.success(`货道[${res.slotNo}]电子标签状态已更新！`);
            this.refreshSlots(pageNum, pageRows);
        });
    }

    renderElabelSwitch(enable, item) {
        return (<Switch checked={enable}
                        onChange={state => this.setElabelEnable(item, state)}/>);
    }

    setSku(sku) {
        const {skuSelectSlot, pageNum, pageRows} = this.state;
        setSku(skuSelectSlot.id, sku.id).then(res => {
            message.success(`货道[${res.slotNo}]物料已更新`);
            this.showSkuSelectModal(false, {});
            this.refreshSlots(pageNum, pageRows);
        });
    }

    render() {
        const {slots, pageNum, totalRows, pageRows, createModalVisible, skuSelectModalVisible, skuSelectSlot, station} = this.state;
        return (
            <div className="slots">
                <div className="btns">
                    <Button icon={<PlusOutlined/>} type="primary" onClick={() => this.showCreateModal(true)}/>
                </div>
                <Table dataSource={slots} pagination={{
                    current: pageNum,
                    total: totalRows,
                    position: 'bottom',
                    pageSize: pageRows,
                    onChange: (page, rows) => this.refreshSlots(page, rows)
                }}>
                    <Table.Column dataIndex="id" title="#" key="id"/>
                    <Table.Column dataIndex="slotNo" title="货道号" key="slotNo"/>
                    <Table.Column dataIndex="originAddress" title="物理地址" key="originAddress"/>
                    <Table.Column dataIndex="type" title="类型" key="type"/>
                    <Table.Column dataIndex="elabelEnabled" title="电子标签" key="elabelEnabled"
                                  render={(value, item) => this.renderElabelSwitch(value, item)}/>
                    <Table.Column dataIndex="sku" title="物料" key="sku"
                                  render={sku => sku ? `${sku.name}/${sku.sn}` : '未绑定'}/>
                    <Table.Column title="操作" key="operations" render={data => this.renderTableOperations(data)}/>
                </Table>
                <Modal title="创建货道"
                       visible={createModalVisible}
                       maskClosable={false}
                       okText="创建"
                       cancelText="取消"
                       onCancel={() => this.showCreateModal(false)}
                       onOk={() => this.createForm && this.createForm.submit()}>
                    <Form ref={form => this.createForm = form} onFinish={data => this.createSlot(data)}>
                        <Form.Item label="货道号" name="slotNo" rules={[{required: true, message: '请输入货道号'}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="物理地址" name="originAddress" rules={[{required: true, message: '请输入物理地址'}]}>
                            <InputNumber/>
                        </Form.Item>
                        <Form.Item label="电子标签"
                                   name="elabelEnabled"
                                   valuePropName="checked"
                                   rules={[{required: true, message: '请选择电子标签状态'}]}>
                            <Switch/>
                        </Form.Item>
                        <Form.Item label="类型" name="typeOffset" rules={[{required: true, message: '请选择货道类型'}]}>
                            <Select>
                                {
                                    SlotTypeOffsetTable.map(item =>
                                        (<Select.Option key={item.offset}
                                                        value={item.offset}>
                                            {item.name}
                                        </Select.Option>))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="类型代码" name="typeValue" rules={[{required: true, message: '请输入类型代码'}]}>
                            <InputNumber min={0} max={9}/>
                        </Form.Item>
                    </Form>
                </Modal>
                <SkuSelectModal visible={skuSelectModalVisible}
                                slot={skuSelectSlot}
                                onCancel={() => this.showSkuSelectModal(false, {})}
                                onOk={data => this.setSku(data)}
                                sceneId={station.sceneId || 0}/>
            </div>
        );
    }
}

export default mapStateAndActions(StationSlots);
