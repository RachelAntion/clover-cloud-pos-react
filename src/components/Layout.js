import React from 'react';
import { Link } from 'react-router';
import ButtonNormal from "./ButtonNormal";
import Connect from "./CloverConnection";
import Store from '../Models/Store';
import Item from '../Models/Item';
import Discount from '../Models/Discount';
const data = require ("../../src/items.js");

export default class Layout extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            connected : false,
            uriText : "ws://192.168.0.9:12345/remote_pay",
            pairingCode: '',
            statusText: '',
            statusToggle: false,
            challenge: false,
            request: null,
            saleFinished: false,
            tipAmount: 0,
            statusArray: null,
            vaultedCard : false,
            preAuth: false,
            inputOptions: null,
            fadeBackground: false,
            responseFail: false,
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
        this.closeCardData = this.closeCardData.bind(this);
        this.inputOptions = this.inputOptions.bind(this);
        this.fadeBackground = this.fadeBackground.bind(this);
        this.unfadeBackground = this.unfadeBackground.bind(this);
        this.store = new Store();
        this.initStore();
        this.cloverConnection = new Connect(this.toggleConnectionState, this.setPairingCode, this.setStatus, this.challenge, this.tipAdded, this.store, this.closeStatus, this.inputOptions);
    }

    initStore(){
        data.forEach(function(item){
            let newItem = new Item(item.id, item.title, item.itemPrice, item.taxable, item.tippable);
            this.store.addItem(newItem);
        }, this);

        this.store.addDiscount(new Discount("10% Off", 0 , 0.1));
        this.store.addDiscount(new Discount("$5 Off", 500 , 0.00));
    }

    toggleConnectionState(connected){
        this.setState({ connected: connected});
        this.cloverConnection.cloverConnector.showWelcomeScreen();
    }

    setPairingCode(pairingCode){
        this.setState({ pairingCode: pairingCode});
    }

    setStatus(message, reason) {
        console.log(message, reason);
        if((typeof message === "object") && (message !== null)){
            //console.log("isArray", message);
            this.setState({statusArray: message,  statusToggle: false, fadeBackground: true, responseFail: false});
        }
        else if (message == 'got sale response' || message == 'got auth response' || message === "Sale successfully processed using Pre Authorization") {
            //console.log('got a sale response');
            this.setState({statusToggle: false, saleFinished: true, fadeBackground: false, responseFail: false});
        }
        else if(message === 'Response was not a sale'){
            this.setState({responseFail : true, statusText: reason, fadeBackground: true, statusToggle: true, inputOptions: null});
            setTimeout(function() {
                this.setState({statusToggle: false, fadeBackground: false});
            }.bind(this), 1200);
        }
        else if(message === 'Card Successfully Vaulted' || message === 'PreAuth Successful'|| message === "Refund Successful"){
            if(message === 'Card Successfully Vaulted'){
                this.setState({vaultedCard: true});
            }
            if(message === 'PreAuth Successful'){
                this.setState({preAuth: true})
            }
            this.setState({statusToggle: true, statusText: message, challenge: false, saleFinished: false, fadeBackground: true, responseFail: false});
            setTimeout(function() {
                this.setState({statusToggle: false, fadeBackground: false});
            }.bind(this), 1200);
        }
        else{
            this.setState({
                statusToggle: true,
                statusText: message,
                challenge: false,
                saleFinished: false,
                vaultedCard: false,
                preAuth: false,
                inputOptions: null,
                fadeBackground: true,
                responseFail: false,
            });
        }
    }

    closeCardData(){
        this.setState({statusArray : null, fadeBackground: false});
    }


    closeStatus(){
        //console.log('closeStatus');
        if(!this.state.challenge){
            this.setState({statusToggle: false});
            if(this.state.statusArray === null){
                this.setState({fadeBackground: false})
            }
        }
    }

    tipAdded(tipAmount){
        this.setState({tipAmount : tipAmount });
    }

    challenge(message, request){
        this.setState({statusToggle: true, statusText: message, challenge : true, request : request, inputOptions: null});
    }

    acceptPayment(){
        this.cloverConnection.cloverConnector.acceptPayment(this.state.request.payment);
        this.setState({challenge : false, statusToggle : false });
        //this.setStatus("Customer choosing receipt type...");
    }

    inputOptions(io){
        this.setState({inputOptions: io});
    }

    inputClick(io){
        this.cloverConnection.cloverConnector.invokeInputOption(io);
    }


    connect(){
        this.cloverConnection.connectToDevice(this.state.uriText);
    }

    handleChange (e) {
        this.setState({ uriText: e.target.value });
    }

    fadeBackground(){
        this.setState({fadeBackground: true});
    }

    unfadeBackground(){
        console.log('unfade background called');
        this.setState({fadeBackground: false});
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
        let listContainer = <div></div>;
        let inputContainer = <div></div>;
        let showStatusArray = false;
        let statusArrayTitle = "";
        let showInputOptions = false;
        let fadeBackground = this.state.fadeBackground;
        if(this.state.statusArray !== null){
            showStatusArray = true;
            statusArrayTitle = this.state.statusArray.title;
            let listItems = this.state.statusArray.data.map((line, i) =>
                <p key={'line-'+i}>{line}</p>
            );
            listContainer = (<div className="card_data_content">
                {listItems}
            </div>);
        }
        if(this.state.inputOptions !== null){
            showInputOptions = true;
            let inputButtons = this.state.inputOptions.map((option, i) =>
                <ButtonNormal key={'option-'+i} title={option.description} color="white" extra="input_options_button" onClick={() => {this.inputClick(option)}}/>
            );
            inputContainer = (<div className="input_buttons">{inputButtons}</div>);
        }
        let showChallenge = this.state.challenge;
        //console.log('showCardData', showCardData, 'showStatus: ', showStatus, 'cardData', cardData);
        //{showCardData && {cardData}}
        return (
            <div className="app-content">
                {fadeBackground &&
                <div className="popup_opaque"></div>
                }
                <div className="page_header">
                    <Link to="/">
                        <img className="home_logo" src={'images/home.png'}/>
                    </Link>
                    <div id="connection_status">
                        {connectionState}
                    </div>
                    <div className="filler_space"/>
                </div>
                {showStatusArray &&
                <div className="card_data popup">
                    <div className="close_popup" onClick={this.closeCardData}>X</div>
                    <h3>{statusArrayTitle}</h3>
                    {listContainer}
                </div>}
                {showStatus && <div className="popup_container popup">
                    <div className="status">
                        {status}
                    </div>
                    {showInputOptions &&
                    <div>
                        {inputContainer}
                    </div>
                    }
                    {showChallenge &&
                    <div className="reject_accept">
                        <ButtonNormal title="Reject" color="white" extra="left dialog_button" />
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
                            tipAmount : this.state.tipAmount,
                            vaultedCard: this.state.vaultedCard,
                            preAuth: this.state.preAuth,
                            fadeBackground: this.fadeBackground,
                            unfadeBackground: this.unfadeBackground,
                            responseFail: this.state.responseFail,
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