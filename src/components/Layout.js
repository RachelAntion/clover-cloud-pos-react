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
            uriText : "wss://192.168.0.50:12345/remote_pay",
            pairingCode: '',
            statusText: '',
            statusToggle: false,
            challenge: false,
            request: null,
            saleFinished: false,
            tipAmount: 0,
        };
        this.toggleConnectionState = this.toggleConnectionState.bind(this);
        this.setPairingCode = this.setPairingCode.bind(this);
        this.setStatus = this.setStatus.bind(this);
        this.connect = this.connect.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.challenge = this.challenge.bind(this);
        this.acceptPayment = this.acceptPayment.bind(this);
        this.tipAdded = this.tipAdded.bind(this);
        this.closeStatus = this.closeStatus.bind(this);
        this.store = new Store();
        this.initStore();
        this.cloverConnection = new Connect(this.toggleConnectionState, this.setPairingCode, this.setStatus, this.challenge, this.tipAdded, this.store);
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
        this.cloverConnection.cloverConnector.showWelcomeScreen();
    }

    setPairingCode(pairingCode){
        console.log("pairing code set");
        this.setState({ pairingCode: pairingCode});
    }

    setStatus(message) {
        if (message == 'got sale response') {
            this.setState({statusToggle: false, saleFinished: true});
        }
        else if(message == 'Card Successfully Vaulted'){
            this.setState({statusToggle: true, statusText: message, challenge: false, saleFinished: false});
            setTimeout(function() {
                this.setState({statusToggle: false});
            }.bind(this), 1000);
        }
        else{
            this.setState({statusToggle: false});
        }
    }

    closeStatus(){
        this.setState({statusToggle: false});
    }

    tipAdded(tipAmount){
        console.log('tipAmount', tipAmount);
        this.setState({tipAmount : tipAmount });
    }

    challenge(message, request){
        console.log("inside challenge");
        this.setState({statusToggle: true, statusText: message, challenge : true, request : request});
    }

    acceptPayment(){
        this.cloverConnection.cloverConnector.acceptPayment(this.state.request.payment);
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
        let showBody = this.state.connected;
        // let showBody = true;
        let pairing = <div/>;
        if( this.state.pairingCode.length > 0){
            pairing = <div className="pairing_code">Enter pairing code: {this.state.pairingCode} into your device</div>
        }
        let showStatus = this.state.statusToggle;
        let status = this.state.statusText;
        let showChallenge = this.state.challenge;

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
                {showStatus && <div className="popup_container popup">
                    <div className="status">
                        {status}
                    </div>
                    {showChallenge &&
                    <div className="reject_accept">
                        <ButtonNormal title="Reject" color="white" extra="left dialog_button"/>
                        <ButtonNormal title="Accept" color="white" extra="right dialog_button" onClick={this.acceptPayment}/>
                    </div>
                    }
                </div>
                }
                {showBody? (
                    <div className="body_content">{React.cloneElement(this.props.children,
                        {
                            toggleConnectionState: this.toggleConnectionState,
                            cloverConnection: this.cloverConnection,
                            store: this.store,
                            setStatus : this.setStatus,
                            closeStatus: this.closeStatus,
                            saleFinished : this.state.saleFinished,
                            tipAmount : this.state.tipAmount
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