import React from 'react';
import { Link } from 'react-router';
import ButtonNormal from "./ButtonNormal";
import clover from 'remote-pay-cloud';


var factoryConfig = {};
factoryConfig[clover.CloverConnectorFactoryBuilder.FACTORY_VERSION] = clover.CloverConnectorFactoryBuilder.VERSION_12;
var cloverConnectorFactory = clover.CloverConnectorFactoryBuilder.createICloverConnectorFactory({
    factoryConfig
});
var connector = cloverConnectorFactory.createICloverConnector(new clover.WebSocketPairedCloverDeviceConfiguration(
        "wss://192.168.0.114:12345/remote_pay",
        "com.clover.cloud-pos-example-react",
        "pos.name",
        "register_1",
        null,
        clover.BrowserWebSocketImpl.createInstance,
        new clover.ImageUtil(),
        1000,
        3000
    ));


var ExampleCloverConnectorListener = function(cloverConnector) {
    clover.remotepay.ICloverConnectorListener.call(this);
    this.cloverConnector = cloverConnector;
};

ExampleCloverConnectorListener.prototype = Object.create(clover.remotepay.ICloverConnectorListener.prototype);
ExampleCloverConnectorListener.prototype.constructor = ExampleCloverConnectorListener;

ExampleCloverConnectorListener.prototype.onReady = function (merchantInfo) {
    var saleRequest = new clover.remotepay.SaleRequest();
    saleRequest.setExternalId(clover.CloverID.getNewId());
    saleRequest.setAmount(10000);
    this.cloverConnector.sale(saleRequest);
};

ExampleCloverConnectorListener.prototype.onVerifySignatureRequest = function (request) {
    log.info(request);
    this.cloverConnector.acceptSignature(request);
};

ExampleCloverConnectorListener.prototype.onConfirmPaymentRequest = function (request) {
    this.cloverConnector.acceptPayment(request.payment);
};

ExampleCloverConnectorListener.prototype.onSaleResponse = function (response) {
    log.info(response);
    connector.dispose();
    if(!response.getIsSale()) {
        console.error("Response is not an sale!");
        console.error(response);
    }
};

var connectorListener = new ExampleCloverConnectorListener(connector);
connector.addCloverConnectorListener(connectorListener);
connector.initializeConnection();

export default class Layout extends React.Component {
    render() {
        return (
            <div className="app-content">
                <div className="page_header">
                    <div id="connection_status">Disconnected</div>
                    <div className="filler_space"/>
                    <Link to="/register">
                        <ButtonNormal title="Register" color="white" extra="button_margin"/>
                    </Link>
                    <Link to="/orders">
                        <ButtonNormal title="Orders" color="white" extra="button_margin"/>
                    </Link>
                    <Link to="/refund">
                        <ButtonNormal title="Refund" color="white" extra="button_margin"/>
                    </Link>
                    <Link to="/cards">
                        <ButtonNormal title="Cards" color="white" extra="button_margin"/>
                    </Link>
                    <Link to="/preauth">
                        <ButtonNormal title="PreAuth" color="white" extra="button_margin"/>
                    </Link>
                    <Link to="/pending">
                        <ButtonNormal title="Pending" color="white" extra="button_margin"/>
                    </Link>
                    <Link to="/misc">
                        <ButtonNormal title="Misc." color="white" extra="button_margin last"/>
                    </Link>
                </div>
                <div className="body_content">{this.props.children}</div>
            </div>
        );
    }
}