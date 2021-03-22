import './Navigation.css';
import React from "react";
import { Layout, Menu } from 'antd';
import logo from '../logo.svg';
import { Link, useLocation } from "react-router-dom";

const { Header, Content, Footer } = Layout;


const PageLayout = (props) => (
    <Layout className="layout">
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <img className="logo" src={logo} alt='Storage' />
            <Menu theme="dark" mode="horizontal" selectedKeys={[useLocation().pathname]}>
                <Menu.Item key='/'>
                    <Link to='/'>
                        Dashboard
                    </Link>
                </Menu.Item>
                <Menu.Item key='/ingest'>
                    <Link to='/ingest'>
                        Ingest
                    </Link>
                </Menu.Item>
                <Menu.Item key='/help'>
                    <Link to='/help'>
                        Help
                    </Link>
                </Menu.Item>
                <Menu.Item key='/admin' danger={true} style={{float: 'right'}}>
                    <Link to='/admin'>
                        Admin
                    </Link>
                </Menu.Item>
            </Menu>
        </Header>
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
            <div className="site-layout-content">
                {props.children}
            </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Sohl Storage Solutions</Footer>
    </Layout>
);

export default PageLayout;
