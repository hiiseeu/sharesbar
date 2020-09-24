import React from 'react'
import { generate } from '@ant-design/colors';


class Mytheme extends React.Component {

    constructor() {
        super()
        const upValue = localStorage.getItem('upColor');
        if (!upValue) {
            localStorage.setItem('upColor', '#cb293e');
            localStorage.setItem('downColor', '#69d321');
            localStorage.setItem('midColor', '#8c8c8c');
        }
        let defaultColor
        if (localStorage.getItem('zs')) {
            const zs = JSON.parse(localStorage.getItem('zs'));
            defaultColor = zs[0].change >= 0 ? generate(localStorage.getItem('upColor')) : generate(localStorage.getItem('downColor'));
        } else {
            defaultColor = generate(localStorage.getItem('upColor'))
        }

        this.state = {
            upColor: generate(localStorage.getItem('upColor')),
            downColor: generate(localStorage.getItem('downColor')),
            midColor: generate(localStorage.getItem('midColor')),
            defaultColor: defaultColor
        }
        this.setThemeState = this.setThemeState.bind(this)
    }

    setThemeState() {
        this.setState({
            upColor: generate(localStorage.getItem('upColor')),
            downColor: generate(localStorage.getItem('downColor')),
            midColor: generate(localStorage.getItem('midColor'))
        })
    }

    render() {
        return (<></>)
    }
}

export default Mytheme


