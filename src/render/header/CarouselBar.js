import React from "react"
import { Avatar, Row, Col } from 'antd'
import MyAreaChart from '../reChart/MyAreaChart'
import { upColor, downColor } from '../theme/CustomThemesUtil'

// 头部走马灯
class CarouselBar extends React.Component {

    constructor() {
        super()
        this.state = {
            chartOptions: {
                height: 40,
                width: 210
            }
        }
    }

    render() {
        let color
        if(this.props.item.change >=0){
            color = upColor
        } else {
            color = downColor
        }
        const contentStyle = {
            height: '80px',
            color: color[5],
            lineHeight: '80px',
            textAlign: 'center',
            background: color[0],
            top: '0', 
            fontSize: '14px'
        }

        const avatarStyle = {
            color: '#fff',
            backgroundColor: color[8],
            fontSize: '30px'
        }

        return (<>
            <Row style={contentStyle} gutter={16} >
                {/* 指数详情 */}
                <Col className="gutter-row" style={{ lineHeight: '40px' }} offset={2} span={14}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Row gutter={16}>
                                <Col span={8} >{this.props.item.change}</Col>
                                <Col span={8}>{this.props.item.changeP}%</Col>
                                <Col span={8}>{this.props.item.price}</Col>
                            </Row>
                        </Col>
                        {/* 实时指数图 */}
                        <Col span={24} >
                            <MyAreaChart item={this.props.item} options={this.state} />
                        </Col>
                    </Row>
                </Col>
                {/* 指数名称 */}
                <Col className="gutter-row" span={6} offset={1} >
                    <Avatar size={60} style={avatarStyle}>{this.props.item.name}</Avatar>
                </Col>
            </Row>
        </>)
    }
}

export default CarouselBar