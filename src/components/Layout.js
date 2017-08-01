import React from 'react';
import { Link } from 'react-router';
import ButtonNormal from "./ButtonNormal";
import Connect from "./CloverConnection";
import Store from '../Models/Store';
import Item from '../Models/Item';
const data = require ("../../src/items.js");

export default class Layout extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            connected : false,
            uriText : "wss://192.168.0.146:12345/remote_pay",
            pairingCode: '',
        };
        this.toggleConnectionState = this.toggleConnectionState.bind(this);
        this.setPairingCode = this.setPairingCode.bind(this);
        this.connect = this.connect.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.cloverConnection = new Connect(this.toggleConnectionState, this.setPairingCode);
        this.store = new Store();
        this.initStore();
    }

    initStore(){
        data.forEach(function(item){
            let newItem = new Item(item.id, item.title, item.itemPrice);
            this.store.addItem(newItem);
        }, this);
    }

    toggleConnectionState(connected){
        console.log("toggleConnectionState called");
        this.setState({ connected: connected});
    }

    setPairingCode(pairingCode){
        console.log("pairing code set");
        this.setState({ pairingCode: pairingCode});
    }


    connect(){
        this.cloverConnection.connectToDevice(this.state.uriText);
    }

    handleChange (e) {
        this.setState({ uriText: e.target.value });
    }


    render() {
        let connectionState = "Disconnected";
        if( this.state.connected) {
            connectionState = "Connected";
        }
        // let showBody = this.state.connected;
        let showBody = true;
        let pairing = <div/>;
        if( this.state.pairingCode.length > 0){
            pairing = <div className="pairing_code">Enter pairing code: {this.state.pairingCode} into your device</div>
        }

        return (
            <div className="app-content">
                <div className="page_header">
                    <Link to="/">
                       <img className="home_logo" src={'images/home.png'}/>
                    </Link>
                    <div id="connection_status">
                        {connectionState}
                    </div>
                    <div className="filler_space"/>
                </div>
                {showBody? (
                    <div className="body_content">{React.cloneElement(this.props.children,
                        {
                            toggleConnectionState: this.toggleConnectionState,
                            cloverConnection: this.cloverConnection,
                            store: this.store,
                        })}
                    </div>
                ):(
                    <div className="connect_container">
                        <img className="clover_logo" src={'images/clover_logo.png'}/>
                        <p>Example POS</p>
                        <h3>Enter the URI of your device</h3>
                        <p>This can be found in the Network Pay Display app</p>
                        <div className="connect_box">
                            <input className="input_field" type="text" id="uri" value={this.state.uriText} onChange={this.handleChange}/>
                            <ButtonNormal color="white" title="Connect" extra="connect_button" onClick={this.connect}/>
                        </div>
                        {pairing}
                    </div>
                )}
            </div>
        );
    }
}