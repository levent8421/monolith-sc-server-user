import React, {Component} from 'react';
import {mapStateAndActions} from '../store/storeUtils';
import {BG_PRIMARY, BG_SUCCESS, BG_WARN} from '../context/colors';
import './Statistics.less';
import {Col, Row, Timeline} from 'antd';

class Statistics extends Component {
    componentDidMount() {
        this.props.storeOperations.setTitle("统计分析", "数据统计页面");
    }

    render() {
        return (
            <div className="statistics">
                <div className="header-blocks">
                    <div className="block" style={{background: BG_PRIMARY}}>
                        <div className="name">场景</div>
                        <div className="value">3</div>
                    </div>
                    <div className="block" style={{background: BG_PRIMARY}}>
                        <div className="name">站点</div>
                        <div className="value">10</div>
                    </div>
                    <div className="block" style={{background: BG_SUCCESS}}>
                        <div className="name">在线</div>
                        <div className="value">9</div>
                    </div>
                    <div className="block" style={{background: BG_WARN}}>
                        <div className="name">离线</div>
                        <div className="value">1</div>
                    </div>
                </div>
                <div className="tasks">
                    <Row>
                        <Col span={12}>
                            <h2>事件报告</h2>
                            <Timeline>
                                <Timeline.Item>创建服务现场 2015-09-01</Timeline.Item>
                                <Timeline.Item>初步排除网络异常 2015-09-01</Timeline.Item>
                                <Timeline.Item>技术测试异常 2015-09-01</Timeline.Item>
                                <Timeline.Item>网络异常正在修复 2015-09-01</Timeline.Item>
                            </Timeline>
                        </Col>
                        <Col span={12}>
                            <h2>操作记录</h2>
                            <Timeline>
                                <Timeline.Item>创建服务现场 2015-09-01</Timeline.Item>
                                <Timeline.Item>初步排除网络异常 2015-09-01</Timeline.Item>
                                <Timeline.Item>技术测试异常 2015-09-01</Timeline.Item>
                                <Timeline.Item>网络异常正在修复 2015-09-01</Timeline.Item>
                            </Timeline>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default mapStateAndActions(Statistics);
