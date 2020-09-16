import React from 'react'
import { Layout } from 'antd'
import './App.css'
import 'antd/dist/antd.css'
import MyHeader from './header/MyHeader'
import MainContent from './Content/MainContent'
import {midColor} from '../utils/CustomThemesUtil'

const { Content } = Layout;

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      theme: midColor
    }

    this.setAppBackgroud = this.setAppBackgroud.bind(this);
  }

  setAppBackgroud = (color) => {
    this.setState({
      theme: color
    })
  }

  render() {
    return (
      <div className='App' style={{ background: this.state.theme[0] }}>
        <header className="App-header" >
          <MyHeader  setAppBackgroud={this.setAppBackgroud}/>
        </header>
        <Content className='Body'>
          <MainContent theme={this.state.theme} />
        </Content>
      </div>
    );
  }
}

export default App
