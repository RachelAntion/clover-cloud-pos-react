import React from 'react';
import clover from 'remote-pay-cloud-api';

export default class ExampleCloverConnectorListener extends clover.remotepay.ICloverConnectorListener{

    constructor(cloverConnector, setStatus, duplicate, tipAdded, store) {
        super()
        this.cloverConnector = cloverConnector;
        this.setStatus = setStatus;
        this.duplicate = duplicate;
        this.tipAdded = tipAdded;
        this.store = store;
    }


    onReady(merchantInfo){
    }

    onVerifySignatureRequest (request) {
        this.setStatus("accepting signature...");
        this.cloverConnector.acceptSignature(request);
    }

    onConfirmPaymentRequest(request) {
        console.log("confirmPayment :" ,request);
        if(request.challenges.length > 0){
            console.log("inside if");
            this.duplicate(request.challenges[0].message, request);
        }
        else {
            this.setStatus("confirming payment...");
            this.cloverConnector.acceptPayment(request.payment);
        }
    }

    onSaleResponse(response) {
        console.log('got sale response');
        this.setStatus("got sale response");
        this.cloverConnector.showWelcomeScreen();
        // this.cloverConnector.dispose();
        if(!response.getIsSale()) {
            console.error("Response is not an sale!");
            console.error(response);
        }
    }

    onTipAdded(tipAdded){
        if (tipAdded.tipAmount > 0) {
            console.log('inside tip if');
            console.log("Tip successfully added: " + tipAdded.tipAmount);
            this.tipAdded(tipAdded.tipAmount);
        }
        else{
            this.tipAdded(0);
        }
        this.setStatus("Customer is choosing payment method...");
    }

    onVaultCardResponse(response){
        console.log("Vault Card Response");
        console.log(response);
        let card = response.getCard();
        this.store.addCard(card);
        this.setStatus('Card Successfully Vaulted');
        console.log(card);
    }

}
