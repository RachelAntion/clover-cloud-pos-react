import React from 'react';
import clover from 'remote-pay-cloud';
import ExampleCloverConnectorListener from "./POSCloverConnectorListener";

// sdk.DebugConfig.loggingEnabled = true;

export default class Connect {

    constructor(toggleConnectionState, setPairingCode, setStatus, challenge, tipAdded, store, closeStatus, inputOptions){
        this.connected = false;
        this.toggleConnectionState = toggleConnectionState;
        this.setPairingCode = setPairingCode;
        this.setStatus = setStatus;
        this.challenge = challenge;
        this.tipAdded = tipAdded;
        this.cloverConnector = null;
        this.store = store;
        this.closeStatus = closeStatus;
        this.inputOptions = inputOptions;
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
        this.cloverConnector = connector;

        let connectorListener = new ExampleCloverConnectorListener(connector, this.setStatus, this.challenge, this.tipAdded, this.store, this.closeStatus, this.inputOptions);
        connector.addCloverConnectorListener(connectorListener);
        connector.initializeConnection();

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

