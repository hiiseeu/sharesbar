import React from 'react'
import 'antd/dist/antd.css'
import { Drawer } from 'antd'
import SubContent from './SubContent'


class Settings extends React.Component {
    constructor() {
        super()
        this.state = {
            theme: '#fff0f0',
            visible: false
        };
        this.showDrawer = this.showDrawer.bind(this);
    }

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    componentDidMount() {
        this.props.onRef(this)
    }

    onClose = () => {
        this.setState({
            visible: false,
        })
    }

    render() {
        return (
            <Drawer
                placement="top"
                closable={false}
                height='350'
                onClose={this.onClose}
                visible={this.state.visible}
                getContainer={false}
                bodyStyle={{ marginTop: '-25px' }}
                style={{ position: 'absolute' }}
            >
                <SubContent />
            </Drawer>
        );
    }
}

export default Settings;
