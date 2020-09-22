import React from 'react'
import './SubContent.css'
import 'antd/dist/antd.css'
import axios from "axios"
import { Layout, Tabs, Input, AutoComplete, Row, Col, Divider, List, Avatar, Empty, Button, Tag, Modal } from 'antd'
import { UserOutlined, BgColorsOutlined, SlidersOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const { TabPane } = Tabs
const { Content } = Layout
const { confirm } = Modal;

// 设置页
class SubContent extends React.Component {
    constructor() {
        super()
        this.state = {
            current: 'stock',
            options: [],
            data: []
        };
        this.handleClick = this.handleClick.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.onSelect = this.onSelect.bind(this)
        this.handleDelClick = this.handleDelClick.bind(this)
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

    handleDelClick(event) {
        const that = this;
        const stockStr = localStorage.getItem('mystock'); // 自选股列表
        const stockListStr = localStorage.getItem('stockList'); // 主页自选股展示列表
        const curStock = event.currentTarget.value
        let preMystock // 缓存里自选股
        let stateData = [] // 自选股列表 展示数据
        let storageStockData = [] // mystock 存储数据
        let stockName // 删除确认框股票名称
        // 遍历自选股列表，删除选中自选股
        if (stockStr) {
            preMystock = stockStr.split("=")
            if (!preMystock[0]) {
                preMystock.shift(); //删除头部空数组
            }
            preMystock.forEach((row, index) => {
                row = JSON.parse(row)
                if (typeof row === 'string') {
                    row = JSON.parse(row)
                }
                if (row.stockNum !== curStock) {
                    storageStockData.push(JSON.stringify(row))
                    stateData.push(row)
                } else {
                    stockName = row.name
                }
            })
        }

        // 遍历主页自选股列表，删除选中自选股展示数据
        let preStockList // 缓存主页自选股展示列表
        let storageStockListData = [] // mystock 存储数据
        let stockNum //要删除主页自选股图表的自选股
        if (stockListStr) {
            preStockList = JSON.parse(stockListStr)
            if (!preStockList[0]) {
                preStockList.shift(); //删除头部空数组
            }
            preStockList.forEach((row, index) => {
                if (row.stockNum !== curStock.substring(2)) {
                    storageStockListData.push(row)
                } else {
                    stockNum = row.stockNum
                }
            })
        }

        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <span>确认删除[<span style={{ color: 'red' }}>{stockName}</span>]吗？</span>,
            okText: "删除",
            cancelText: "取消",
            onOk() {
                localStorage.removeItem('mystock') // 删除自选股列表
                localStorage.removeItem('stockList') // 删除主页自选股展示数据
                localStorage.removeItem(stockNum) // 删除主页自选股图表数据
                if (storageStockData.length > 0) {
                    localStorage.setItem('mystock', storageStockData.join("="))
                    localStorage.setItem('stockList', storageStockListData.join("="))
                }
                localStorage.setItem('stockTime', JSON.stringify(true)) // 当设置页自选股有增删时，同步一下数据
                that.setState({
                    data: stateData
                })
            },
            onCancel() { },
        });

    }

    handleClick(event) {
        this.setState({
            current: event.key
        })
    }

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

    onSelect(value,option) {
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
                                <Divider dashed orientation="left" />
                                <List
                                    style={{ marginTop: '-20px' }}
                                    itemLayout="horizontal"
                                    dataSource={this.state.data}
                                    locale={<Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description={false} />}
                                    renderItem={item => (
                                        <List.Item style={{ height: '50px', lineHeight: '20px' }}>
                                            <List.Item.Meta
                                                style={{ height: '30px' }}
                                                avatar={<Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>{item.name}</Avatar>}
                                                description={<div>
                                                    <Row style={{ margin: '-5px 0px', color: '#000' }}>{item.name}</Row>
                                                    <Tag icon={<SlidersOutlined />} color="#55acee" style={{ height: '15px', fontSize: '8px', lineHeight: '15px', marginLeft: '-80px' }}>{item.stockNum}</Tag>
                                                    <Button size='small' type='text' danger style={{ float: 'right', fontSize: '12px', margin: '0' }} onClick={this.handleDelClick} value={item.stockNum}>删除</Button>
                                                </div>}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </TabPane>
                        <TabPane tab={<span><BgColorsOutlined />主题设置</span>} key="3">
                            主题设置
                            主题设置
                    </TabPane>
                    </Tabs>
                </Content>
            </>
        );
    }
}

export default SubContent;
