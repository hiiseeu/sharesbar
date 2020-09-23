import React from 'react'
import './SubContent.css'
import 'antd/dist/antd.css'
import axios from "axios"
import { Layout, Tabs, Input, AutoComplete, Row, Col } from 'antd'
import { UserOutlined, BgColorsOutlined } from '@ant-design/icons'
import StockSetting from './StockSetting'
import ThemeSetting from './ThemeSetting'

const { TabPane } = Tabs
const { Content } = Layout

// 设置页
class SubContent extends React.Component {
    constructor() {
        super()
        this.state = {
            current: 'stock', // 选中的菜单项
            options: [], //搜索框下拉展示列表
            data: [] //自选股列表数据
        };
        this.handleClick = this.handleClick.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.setStateData = this.setStateData.bind(this)
    }

    componentDidMount() {
        const stockStr = localStorage.getItem("mystock")
        if (stockStr) {
            const mystocklist = stockStr.split('=')
            if (!mystocklist[0]) {
                mystocklist.shift()
            }
            let stocklist = []
            mystocklist.forEach((row, index) => {
                if (!row) {
                    return;
                }
                row = JSON.parse(row)
                stocklist.push(row)
            })
            this.setState({
                data: stocklist
            })
        }
    }

    // 设置页菜单切换
    handleClick(event) {
        this.setState({
            current: event.key
        })
    }

    // 自选股列表模板
    renderItem(name, stockNum, stockType, value) {
        return {
            value: name,
            label: (
                <Row style={{ fontSize: '10px' }}>
                    <Col span={12}>{name}</Col>
                    <Col span={8}>{stockNum}</Col>
                    <Col span={4}>{stockType}</Col>
                    <Col hidden>{value}</Col>
                </Row>
            )
        }
    }

    // 子组件设置state方法
    setStateData(data) {
        this.setState({
            data: data
        })
    }

    // 选择自选股点击事件
    onSelect(value, option) {
        const stockStr = localStorage.getItem("mystock");
        value = JSON.parse(option.props.label.props.children[3].props.children) // 获取隐藏参数
        let arrData
        let stateData = []
        let noTag = true
        if (stockStr) {
            arrData = stockStr.split("=")
            if (!arrData[0]) {
                arrData.shift(); //删除头部空数组
            }
            arrData.forEach((row, index) => {
                row = JSON.parse(row)
                if (typeof row === 'string') {
                    row = JSON.parse(row)
                }
                if (row.stockNum === value.stockNum) {
                    noTag = false
                }
                stateData.push(row)
            })
        } else {
            arrData = new Array(1);
        }
        if (noTag) {
            arrData.push(JSON.stringify(value))
            localStorage.setItem("mystock", arrData.join("="))
            localStorage.setItem('stockTime', JSON.stringify(true)) // 当设置页自选股有增删时，同步一下数据
            stateData.push(value)
        }
        this.setState({
            data: stateData
        })
    }

    handleSearch(value) {
        axios({
            method: 'get',
            url: 'https://suggest3.sinajs.cn/suggest/type=&key=' + value,
            withCredentials: true,
        }).then((response) => {
            if (response.status === 200) {
                const list = response.data.split(';')
                list.pop(); // 删除最后一个空数组
                this.setState(() => {
                    const curOpts = []
                    list.forEach((row, index, array) => {
                        if (row.indexOf('=') !== -1) {
                            row = row.split('=')[1]
                        }
                        if (row) {
                            const listArr = row.split(',')
                            const name = listArr[4]
                            const stockNum = listArr[3]
                            let stockType
                            if (listArr[3].length > 2) {
                                stockType = listArr[3].substring(0, 2)
                            }
                            const stock = {
                                name: name,
                                stockNum: stockNum,
                                stockType: stockType
                            }
                            const optRow = this.renderItem(name, stockNum, stockType, JSON.stringify(stock))
                            curOpts.push(optRow)
                        }
                    })
                    return { options: curOpts }
                })
            }
        })
    }

    render() {
        return (
            <>
                <Content className='setting' >
                    <Tabs defaultActiveKey="1" onChange={this.handleClick}>
                        <TabPane tab={<span><UserOutlined />自选股</span>} key="2">
                            <div>
                                <AutoComplete
                                    dropdownMatchSelectWidth={80}
                                    style={{ width: '240px', lineHeight: '20px' }}
                                    options={this.state.options}
                                    dropdownClassName='dropdownStyle'
                                    onSelect={this.onSelect}
                                    onChange={this.onChange}
                                >
                                    <Input.Search size="small" placeholder="搜索自选股" enterButton onSearch={this.handleSearch} ref={input => this.SearchInput = input} />
                                </AutoComplete>
                            </div>
                            <div>
                                <StockSetting data={this.state.data} setStateData={this.setStateData} />
                            </div>
                        </TabPane>
                        <TabPane tab={<span><BgColorsOutlined />主题设置</span>} key="3">
                            <ThemeSetting />
                        </TabPane>
                    </Tabs>
                </Content>
            </>
        );
    }
}

export default SubContent;
