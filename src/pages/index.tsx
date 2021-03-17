import React from 'react';
import { Menu, Button } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DesktopOutlined,
  ContainerOutlined,
} from '@ant-design/icons';
import {history} from 'umi';

history.push('/front1/A');

export default class App extends React.Component {
  state = {
    collapsed: false,
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <div style={{display: 'flex', justifyContent: 'flex-start'}}>
        <div style={{ width: 256 }}>
          <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
            {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
          </Button>
          <Menu
            defaultSelectedKeys={['1']}
            mode="inline"
            theme="light"
            inlineCollapsed={this.state.collapsed}
          >
            <Menu.Item key="1" onClick={() => history.push('/front1/A')} icon={<DesktopOutlined />}>
              微应用 1 - A
            </Menu.Item>
            <Menu.Item key="2" onClick={() => history.push('/front1/B')} icon={<DesktopOutlined />}>
              微应用 1 - B
            </Menu.Item>
            <Menu.Item key="3" onClick={() => history.push('/front2/A')} icon={<ContainerOutlined />}>
              微应用 2 - A
            </Menu.Item>
            <Menu.Item key="4" onClick={() => history.push('/front2/B')} icon={<ContainerOutlined />}>
              微应用 2 - B
            </Menu.Item>
          </Menu>
        </div>
        <div style={{margin: 30}}>
          {this.props.children}
        </div>
      </div>

    );
  }
}
