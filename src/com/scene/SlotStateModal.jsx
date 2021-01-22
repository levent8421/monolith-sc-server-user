import React, {Component} from 'react';
import {Collapse, Modal} from 'antd';
import PropTypes from 'prop-types';
import {fetchLastRecord} from '../../api/slotDataRecord';
import './SlotStateModal.less';
import {refreshReasons} from '../../context/metaData';
import {
    asDifferenceStateString,
    asRefreshReasonString,
    asSlotStateString,
    asWeightStateString
} from '../../util/converter';

const refreshReasonCodeTable = {};
for (let reason of refreshReasons) {
    refreshReasonCodeTable[reason.reason] = reason.name;
}


const SLOT_DATA_ITEMS = [
    {
        key: 'createTime',
        title: '刷新时间',
    },
    {
        key: 'slotState',
        title: '货道状态',
        render: asSlotStateString,
    },
    {
        key: 'dataWeight',
        title: '重量',
    },
    {
        key: 'dataWeightState',
        title: '重量状态',
        render: asWeightStateString,
    },
    {
        key: 'dataPcs',
        title: '计数数量',
    },
    {
        key: 'dataDifference',
        title: '误差',
    },
    {
        key: 'dataDifferenceState',
        title: '误差状态',
        render: asDifferenceStateString,
    },
    {
        key: 'skuApw',
        title: '物料单重',
    },
    {
        key: 'skuTolerance',
        title: '物料允差',
    },
    {
        key: 'skuNo',
        title: '物料号',
    },
    {
        key: 'skuName',
        title: '物料名称',
    },
    {
        key: 'refreshReason',
        title: '刷新原因',
        render: asRefreshReasonString
    },
];

class SlotStateModal extends Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        slot: PropTypes.object.isRequired,
        onClose: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            slotId: -1,
            slotDataRecord: {},
        };
    }

    renderItem(record, metadata) {
        let value = record[metadata.key];
        if (metadata.render) {
            value = metadata.render(value);
        }
        return (<div className="data-item" key={metadata.key}>
            <p className="title"><span>{metadata.title}</span></p>
            <p className="value">{value}</p>
        </div>);
    }

    render() {
        const {visible, slot, onClose,} = this.props;
        const {slotDataRecord} = this.state;
        let title;
        if (slot.slotNo) {
            title = `货道${slot.slotNo}状态`;
        } else {
            title = '';
        }
        return (
            <Modal
                title={title}
                visible={visible}
                cancelText="取消"
                okText="确定"
                onCancel={onClose}
                onOk={onClose}
                className="slot-state-modal"
                width={800}>
                <Collapse defaultActiveKey={['state', 'data']}>
                    <Collapse.Panel header="货道状态" key="state">
                        ......
                    </Collapse.Panel>
                    <Collapse.Panel header="货道数据" key="data">
                        <div className="items-group">
                            {
                                SLOT_DATA_ITEMS.map(metadata => this.renderItem(slotDataRecord, metadata))
                            }
                        </div>
                    </Collapse.Panel>
                </Collapse>
            </Modal>
        );
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        const {slot} = nextProps;
        const nextSlotId = slot.id || -1;
        const currentSlotId = this.state.slotId;
        if (nextSlotId === currentSlotId) {
            return;
        }
        if (nextSlotId <= 0) {
            return;
        }
        fetchLastRecord(nextSlotId).then(res => {
            this.setState({
                slotId: nextSlotId,
                slot: slot,
                slotDataRecord: res,
            });
        });
    }
}

export default SlotStateModal;
