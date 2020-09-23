import React from 'react'
import 'antd/dist/antd.css'
import { Row, Divider, List, Avatar, Empty, Button, Tag, Modal } from 'antd'
import { SlidersOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal;

// 设置页
class StockSetting extends React.Component {
    constructor() {
        super()
        this.handleDelClick = this.handleDelClick.bind(this)
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

    render() {
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
            </>
        );
    }
}

export default StockSetting;
