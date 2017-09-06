import React from 'react';
import Refund from "../Models/Refund";
import clover from 'remote-pay-cloud-api';
import OrderPayment from "../Models/OrderPayment";
import VaultedCard from "../Models/VaultedCard";
import PreAuth from "../Models/PreAuth";
import CurrencyFormatter from "./../utils/CurrencyFormatter";
import CardDataHelper from "./../utils/CardDataHelper";

export default class POSCloverConnectorListener extends clover.remotepay.ICloverConnectorListener{

    constructor(cloverConnector, setStatus, challenge, tipAdded, store, closeStatus, inputOptions, confirmSignature) {
        super();
        this.cloverConnector = cloverConnector;
        this.setStatus = setStatus;
        this.challenge = challenge;
        this.tipAdded = tipAdded;
        this.inputOptions = inputOptions;
        this.store = store;
        this.lastDeviceEvent = null;
        this.formatter = new CurrencyFormatter;
        this.cdh = new CardDataHelper;
        this.setPaymentStatus = this.setPaymentStatus.bind(this);
        this.createOrderPayment = this.createOrderPayment.bind(this);
        this.closeStatus = closeStatus;
        this.confirmSignature = confirmSignature;
    }


    onReady(merchantInfo){
    }

    //onVerifySignatureRequest (request) {
    //    this.cloverConnector.acceptSignature(request);
    //}

    onConfirmPaymentRequest(request) {
        console.log("confirmPayment :" ,request);
        if(request.challenges.length > 0){
            this.challenge(request.challenges[0], request);
        }
        else {
            this.setStatus("confirming payment...");
            this.cloverConnector.acceptPayment(request.payment);
        }
    }

    onSaleResponse(response) {
        console.log('SaleResponse', response);
        // this.cloverConnector.dispose();
        if(!response.isSale) {
            this.setStatus("Response was not a sale", response.reason);
            if(response.payment.offline){

            }
            else{
                console.error("Response is not an sale!");
                console.error(response);
            }
        }
        else {
            if(this.store.getCurrentOrder().getPendingPaymentId() === response.payment.externalPaymentId) {
                this.cloverConnector.showWelcomeScreen();
                let currentOrder = this.store.currentOrder;
                let orderPayment = this.createOrderPayment(response.payment);
                currentOrder.addOrderPayment(orderPayment);
                if (response.result === 'SUCCESS') {
                    currentOrder.setStatus("PAID");
                }
                this.setStatus("got sale response");
            }
            else{
                this.setStatus("External Id's Do Not Match");
            }
        }
    }

    onAuthResponse(response){
        console.log('AuthResponse', response);
        if(!response.isAuth){
            console.error('Response is not an Auth!');
            console.error(response);
        }
        else{
            if(this.store.getCurrentOrder().getPendingPaymentId() === response.payment.externalPaymentId) {
                this.cloverConnector.showWelcomeScreen();
                let currentOrder = this.store.currentOrder;
                let orderPayment = this.createOrderPayment(response.payment);
                currentOrder.addOrderPayment(orderPayment);
                if (response.result === 'SUCCESS') {
                    currentOrder.setStatus("PAID");
                }
            }
            else{
                this.setStatus("External Id's Do Not Match");
            }
        }
        this.setStatus("got auth response");
    }

    createOrderPayment(payment){
        //console.log("createOrderPayment", payment);
        let orderPayment = new OrderPayment(this.store.getNextPaymentId());
        orderPayment.cloverPaymentId = payment.id;
        orderPayment.status = payment.result;
        orderPayment.transactionState = payment.cardTransaction.state;
        orderPayment.amount = payment.amount;
        orderPayment.taxAmount = payment.taxAmount;
        orderPayment.tipAmount = payment.tipAmount;
        orderPayment.date = new Date(payment.createdTime);
        orderPayment.tender = payment.tender.label;
        orderPayment.transactionType = payment.cardTransaction.type;
        orderPayment.cardDetails = (payment.cardTransaction.cardType + " " + payment.cardTransaction.last4);
        //orderPayment.employee = payment.employee.id;
        orderPayment.refunds = payment.refunds;
        orderPayment.cashBackAmount = payment.cashbackAmount;
        orderPayment.entryMethod = payment.cardTransaction.entryType;
        orderPayment.cloverOrderId = payment.order.id;
        orderPayment.cardType = payment.cardTransaction.cardType;
        return orderPayment;
    }

