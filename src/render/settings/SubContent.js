import React from 'react'
import './Settings.css'
import 'antd/dist/antd.css'
import { Layout, Menu } from 'antd'
import { HomeOutlined, UserOutlined, BgColorsOutlined } from '@ant-design/icons'

const { Content } = Layout
class SubContent extends React.Component {
    constructor() {
        super()
        this.state = {
            current: 'stock'
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        console.log(event);
        this.setState({
            current: event.key
        })
    }

    render() {
        const menuStyle = {
            margin: '0 5px'
        }
        return (
            <>
                <Content style={{ textAlign: 'left' }}>
                    <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal" style={{ margin: '0 5px' }}>
                        <Menu.Item key="home" style={menuStyle}><HomeOutlined />主页
                         </Menu.Item>
                        <Menu.Item key="stock" style={menuStyle}><UserOutlined />
                            自选股
                        </Menu.Item>
                        <Menu.Item key="theme" style={menuStyle}><BgColorsOutlined />
                            主题设置
                        </Menu.Item>
                    </Menu>
                    <div >
                    </div>
                </Content>
            </>
        );
    }
}

export default SubContent;
