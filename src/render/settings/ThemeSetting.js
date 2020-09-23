import React from 'react'
import { SketchPicker } from 'react-color'
import 'antd/dist/antd.css'
import './ThemeSetting.css'
import { Row, Col } from 'antd'
import Mytheme from '../theme/CustomTheme'


// 设置页
class ThemeSetting extends React.Component {
    constructor() {
        super()
        this.state = {
            pickerColor: '#fff',
            upColor: localStorage.getItem('upColor'),
            downColor: localStorage.getItem('downColor'),
            display: 'none',
            activeColor: 'up'
        }
        this.handleChangeComplete = this.handleChangeComplete.bind(this);
        this.handleColcorClick = this.handleColcorClick.bind(this);
    }

    handleChangeComplete = (color, event) => {
        const tmpState = this.state.activeColor === 'up' ? { pickerColor: color.hex, upColor: color.hex }
            : { pickerColor: color.hex, downColor: color.hex }
        if (this.state.activeColor === 'up') {
            localStorage.setItem('upColor', color.hex)
        } else {
            localStorage.setItem('downColor', color.hex)
        }
        this.setState(tmpState)
        new Mytheme().setThemeState()
    }

    handleColcorClick(event) {
        const pickerColor = event.target.title === 'up' ? this.state.upColor : this.state.downColor
        this.setState({ activeColor: event.target.title, display: 'block', pickerColor: pickerColor })
    }

    render() {

        const upColorStyle = {
            background: this.state.upColor
        }
        const downColorStyle = {
            background: this.state.downColor
        }
        const pickerStyle = {
            display: 'inline-block'
        }
        return (
            <>
                <div style={{ textAlign: "center", display: 'inline-block' }}>
                    <Row className='rowStyle' >
                        <Col span={3}>涨</Col>
                        <Col span={7} className='colorColStyle' style={upColorStyle} title='up' onClick={this.handleColcorClick} ></Col>
                        <Col span={3} offset={2}>跌</Col>
                        <Col span={7} className='colorColStyle' style={downColorStyle} title='down' onClick={this.handleColcorClick} ></Col>
                    </Row>

                    <div className='pickerStyle' style={pickerStyle} >
                        <SketchPicker
                            triangle='hide'
                            onChangeComplete={this.handleChangeComplete}
                            color={this.state.pickerColor} />
                    </div>
                </div>
            </>
        )
    }
}

export default ThemeSetting;
