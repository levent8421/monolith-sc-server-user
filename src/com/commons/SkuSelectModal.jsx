import React, {Component} from 'react';
import {Col, List, message, Modal, Row, Tree, Typography} from 'antd/lib';
import PropTypes from 'prop-types';
import {fetchCategoriesByScene} from '../../api/skuCategory';
import {fetchSkuByCategory} from '../../api/sku';
import {addCategoryKey} from '../../util/converter';
import './SkuSelectModal.less';
import {BorderOutlined, CheckCircleFilled} from '@ant-design/icons';

const {Text, Link} = Typography;
const PAGE_ROWS = 20;

class SkuSelectModal extends Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        slot: PropTypes.object.isRequired,
        onCancel: PropTypes.func.isRequired,
        onOk: PropTypes.func.isRequired,
        sceneId: PropTypes.number.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            skuList: [],
            pageNum: 1,
            pageSize: PAGE_ROWS,
            skuTotal: 0,
            selectedCategory: {},
            selectedSku: {},
        };
    }

    componentDidMount() {
        this.sceneId = 0;
    }

    fetchCategories() {
        fetchCategoriesByScene(this.sceneId).then(res => {
            for (let category of res) {
                addCategoryKey(category);
            }
            this.setState({categories: res});
        });
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const {sceneId} = nextProps;
        if (sceneId === this.sceneId) {
            return true;
        }
        this.sceneId = sceneId;
        this.fetchCategories();
        return true;
    }

    refreshSku(category, page, size) {
        fetchSkuByCategory(category.id, page, size).then(res => {
            const {pageNum, pageSize, total, list} = res;
            for (let sku of list) {
                sku.selected = false;
            }
            this.setState({
                selectedCategory: category,
                pageNum: pageNum,
                pageSize: pageSize,
                skuTotal: total,
                skuList: list,
            });
        });
    }

    onSkuSelected(item) {
        const {id} = item;
        const {skuList} = this.state;
        for (let sku of skuList) {
            sku.selected = sku.id === id;
        }
        this.setState({selectedSku: item, skuList: skuList})
    }

    renderSkuItem(item) {
        return (<List.Item onClick={() => this.onSkuSelected(item)}>
            <Text>
                <Text>
                    {item.selected ? <CheckCircleFilled/> : <BorderOutlined/>}
                </Text>
                <Link>{item.name}</Link>
            </Text>
        </List.Item>)
    }

    onOk() {
        const {skuList} = this.state;
        for (let sku of skuList) {
            if (sku.selected) {
                this.props.onOk(sku);
                return;
            }
        }
        message.warn('请选择物料');
    }

    render() {
        const {categories, pageNum, pageSize, skuTotal, selectedCategory, skuList, selectedSku} = this.state;
        const title = `货道[${this.props.slot.slotNo}]物料选择:${selectedSku.name || '未选择物料'}`;
        return (
            <Modal className="sku-select-modal"
                   title={title}
                   visible={this.props.visible}
                   onCancel={() => this.props.onCancel()}
                   maskClosable={false}
                   okText='确认选择'
                   cancelText="取消选择"
                   onOk={() => this.onOk()}>
                <Row>
                    <Col span={8}>
                        <Tree treeData={categories} onSelect={(_, e) => this.refreshSku(e.node, 1, PAGE_ROWS)}/>
                    </Col>
                    <Col span={16} className="sku-list-wrapper">
                        <div className="sku-list">
                            <List header={`物料列表：${selectedCategory.name || '未选择分类'}`}
                                  dataSource={skuList}
                                  renderItem={item => this.renderSkuItem(item)}
                                  pagination={{
                                      current: pageNum,
                                      total: skuTotal,
                                      pageSize: pageSize,
                                      onChange: (page, size) => this.refreshSku(selectedCategory, page, size)
                                  }}
                            />
                        </div>
                    </Col>
                </Row>
            </Modal>
        );
    }
}

export default SkuSelectModal;
