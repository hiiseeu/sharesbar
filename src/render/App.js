import React from 'react'
import { Layout } from 'antd'
import './App.css'
import 'antd/dist/antd.css'
import MyHeader from './header/MyHeader'
import MainContent from './Content/MainContent'
import Mytheme from './theme/CustomTheme'

const { Content } = Layout;

class App extends React.Component {

  constructor() {
    super()
    const mytheme = new Mytheme()
    const color = mytheme.state.defaultColor
    this.state = {
      theme: color,
    }
    this.setAppBackgroud = this.setAppBackgroud.bind(this);
  }

  setAppBackgroud = (color) => {
    this.setState({
      theme: color
    })
  }

  componentWillUnmount() {
    localStorage.removeItem('zsTime')
  }


  render() {

    return (
      <div className='App' style={{ background: this.state.theme[0] }}>
        <header className="App-header" >
          <MyHeader setAppBackgroud={this.setAppBackgroud} />
        </header>
        <Content className='Body'>
          <MainContent theme={this.state.theme} />
        </Content>
      </div>
    );
  }
}

export default App
