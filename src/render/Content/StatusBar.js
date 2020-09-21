import React from 'react'
import { Row, Col, Tag } from 'antd'
import { SlidersOutlined } from '@ant-design/icons'
import checkStockTime from '../../utils/CheckStockTimeUtil'
import './StatusBar.css'

export default class StatusBar extends React.Component {
    render() {
        const stockTime = checkStockTime() ? '开市' : '闭市'
        return (
            <>
                <Row className='statusBar' style={{ backgroundImage: 'linear-gradient(' + this.props.theme[1] + ',#fff)' }}>
                    <Col span={8}>
                        <Tag className='stockState'>{<SlidersOutlined style={{ marginRight: '2px' }} />}{stockTime}</Tag>
                    </Col>
                    <Col span={4}></Col>
                    <Col span={12} style={{ fontSize: '10px', margin: '5px 0px 0px -8px' }}>今日盈亏：10￥ 总盈亏：20￥</Col>
                </Row>
            </>
        )
    }
}