    onTipAdded(tipAdded){
        if (tipAdded.tipAmount > 0) {
            this.tipAdded(tipAdded.tipAmount);
        }
        else{
            this.tipAdded(0);
        }
        this.setStatus("Customer is choosing payment method...");
    }

    onVaultCardResponse(response) {
        console.log("Vault Card Response", response);
        let card = response.getCard();
        if (card !== undefined) {
            this.store.addCard(new VaultedCard(card));
            this.setStatus('Card Successfully Vaulted');
        }
        else {
            this.setStatus("Card Vaulting Failed");
        }
    }

    onPreAuthResponse(response){
        console.log("PreAuth response", response);
        if (this.store.getCurrentOrder().getPendingPaymentId() === response.payment.externalPaymentId) {
            console.log('inside preauth response');
            let _payment = response.payment;
            let cashback = _payment.cashbackAmount === null ? 0 : _payment.cashbackAmount;
            let tip = _payment.tipAmount === null ? 0 : _payment.tipAmount;
            let payment = new OrderPayment(_payment.id);
            payment.setExternalPaymentId(_payment.externalPaymentId);
            payment.setOrderId(this.store.getCurrentOrder().getId());
            payment.setAmount(_payment.amount);
            payment.setTipAmount(tip);
            payment.setCashback(cashback);
            console.log(payment);
            this.setPaymentStatus(payment, response);
            this.store.setPreAuth(new PreAuth(response, payment));
            this.store.setPreAuthPaymentId(_payment.id);
            this.setStatus("PreAuth Successful");
        }
        else{
            this.setStatus("External Id's Do Not Match")
        }
    }

    setPaymentStatus(payment, response) {
        if (response.isSale) {
            payment.setStatus("PAID");
        } else if (response.isAuth) {
            payment.setStatus("AUTH");
        } else if (response.isPreAuth) {
            payment.setStatus("PREAUTH");
        }
    }

    onCapturePreAuthResponse(response){
        console.log("Capture PreAuth Response", response);
        let payment = this.store.getPreAuth().payment;
        console.log(payment);
        payment.setStatus("AUTH");
        payment.setAmount(response.amount);
        this.store.setPreAuth(null);
        this.store.addPaymentToOrder(payment, this.store.getCurrentOrder().getId());
        this.setStatus("Sale successfully processed using Pre Authorization");
        this.cloverConnector.showWelcomeScreen();
    }

    onDeviceActivityStart(deviceEvent) {
        this.lastDeviceEvent = deviceEvent.getEventState();
        //console.log("DeviceEvent", deviceEvent);
        let message = deviceEvent.getMessage();
        if(message !== undefined && this.notCustomActivity(message) && message !== null) {
            this.setStatus(deviceEvent.getMessage());
        }
        if(deviceEvent.inputOptions.length > 0){
            this.inputOptions(deviceEvent.inputOptions);
        }
    }

    notCustomActivity(message) {
        return (message.indexOf("com.clover.cfp.examples") === -1);
    }


    onDeviceActivityEnd(deviceEvent) {
        if(deviceEvent.getEventState() !== this.lastDeviceEvent){
            //console.log("activityEnded: ",deviceEvent.getEventState(), "lastDeviceEvent", this.lastDeviceEvent);
            //this.closeStatus();
        }
        else{
            //console.log("device activity ended: ", this.lastDeviceEvent);
            this.closeStatus();
        }

    }

