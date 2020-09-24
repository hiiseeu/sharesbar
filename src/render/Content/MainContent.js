import React from 'react'
import './MainContent.css'
import StockList from './StockList'
import StatusBar from './StatusBar'
import axios from "axios"
import stockOptions from '../options/stockOptions'
import checkStockTime from '../../utils/CheckStockTimeUtil'
import { Empty, Button, Layout, Modal } from 'antd'
import Settings from '../settings/Settings'
import { CloseCircleFilled, SettingFilled, ExclamationCircleOutlined } from '@ant-design/icons'
const { Footer, Content } = Layout
const { confirm } = Modal;

export default class MainContent extends React.Component {

    constructor() {
        super();
        this.state = {
            stockList: stockOptions
        };
        this.queryStockListData = this.queryStockListData.bind(this)
    }

    componentDidMount() {
        setInterval(() => {
            const stockTime = localStorage.getItem('stockTime') // 当设置页自选股有增删时，同步一下数据
            if (checkStockTime() || JSON.parse(stockTime)) {
                this.queryStockListData()
                setTimeout(() => {
                    localStorage.removeItem('stockTime') //更新两次就可以
                }, 6000)
            }
        }, 3000); //3秒请求一次
    }

    // 显示设置子窗口
    showDrawer = () => {
        this.Settings.showDrawer()
    }

    closeApp() {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <span>确认退出Sharebar吗？</span>,
            okText: "确认",
            cancelText: "取消",
            onOk() {
                const { ipcRenderer } = window.require("electron")
                // const {ipcRenderer} = electron;
                console.log(ipcRenderer)
                ipcRenderer.send('closeApp')
            },
            onCancel() { },
        });
    }

    queryStockListData() {
        const stockStr = localStorage.getItem("mystock");
        let arrData
        let stateData = []
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
                stateData.push(row.stockNum)
            })
        }
        axios({
            method: 'get',
            url: 'https://hq.sinajs.cn/list=' + stateData.join(','), //,sh600812,sh600460,sz000650,sh600831
            withCredentials: true,
        }).then((response) => {
            if (response.status === 200) {
                const list = response.data.split(';')
                list.pop(); // 删除最后一个空数组
                this.setState(() => { // 设置头部大盘指数，并将数据存至localStorage用于 recharts 显示
                    const curList = [];
                    list.forEach((row, index, array) => {
                        const listStr = row.split("\"")
                        const stockType = listStr[0].substr(listStr[0].length - 9, 2)
                        const stockNum = listStr[0].substr(listStr[0].length - 7, 6)
                        const stockDetail = listStr[1].split(',')
                        // const change = '-23'
                        const change = Number(stockDetail[3] - stockDetail[2]).toFixed(2)
                        const changeP = Number((stockDetail[3] - stockDetail[2]) / stockDetail[2] * 100).toFixed(2)
                        curList[index] = {
                            id: index,
                            name: stockDetail[0],
                            price: Number(stockDetail[3]).toFixed(2),
                            change: change > 0 ? '+' + change : change,
                            changeP: changeP,
                            stockType: stockType,
                            stockNum: stockNum
                        }
                        const data = localStorage.getItem(stockNum);
                        let arrData
                        if (data) {
                            arrData = data.split("=")
                            if (!arrData[0]) {
                                arrData.shift(); //删除头部空数组
                            }
                        } else {
                            arrData = new Array(1);
                        }
                        if(Number(stockDetail[3]) === 0){
                            return;
                        }
                        const chartData = { p: stockDetail[3] }
                        arrData.push(JSON.stringify(chartData))
                        localStorage.setItem(stockNum, arrData.join("="))
                    });
                    localStorage.setItem('stockList', JSON.stringify(curList)); // 在localStorage存一份用于闭市时显示指数；
                    return { stockList: curList }
                })
            }
        })
    }

    render() {
        let stockListData;
        if (localStorage.getItem('mystock')) {
            stockListData = this.state.stockList.map(item =>
                <StockList key={item.id} item={item} parent={this.props.parent} />
            )
        } else {
            stockListData = <Empty description={<span> </span>} style={{ position: 'relative', top: '50%', transform: 'translateY(-65%)' }}>
                <Button type="dashed" shape="round" onClick={this.showDrawer}>添加自选股</Button>
            </Empty>
        }

        return (
            <div>
                <Layout>
                    <Content style={{ background: '#fff' }}>
                        <StatusBar theme={this.props.theme} />
                        <div className='stockList'>
                            {stockListData}
                            <Settings onRef={setting => this.Settings = setting} />
                        </div>
                    </Content>
                    <Footer style={{ width: '100%', height: '20px', margin: '0', padding: '0', background: '#fff' }}>
                        <span style={{ float: "left", margin: '-1px 4px' }} ><SettingFilled onClick={this.showDrawer} /></span>
                        <span style={{ float: "right", margin: '-1px 4px' }} ><CloseCircleFilled onClick={this.closeApp} /></span>
                    </Footer>
                </Layout>

            </div>
        );
    }
}