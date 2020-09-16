import React from "react"
import { Carousel } from 'antd'
import CarouselBar from "./CarouselBar"
import axios from "axios"
import options from "../options/headOptions"
import checkStockTime from '../../utils/CheckStockTimeUtil'

class MyHeader extends React.Component {

    constructor() {
        super()
        this.state = {
            list: options //大盘指数，顶部显示
        };
        this.querySynData = this.querySynData.bind(this);
    }

    componentDidMount() {
        setInterval(() => {
            // if (false) {
            if (checkStockTime()) {
                this.querySynData()
            }
        }, 3000); //3秒请求一次
    }


    // 请求新浪大盘指数api
    querySynData() {
        axios({
            method: 'get',
            url: 'https://hq.sinajs.cn/rn=1599534887841&list=s_sh000001,s_sz399001,s_sz399006',
            withCredentials: true,
        }).then((response) => {
            if (response.status === 200) {
                const list = response.data.split(';')
                list.pop(); // 删除最后一个空数组
                this.setState(() => { // 设置头部大盘指数，并将数据存至localStorage用于 recharts 显示
                    const curList = [];
                    list.forEach((row, index, array) => {
                        const listStr = row.split(',')
                        const name = listStr[0].substr(listStr[0].length - 4, 1)
                        curList[index] = {
                            id: index,
                            name: name,
                            price: Number(listStr[1]).toFixed(2),
                            change: Number(listStr[2]).toFixed(2),
                            changeP: Number(listStr[3]).toFixed(2)
                        }
                        const data = localStorage.getItem(name);
                        let arrData
                        if (data) {
                            arrData = data.split("=")
                            if (!arrData[0]) {
                                arrData.shift(); //删除头部空数组
                            }
                        } else {
                            arrData = new Array(1)
                        }
                        const chartData = { p: Number(listStr[1]).toFixed(2) }
                        arrData.push(JSON.stringify(chartData));
                        localStorage.setItem(name, arrData.join("="))
                    });
                    localStorage.setItem('zs', JSON.stringify(curList)); // 在localStorage存一份用于闭市时显示指数；
                    return { list: curList }
                })
            }
        })
            .catch((error) => console.log(error))
    }

    render() {
        const CarouselBarItems = this.state.list.map(item =>
            <CarouselBar key={item.id} item={item} setAppBackgroud={this.props.setAppBackgroud} />
        );
        return (
            <>
                <Carousel autoplay dotPosition={"left"}>
                    {CarouselBarItems}
                </Carousel>
            </>
        )
    }
}

export default MyHeader