    onVerifySignatureRequest(request){
        //console.log("verifySignatureRequest", request);
        this.confirmSignature(request);

    }

    onMessageFromActivity(message){
        console.log("MessageFromActivity", message);
    }

    onManualRefundResponse(response) {
        console.log("manualRefundResponse" , response);
        if(response.result == "SUCCESS"){
            this.setStatus("Refund Successful");
            let refund = new Refund(this.formatter.convertToFloat(response.credit.amount));
            this.store.addRefund(refund);
        }
    }

    onRefundPaymentResponse(response){
        console.log('refundPayment', response);
    }

    onRetrieveDeviceStatusResponse(response){
        console.log("retrieveDeviceStatusResponse", response);
        let status = [];
        status.push("State: "+response.state);
        status.push("ExternalActivityId: "+response.data.customActivityId);
        status.push("Reason: "+response.reason);
        this.setStatus({"title": "Device Status", "data": status});
    }

    onRetrievePaymentResponse(response) {
        console.log(response);
        //let paymentLines = [];
        ////paymentLines += "RetrievePayment: " + (response.isSuccess() ? "Success!" : "Failed!"
        //return ({title: "Payment Details", data: paymentLines});
//    showMessage("RetrievePayment: " + (response.isSuccess() ? "Success!" : "Failed!")
//+ " QueryStatus: " + response.getQueryStatus() + " for id " + response.getExternalPaymentId()
//+ " Payment: " + response.getPayment()
//+ " reason: " + response.getReason(), Toast.LENGTH_LONG);
//}

    };

    onCloseoutResponse(response) {
        console.log(response);
//    if (response.isSuccess()) {
//    showMessage("Closeout is scheduled.", Toast.LENGTH_SHORT);
//} else {
//    showMessage("Error scheduling closeout: " + response.getResult(), Toast.LENGTH_LONG);
//}
    }

    onReadCardDataResponse(response){
        console.log("ReadCardDataResponse", response);
        let cardData = response.cardData;
        let cardDataString = [];
        cardDataString.push("Cardholder Name: "+cardData.cardholderName);
        cardDataString.push("Encrypted: "+cardData.encrypted);
        cardDataString.push("Expiration: "+this.cdh.getExpirationDate(cardData.exp));
        cardDataString.push("First 6: "+cardData.first6);
        cardDataString.push("First Name: "+cardData.firstName);
        cardDataString.push("Last 4: "+cardData.last4);
        cardDataString.push("Last Name: "+cardData.lastName);
        cardDataString.push("Masked Track 1: "+cardData.maskedTrack1);
        cardDataString.push("Masked Track 2: "+cardData.maskedTrack2);
        cardDataString.push("Masked Track 3: "+cardData.maskedTrack3);
        cardDataString.push("Primary Account Number: "+cardData.pan);
        cardDataString.push("Track 1: "+cardData.track1);
        cardDataString.push("Track 2: "+cardData.track2);
        cardDataString.push("Track 3: "+cardData.track3);
        this.setStatus({"title": "Card Data", "data": cardDataString});

    }


    onRetrievePendingPaymentsResponse(response) {
        console.log(response);
        let pending = [];
        if (response.success){
            if(response.pendingPaymentEntries.length < 1){
                pending.push("There are no Pending Payments");
            }
            else{
                response.pendingPaymentEntries.forEach(function(payment){
                    let line = payment.paymentId + " "+this.formatter.formatCurrency(payment.amount);
                    pending.push(line);
                },this);
            }
            this.setStatus({"title": "Pending Payments", "data": pending});
        }
        else{
            this.setStatus("Error Retrieving Pending Payments");
        }

//    if (!response.isSuccess()) {
//    store.setPendingPayments(null);
//    showMessage("Retrieve Pending Payments: " + response.getResult(), Toast.LENGTH_LONG);
//} else {
//    store.setPendingPayments(response.getPendingPayments());
//}


    }


}
