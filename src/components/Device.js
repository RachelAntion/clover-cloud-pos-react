import React from 'react';
import ButtonNormal from "./ButtonNormal";
import sdk from 'remote-pay-cloud-api';

export default class Device extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showMessageContent : "Hello Message!",
            printTextContent : "Print This!!",
            queryPaymentText: 'JANRZXDFT3JF',
            printImageURL: 'http://dkcoin8.com/images/game-of-thrones-live-clipart-6.jpg'
        };
        console.log("Device: ", this.props);
        this.cloverConnector = this.props.cloverConnection.cloverConnector;
        this.store = this.props.store;
        this.showMessage = this.showMessage.bind(this);
        this.printText = this.printText.bind(this);
        this.printImage = this.printImage.bind(this);
        this.messageChange = this.messageChange.bind(this);
        this.printImageChange = this.printImageChange.bind(this);
        this.printChange = this.printChange.bind(this);
        this.printFromURL = this.printFromURL.bind(this);
        this.readCardData = this.readCardData.bind(this);
        this.showWelcomeScreen = this.showWelcomeScreen.bind(this);
        this.showThankYouScreen = this.showThankYouScreen.bind(this);
        this.closeout = this.closeout.bind(this);
        this.openCashDrawer = this.openCashDrawer.bind(this);
    }

    showMessage(){
        this.cloverConnector.showMessage(this.state.showMessageContent);
    }

    printText(){
        this.cloverConnector.printText([this.state.printTextContent]);
    }

    showWelcomeScreen(){
        this.cloverConnector.showWelcomeScreen();
    }

    showThankYouScreen(){
        this.cloverConnector.showThankYouScreen();
    }

    printImage() {
        console.log("printImage");
        let downloadingImage = new Image();
        downloadingImage.src = "images/clover_leaf.png";
        //this.printImageAfterPause(downloadingImage);
        downloadingImage.addEventListener('load', function() {
            this.cloverConnector.printImage(downloadingImage);
        }.bind(this));
        downloadingImage.addEventListener('error', function() {
            alert('error')
        })
    }

    closeout(){
        let request = new sdk.remotepay.CloseoutRequest();
        request.setAllowOpenTabs(false);
        request.setBatchId(null);
        this.cloverConnector.closeout(request);
    }

    openCashDrawer(){
        this.cloverConnector.openCashDrawer("Test");
    }

    printFromURL(){
        console.log("printFromURL");
        this.cloverConnector.printImageFromURL(this.state.printImageURL);
    }

    readCardData(){
        this.cloverConnector.readCardData(new sdk.remotepay.ReadCardDataRequest(this.store.getCardEntryMethods()));
    }

    messageChange(e){
        this.setState({ showMessageContent: e.target.value});
    }

    printChange(e){
        this.setState({ printTextContent: e.target.value});
    }

    printImageChange(e){
        this.setState({ printImageURL: e.target.value});
    }

    render(){

        return(
            <div className="device">
                <h2>Device Options</h2>
                <div className="device_options">
                    <div className="misc_row">
                        <input className="device_input" type="text" value={this.state.showMessageContent} onChange={this.messageChange}/>
                        <ButtonNormal extra="button_input" color="white" title="Show Message" onClick={this.showMessage}/>
                    </div>

                    <div className="misc_row">
                        <input className="device_input" type="text" value={this.state.printTextContent} onChange={this.printChange}/>
                        <ButtonNormal extra="button_input" color="white" title="Print Text" onClick={this.printText}/>
                    </div>
                    <div className="misc_row">
                        <input className="device_input" type="text"  onChange={this.printImageChange} value={this.state.printImageURL}/>
                        <ButtonNormal extra="button_input" color="white" title="Print Image from Url" onClick={this.printFromURL}/>
                    </div>
                    <div className="misc_row">
                        <ButtonNormal extra="button_device" color="white" title="Print Image" onClick={this.printImage}/>
                        <ButtonNormal extra="button_device" color="white" title="Read Card Data" onClick={this.readCardData}/>
                    </div>
                    <div className="misc_row">
                        <ButtonNormal extra="button_device" color="white" title="Show Welcome Screen" onClick={this.showWelcomeScreen}/>
                        <ButtonNormal extra="button_device" color="white" title="Show Thank You Screen" onClick={this.showThankYouScreen}/>
                    </div>
                    <div className="misc_row">
                        <ButtonNormal extra="button_device" color="white" title="Closeout Orders" onClick={this.closeout}/>
                        <ButtonNormal extra="button_device" color="white" title="Open Cash Drawer" onClick={this.openCashDrawer}/>
                    </div>
                </div>
            </div>
        );
    }
}