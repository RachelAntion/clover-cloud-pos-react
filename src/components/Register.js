import React from 'react';
import ButtonNormal from "./ButtonNormal";
import RegisterLine from "./RegisterLine";
import clover from 'remote-pay-cloud';


export default class Register extends React.Component {

    connect() {
        let factoryConfig = {};
        factoryConfig[clover.CloverConnectorFactoryBuilder.FACTORY_VERSION] = clover.CloverConnectorFactoryBuilder.VERSION_12;
        let cloverConnectorFactory = clover.CloverConnectorFactoryBuilder.createICloverConnectorFactory(factoryConfig);
        let connector = cloverConnectorFactory.createICloverConnector(new clover.WebSocketPairedCloverDeviceConfiguration(
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


        let ExampleCloverConnectorListener = function(cloverConnector) {
            clover.remotepay.ICloverConnectorListener.call(this);
            this.cloverConnector = cloverConnector;
        };

        ExampleCloverConnectorListener.prototype = Object.create(clover.remotepay.ICloverConnectorListener.prototype);
        ExampleCloverConnectorListener.prototype.constructor = ExampleCloverConnectorListener;

        ExampleCloverConnectorListener.prototype.onReady = function (merchantInfo) {
            let saleRequest = new clover.remotepay.SaleRequest();
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

        let connectorListener = new ExampleCloverConnectorListener(connector);
        connector.addCloverConnectorListener(connectorListener);
        connector.initializeConnection();
    }

    render(){

        return(
            <div className="register">
                <div className="register_left">
                    <div className="register_sale_items">
                        <h3>Current Order: </h3>
                    </div>
                    <div className="register_actions">

                        <RegisterLine left="Subtotal:" right="$0.00"/>
                        <RegisterLine left="Discounts:"/>
                        <RegisterLine left="Tax:" right="$0.00"/>
                        <RegisterLine left="Total:" right="$0.00" extraLeft="total"/>
                        <div className="register_buttons">
                            <ButtonNormal title="New" color="white" extra="register_button"/>
                            <ButtonNormal title="Sale" color="green" extra="middle register_button"/>
                            <ButtonNormal title="Auth" color="green" extra="register_button"/>
                        </div>
                    </div>
                </div>
                <div className="register_right">
                    <div>I AM HERE :D</div>
                    <button onClick={this.connect}>Connect</button>
                </div>
            </div>
        );
    }
}