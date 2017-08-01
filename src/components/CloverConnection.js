import React from 'react';
import clover from 'remote-pay-cloud';

// clover.DebugConfig.loggingEnabled = true;

export default class Connect {

    constructor(toggleConnectionState, setPairingCode){
        this.connected = false;
        this.toggleConnectionState = toggleConnectionState;
        this.setPairingCode = setPairingCode;
        // this.uriText = "wss://192.168.0.114:12345/remote_pay";
        // this.handleChange = this.handleChange.bind(this);
        // this.connect = this.connect.bind(this);
    }
    getConnected (){
        console.log("getConnected called", this.connected);
        return this.connected;
    }

    setConnected(connected){
        this.connected = connected;
    }

    connectToDevice(uriText) {
        console.log("connecting.....");
        // let saleCalled = false;
        let factoryConfig = {};
        factoryConfig[clover.CloverConnectorFactoryBuilder.FACTORY_VERSION] = clover.CloverConnectorFactoryBuilder.VERSION_12;
        let cloverConnectorFactory = clover.CloverConnectorFactoryBuilder.createICloverConnectorFactory(factoryConfig);
        let connector = cloverConnectorFactory.createICloverConnector(new ExampleWebsocketPairedCloverDeviceConfiguration({
            uri: uriText,
            applicationId: "com.clover.cloud-pos-example-react",
            posName: "pos.name",
            serialNumber: "register_1",
            authToken: null,
            heartbeatInterval: 1000,
            reconnectDelay: 3000
        }, this.toggleConnectionState, this.setConnected.bind(this), this.setPairingCode));


        let ExampleCloverConnectorListener = function(cloverConnector) {
            clover.remotepay.ICloverConnectorListener.call(this);
            this.cloverConnector = cloverConnector;
        };

        ExampleCloverConnectorListener.prototype = Object.create(clover.remotepay.ICloverConnectorListener.prototype);
        ExampleCloverConnectorListener.prototype.constructor = ExampleCloverConnectorListener;

        ExampleCloverConnectorListener.prototype.onReady = function (merchantInfo) {
            // if(!saleCalled) {
            //     let saleRequest = new clover.remotepay.SaleRequest();
            //     saleRequest.setExternalId(clover.CloverID.getNewId());
            //     saleRequest.setAmount(10000);
            //     this.cloverConnector.sale(saleRequest);
            //     saleCalled = true;
            // }
        };

        ExampleCloverConnectorListener.prototype.onVerifySignatureRequest = function (request) {
            console.log("accepting signature: ", request);
            this.cloverConnector.acceptSignature(request);
        };

        ExampleCloverConnectorListener.prototype.onConfirmPaymentRequest = function (request) {
            console.log("confirmPayment :" ,request);
            this.cloverConnector.acceptPayment(request.payment);
        };

        ExampleCloverConnectorListener.prototype.onSaleResponse = function (response) {
            // log.info(response);
            connector.showWelcomeScreen();
            connector.dispose();
            if(!response.getIsSale()) {
                console.error("Response is not an sale!");
                console.error(response);
            }
        };

        let connectorListener = new ExampleCloverConnectorListener(connector);
        connector.addCloverConnectorListener(connectorListener);
        connector.initializeConnection();

        // $(window).on('beforeunload ', function () {
        //     try {
        //         connector.dispose();
        //     } catch (e) {
        //         console.log(e);
        //     }
        // });
    }

    render(){

        return(
            <div>
                <input type="text" id="uri" value={this.state.uriText} onChange={this.handleChange}/>
                <button onClick={this.connect}>Connect</button>
            </div>
        );
    }
}

export class ExampleWebsocketPairedCloverDeviceConfiguration extends clover.WebSocketPairedCloverDeviceConfiguration {
    /**
     * @param rawConfiguration - a raw json object for initialization.
     */
    constructor(
        rawConfiguration, toggleConnectionState, setConnected, setPairingCode) {
        super(
            rawConfiguration.uri,
            rawConfiguration.applicationId,
            rawConfiguration.posName,
            rawConfiguration.serialNumber,
            rawConfiguration.authToken,
            clover.BrowserWebSocketImpl.createInstance,
            new clover.ImageUtil(),
            rawConfiguration.heartbeatInterval,
            rawConfiguration.reconnectDelay);
        this.toggleConnectionState = toggleConnectionState;
        this.setConnected = setConnected;
        this.setPairingCode = setPairingCode;
    }

    onPairingCode(pairingCode) {
        console.log("Pairing code is " + pairingCode);
        this.setPairingCode(pairingCode);
        showPairingCode(pairingCode);
    }

    onPairingSuccess(authToken) {
        console.log("Pairing succeeded, authToken is " + authToken);
        this.toggleConnectionState(true);
        this.setConnected(true);
        // clearPairingCode();
    }
}

