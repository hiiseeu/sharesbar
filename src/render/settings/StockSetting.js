import React from 'react'
import 'antd/dist/antd.css'
import {
    Row, Col, Divider, List, Avatar, Empty, Button, Tag,
    Modal, Drawer, Form, InputNumber, Popconfirm, message
} from 'antd'
import { SlidersOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal;

// 设置页
class StockSetting extends React.Component {
    constructor() {
        super()
        this.state = {
            childrenDrawer: false,
            currentTarget: {}
        }
        this.handleDelClick = this.handleDelClick.bind(this)
        this.showChildrenDrawer = this.showChildrenDrawer.bind(this)
        this.onChildrenDrawerClose = this.onChildrenDrawerClose.bind(this)
        this.onFinish = this.onFinish.bind(this)
    }

    // 删除自选股点击事件
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
                that.props.setStateData(stateData);
            },
            onCancel() { },
        });

    }

    showChildrenDrawer = (event) => {
        this.setState({
            childrenDrawer: true,
            currentTarget: JSON.parse(event.currentTarget.getAttribute("item"))
        })
    }

    onChildrenDrawerClose = () => {
        this.setState({
            childrenDrawer: false,
        })
    }

    onFinish = (value) => {
        console.log(this.state.currentTarget);
        const stockStr = localStorage.getItem("mystock");
        let arrData
        let stateData = []
        let stockData = []
        let noTag = false
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
                if (row.stockNum === this.state.currentTarget.stockNum) {
                    noTag = true
                    row.shareholdingDetails = {
                        numOfSshares: value.numOfSshares,
                        stockCost: value.stockCost
                    }
                }
                stateData.push(row)
                stockData.push(JSON.stringify(row))
            })
        } else {
            arrData = new Array(1);
        }
        if (noTag) {
            localStorage.setItem("mystock", stockData.join("="))
            this.props.setStateData(stateData)
            message.success('添加成功！');
            this.onChildrenDrawerClose()
        }
    }

    delShareholdingDetails = (e) => {
        let details = document.getElementById("shareholdingDetails");
        let item = details.getAttribute('itemdddd');
        item = JSON.parse(item);
        const stockStr = localStorage.getItem("mystock");
        let arrData
        let stateData = []
        let stockData = []
        let noTag = false
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
                if (row.stockNum === item.stockNum) {
                    noTag = true
                    row.shareholdingDetails = {}
                }
                stateData.push(row)
                stockData.push(JSON.stringify(row))
            })
        } else {
            arrData = new Array(1);
        }
        if (noTag) {
            localStorage.setItem("mystock", stockData.join("="))
            this.props.setStateData(stateData);
        }
    }

    render() {

        const layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };

        return (
            <>
                <div>
                    <Divider dashed orientation="left" />
                    <List
                        style={{ marginTop: '-20px', overflowY: 'auto !important' }}
                        itemLayout="horizontal"
                        dataSource={this.props.data}
                        locale={<Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description={false} />}
                        renderItem={item => (
                            <List.Item style={{ height: '50px', lineHeight: '20px' }}>
                                <List.Item.Meta
                                    style={{ height: '30px' }}
                                    avatar={<Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' }} item={JSON.stringify(item)} onClick={this.showChildrenDrawer}>{item.name}</Avatar>}
                                    description={<div>
                                        <Row style={{ margin: '-5px 0px', color: '#000' }}>
                                            <Col span={11} style={{ textAlign: "left" }}>{item.name}</Col>
                                            <Popconfirm title="要删除持股信息吗？" okText="删除" cancelText="不删"
                                                onConfirm={this.delShareholdingDetails}>
                                                <Col span={5}
                                                    style={{ display: !item.shareholdingDetails.stockCost && "none", textAlign: "right", right: '-5px' }}
                                                    itemdddd={item.stockNum}
                                                    id="shareholdingDetails"
                                                >
                                                    <Tag style={{ height: '15px', fontSize: '8px', lineHeight: '15px', color: '#f56a00', background: '#fde3cf', border: '0' }}>
                                                        成本：<span style={{ color: 'red' }}>{item.shareholdingDetails.stockCost}</span> 持股：<span style={{ color: 'red' }}>{item.shareholdingDetails.numOfSshares}</span></Tag>
                                                </Col>
                                            </Popconfirm>

                                        </Row>
                                        <Tag icon={<SlidersOutlined />} color="#55acee" style={{ height: '15px', fontSize: '8px', lineHeight: '15px', marginLeft: '-80px' }}>{item.stockNum}</Tag>
                                        <Button size='small' type='text' danger style={{ float: 'right', fontSize: '12px', margin: '0' }} onClick={this.handleDelClick} value={item.stockNum}>删除</Button>
                                    </div>}
                                />
                            </List.Item>
                        )}
                    />
                    <Drawer
                        width={200}
                        closable={false}
                        onClose={this.onChildrenDrawerClose}
                        visible={this.state.childrenDrawer}
                    >
                        <div>
                            <h3>{this.state.currentTarget.name}</h3>
                            <Divider orientation="right" dashed plain='true' style={{ marginTop: '-5px', color: "black", lineHeight: '2px' }} />
                            <Form
                                {...layout}
                                name="basic"
                                layout="vertical"
                                onFinish={this.onFinish}
                                // initialValues={{ curStock: this.state.currentTarget, stockCost: 0, numOfSshares: 0 }}
                                size='small'
                            >
                                <Form.Item label="成本" rules={[{ required: true, message: '请输入成本!' }]} name="stockCost">
                                    <InputNumber min={0.01} step={0.01} style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item label="持股数" rules={[{ required: true, message: '请输入持股数量!' }]} name="numOfSshares">
                                    <InputNumber min={100} step={100} style={{ width: '100%' }} />
                                </Form.Item>
                                {/* <Form.Item name="curStock" hidden ><Input /></Form.Item> */}
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">提交</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Drawer>
                </div>
            </>
        );
    }
}

export default StockSetting;
