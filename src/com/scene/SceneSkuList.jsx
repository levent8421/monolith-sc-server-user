import React, {Component} from 'react';
import {mapStateAndActions} from '../../store/storeUtils';
import {createCategory, fetchCategoriesByScene, fetchTopLevelCategoriesByScene} from '../../api/skuCategory';
import {Button, Col, Form, Input, InputNumber, message, Modal, Row, Select, Table, Tree} from 'antd';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import './SceneSkuList.less';
import {createSku, fetchSkuByCategory} from "../../api/sku";
import {addCategoryKey} from '../../util/converter';

const PAGE_ROWS = 20;

class SceneSkuList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            categoryAddModalVisible: false,
            topLevelCategories: [],
            selectedCategory: {},
            skuPage: 1,
            skuRows: PAGE_ROWS,
            skuList: [],
            skuTotal: 0,
            skuCreateModalVisible: false,
        };
    }

    componentDidMount() {
        this.props.storeOperations.setTitle('场景物料管理', '物料管理');
        const {id} = this.props.match.params;
        this.sceneId = id;
        this.refreshCategories();
    }

    refreshCategories() {
        fetchCategoriesByScene(this.sceneId).then(res => {
            this.setCategories(res);
        });
    }

    refreshSku(category, page, rows = PAGE_ROWS) {
        this.setState({
            selectedCategory: category,
            skuPage: page,
            skuRows: rows,
        });
        fetchSkuByCategory(category.id, page, rows).then(res => {
            const {list, pageNum, pageSize, total} = res;
            this.setState({skuList: list, skuPage: pageNum, skuRows: pageSize, skuTotal: total});
        });
    }

    setCategories(categories) {
        for (let c of categories) {
            addCategoryKey(c);
        }
        this.setState({categories});
    }

    createCategory(data) {
        data.sceneId = this.sceneId;
        createCategory(data).then(res => {
            message.success(`分类[${res.name}]创建成功`);
            this.refreshCategories();
            this.showCategoryAddModal(false);
        });
    }

    showCreateSkuModal(show) {
        if (!this.state.selectedCategory.id) {
            message.warn('请选择物料分类！');
            return;
        }
        this.setState({
            skuCreateModalVisible: show,
        });
    }

    createSku(data) {
        data.categoryId = this.state.selectedCategory.id;
        data.sceneId = this.sceneId;
        createSku(data).then(res => {
            const {selectedCategory, skuPage, skuRows} = this.state;
            this.refreshSku(selectedCategory, skuPage, skuRows);
            message.success(`物料[${res.name}]创建成功`);
            this.showCreateSkuModal(false);
        });
    }

    renderSkuTableOperations(item) {
        return (<>
            <Button type="link">修改</Button>
        </>);
    }

    render() {
        const {
            categoryAddModalVisible,
            topLevelCategories,
            categories,
            skuPage,
            skuRows,
            skuList,
            skuTotal,
            skuCreateModalVisible,
            selectedCategory
        } = this.state;
        return (
            <div className="sku-list">
                <Row>
                    <Col span={4}>
                        <div className="btns">
                            <Button icon={<PlusOutlined/>} type="primary"
                                    onClick={() => this.showCategoryAddModal(true)}/>
                            <Button icon={<DeleteOutlined/>} type="danger"/>
                            <Button icon={<EditOutlined/>} type="default"/>
                        </div>
                        <Tree className="category-tree"
                              treeData={categories}
                              onSelect={(_, e) => this.refreshSku(e.node, 1, PAGE_ROWS)}/>
                    </Col>
                    <Col span={20} className="sku-wrapper">
                        <h2>物料列表:[{selectedCategory.name || '未选择'}]</h2>
                        <div className="btns">
                            <Button icon={<PlusOutlined/>} type="primary"
                                    onClick={() => this.showCreateSkuModal(true)}/>
                        </div>
                        <Table className="sku-table"
                               pagination={{
                                   position: 'bottom',
                                   current: skuPage,
                                   pageSize: skuRows,
                                   total: skuTotal,
                                   onChange: (page, rows) => {
                                       this.refreshSku(selectedCategory, page, rows);
                                   }
                               }}
                               dataSource={skuList}>
                            <Table.Column key="id" title="#" dataIndex="id"/>
                            <Table.Column key="name" title="物料名称" dataIndex="name"/>
                            <Table.Column key="sn" title="物料号" dataIndex="sn"/>
                            <Table.Column key="apw" title="单重" dataIndex="apw"/>
                            <Table.Column key="tolerance" title="允差" dataIndex="tolerance"/>
                            <Table.Column key="operations" title="操作"
                                          render={item => this.renderSkuTableOperations(item)}/>
                        </Table>
                    </Col>
                </Row>
                <Modal title="新增物料分类"
                       visible={categoryAddModalVisible}
                       cancelText="取消"
                       okText="新增"
                       onCancel={() => this.showCategoryAddModal(false)}
                       onOk={() => this.categoryAddForm && this.categoryAddForm.submit()}>
                    <Form ref={form => this.categoryAddForm = form} onFinish={data => this.createCategory(data)}>
                        <Form.Item label="父分类" name="parentId">
                            <Select>
                                {
                                    topLevelCategories.map(c => (
                                        <Select.Option value={c.id} key={c.id}>{c.name}</Select.Option>))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="名称" name="name" rules={[{required: true, message: '请输入分类名称'}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="描述" name="description">
                            <Input.TextArea/>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title="创建物料"
                       visible={skuCreateModalVisible}
                       okText="创建"
                       cancelText="取消"
                       onCancel={() => this.showCreateSkuModal(false)}
                       onOk={() => this.skuCreateForm && this.skuCreateForm.submit()}
                       maskClosable={false}>
                    <Form ref={form => this.skuCreateForm = form} onFinish={data => this.createSku(data)}>
                        <Form.Item label="名称" name="name" rules={[{required: true, message: '请输入物料名称'}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="物料号" name="sn" rules={[{required: true, message: '请输入物料号'}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="单重" name="apw" rules={[{required: true, message: '请输入物料单重'}]}>
                            <InputNumber precision={2}/>
                        </Form.Item>
                        <Form.Item label="允差" name="tolerance" rules={[{required: true, message: '请输入物料允差'}]}>
                            <InputNumber precision={2}/>
                        </Form.Item>
                        <Form.Item label="开封保质期" name="shelfDays">
                            <InputNumber precision={2}/>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }

    refreshTopLevelCategories() {
        fetchTopLevelCategoriesByScene(this.sceneId).then(res => {
            this.setState({
                topLevelCategories: res,
            });
        });
    }

    showCategoryAddModal(show) {
        if (show) {
            this.refreshTopLevelCategories();
        }
        this.setState({
            categoryAddModalVisible: show
        });
    }
}

export default mapStateAndActions(SceneSkuList);
