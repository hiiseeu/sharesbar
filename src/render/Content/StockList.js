import React from 'react'
import { Col, Row } from 'antd'
import './StockList.css'
import MyAreaChart from '../reChart/MyAreaChart'
import { downColor, upColor } from '../theme/CustomThemesUtil'

export default class StockList extends React.Component {

    constructor() {
        super()
        this.state = {
            name: '',
            color: 'red',
            chartOptions: {
                height: 20,
                width: 160
            }
        }
    }

    componentWillReceiveProps() {
        this.setState(() => {
            const color = this.props.item.change >= 0 ? upColor : downColor;
            return {
                color: color
            }
        })
    }

    render() {

        return (
            <div>
                <Row className='mainRow'>
                    <Col span={6} >
                        <Row>
                            <Col span={24} className='stockName' >{this.props.item.name}</Col>
                            <Col span={24} style={{ fontSize: '10px' }}>
                                <Row>
                                    <Col span={6} className='stockType' >{this.props.item.stockType}</Col>
                                    <Col span={18} className='stockNum' >{this.props.item.stockNum}</Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={11} style={{ width: "100%", margin: '8px auto' }}>
                        <MyAreaChart item={this.props.item} options={this.state} />
                    </Col>
                    <Col span={7} className='' style={{ padding: '5px 5px 0 0' }}>
                        <Row style={{ color: this.state.color[5], textAlign: 'right', fontSize: '16px' }}>
                            <Col span={24} style={{ lineHeight: '16px' }}>{this.props.item.price}</Col>
                            <Col span={24}>
                                <Row style={{ fontSize: '10px' }}>
                                    <Col span={12}>{this.props.item.change}</Col>
                                    <Col span={12}>{this.props.item.changeP}%</Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div className='line' />
            </div>
        );
    }
}