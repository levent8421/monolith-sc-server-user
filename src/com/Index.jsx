import React, {Component} from 'react';
import {mapStateAndActions} from '../store/storeUtils';
import {fetchMe} from '../api/user';
import {Avatar, Layout, Menu, PageHeader} from 'antd';
import {
    AppstoreAddOutlined,
    ArrowLeftOutlined,
    ClusterOutlined,
    LineChartOutlined,
    SmileOutlined,
    UserOutlined
} from '@ant-design/icons';
import './Index.less';
import Logo from '../img/logo_green.png';
import {routers} from '../router/contentRouters';
import {renderRoutes} from 'react-router-config';

const {Header, Footer, Content, Sider} = Layout;

const MenuPathTable = {
    'statistics': '/',
    'scene': '/scenes',
    'station-scan': '/station-scan',
    'user': '/user',
};

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const {me, webToken} = this.props.storeState;
        const {history} = this.props;
        if (!webToken) {
            history.replace({pathname: '/login'});
            return;
        }
        if (!me) {
            fetchMe().then(res => {
                this.props.storeOperations.setToken(webToken, res);
            });
        }
    }

    onMenuSelected(item) {
        const {key} = item;
        if (MenuPathTable.hasOwnProperty(key)) {
            const pathname = MenuPathTable[key];
            this.props.history.push({pathname});
        }
    }

    render() {
        const me = this.props.storeState.me || {};
        const {title} = this.props.storeState;
        return (
            <Layout className="index">
                <Header className="header">
                    <div className="banner">
                        <img src={Logo} alt="BerronTech"/>
                    </div>
                    <div className="avatar">
                        <span className="uname">{me.username}</span>
                        <Avatar><SmileOutlined/></Avatar>
                    </div>
                </Header>
                <Layout>
                    <Sider className="sider">
                        <Menu defaultSelectedKeys={['']}
                              defaultOpenKeys={['']}
                              mode="inline"
                              theme="dark"
                              className="menu"
                              onSelect={item => this.onMenuSelected(item)}>
                            <Menu.Item key="statistics" icon={<LineChartOutlined/>}>
                                统计分析
                            </Menu.Item>
                            <Menu.Item key="scene" icon={<AppstoreAddOutlined/>}>
                                场景管理
                            </Menu.Item>
                            <Menu.Item key="station-scan" icon={<ClusterOutlined/>}>
                                站点扫描
                            </Menu.Item>
                            <Menu.Item key="user" icon={<UserOutlined/>}>
                                信息维护
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Content>
                        <PageHeader
                            title={title.mainTitle}
                            subTitle={title.subTitle}
                            backIcon={<ArrowLeftOutlined/>}
                            onBack={() => this.props.history.goBack()}/>
                        <div className="content-wrapper">
                            {renderRoutes(routers)}
                        </div>
                    </Content>
                </Layout>
                <Footer>
                    <div>Copyright &copy; BerronTech.com</div>
                </Footer>
            </Layout>
        );
    }
}

export default mapStateAndActions(Index);
