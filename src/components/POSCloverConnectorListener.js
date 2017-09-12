import React from 'react';
import Refund from "../Models/Refund";
import clover from 'remote-pay-cloud-api';
import OrderPayment from "../Models/OrderPayment";
import VaultedCard from "../Models/VaultedCard";
import PreAuth from "../Models/PreAuth";
import CustomerInfo from "../Models/CustomerInfo";
import Rating from "../messages/Rating";
import RatingsMessage from "../messages/RatingsMessage";
import ConversationQuestionMessage from "../messages/ConversationQuestionMessage";
import ConversationResponseMessage from "../messages/ConversationResponseMessage";
import MessageToActivity from "../messages/MessageToActivity";
import CustomerInfoMessage from "../messages/CustomerInfoMessage";
import CurrencyFormatter from "./../utils/CurrencyFormatter";
import CardDataHelper from "./../utils/CardDataHelper";
import Layout from "../components/Layout";

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

        this.CUSTOM_ACTIVITY_PACKAGE = "com.clover.cfp.examples.";
    }


    onReady(merchantInfo){
        console.log('onReady :', merchantInfo);
        this.store.setStoreName(merchantInfo.merchantName);
    }


    onConfirmPaymentRequest(request) {
        console.log("confirmPayment :",request);
        if(request.challenges.length > 0 && request.payment !== null){
            this.challenge(request.challenges[0], request);
        }
        else{
            console.error("Error: The ConfirmPaymentRequest was missing the payment and/or challenges.");
        }
    }

    onSaleResponse(response) {
        console.log('SaleResponse', response);
        if(response !== null) {
            if (!response.isSale) {
                this.setStatus("Response was not a sale", response.reason);
                if (response.payment.offline) {
                    this.cloverConnector.showWelcomeScreen();
                    let currentOrder = this.store.currentOrder;
                    let orderPayment = this.createOrderPayment(response.payment);
                    currentOrder.addOrderPayment(orderPayment);
                    if (response.result === 'SUCCESS') {
                        currentOrder.setStatus("Pending");
                    }
                    this.setStatus("Sale Processed Successfully");
                }
                else {
                    console.error("Response is not an sale!");
                    console.error(response);
                }
            }
            else {
                if (this.store.getCurrentOrder().getPendingPaymentId() === response.payment.externalPaymentId) {
                    this.cloverConnector.showWelcomeScreen();
                    let currentOrder = this.store.currentOrder;
                    let orderPayment = this.createOrderPayment(response.payment);
                    currentOrder.addOrderPayment(orderPayment);
                    if (response.result === 'SUCCESS') {
                        currentOrder.setStatus("PAID");
                    }
                    this.setStatus("Auth Processed Successfully");
                }
                else {
                    this.setStatus("External Id's Do Not Match");
                }
            }
        }
        else{
            console.error("Error: Null SaleResponse");
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
        orderPayment.cardType = payment.cardTransaction.cardType;
        orderPayment.transactionState = payment.cardTransaction.state;
        orderPayment.externalPaymentId = payment.externalPaymentId;
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
    }

    onVaultCardResponse(response) {
        console.log("Vault Card Response", response);
        let card = response.getCard();
        if (card !== undefined) {
            this.store.addCard(new VaultedCard(card));
            this.setStatus('Card Successfully Vaulted', "Toggle");
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
            let payment = this.createOrderPayment(_payment);
            payment.setTipAmount(tip);
            payment.setCashback(cashback);
            this.setPaymentStatus(payment, response);
            this.store.setPreAuth(new PreAuth(response, payment));
            this.store.setPreAuthPaymentId(_payment.id);
            this.setStatus("PreAuth Successful", "Toggle");
        }
        else{
            this.setStatus("External Id's Do Not Match", "Toggle");
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
        if (response.result === 'SUCCESS') {
            this.store.getCurrentOrder().setStatus("PAID");
        }
        this.setStatus("Sale successfully processed using Pre Authorization");
        this.cloverConnector.showWelcomeScreen();
    }

    onDeviceActivityStart(deviceEvent) {
        this.lastDeviceEvent = deviceEvent.getEventState();
        console.log("DeviceEvent", deviceEvent);
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
        else if(deviceEvent.getEventState() !== undefined){
            //console.log("device activity ended: ", this.lastDeviceEvent, deviceEvent);
            //console.log("calling closeStatus");
            this.closeStatus();
        }

    }

    onVerifySignatureRequest(request){
        this.confirmSignature(request);
    }

    onCustomActivityResponse(response) {
        console.log("onCustomActivityResponse", response);
        if (response.success) {
            this.setStatus("Success! Got: " + response.payload + " from CustomActivity: " + response.action, "Toggle");
        }
        else {
            if (response.result  === "CANCEL"){
                this.setStatus("Custom activity: " + response.action + " was canceled.  Reason: " + response.reason, "Toggle");
            }
            else{
                this.setStatus("Failure! Custom activity: " + response.action + " failed.  Reason: " + response.reason, "Toggle");
            }
        }
    }

    onMessageFromActivity(message){
        console.log("MessageFromActivity", message);
        let payload = JSON.parse(message.payload);
        console.log(payload.messageType);
        switch (payload.messageType) {
            case "REQUEST_RATINGS":
                this.handleRequestRatings();
                break;
            case "RATINGS":
                this.handleRatings(payload);
                break;
            case "PHONE_NUMBER":
                this.handleCustomerLookup(payload);
                break;
            case "CONVERSATION_RESPONSE":
                this.handleJokeResponse(payload);
                break;
            default:
                console.log(payload.payloadClassName);
        }
    }

    handleJokeResponse(payload) {
        let jokeResponseMessage = new ConversationResponseMessage(payload.message);
        this.setStatus("Received response of: " + jokeResponseMessage.message, "Toggle");
    }

    handleCustomerLookup(payload) {
        console.log("handleCustomerLookup", payload);
        let phoneNumber = payload.phoneNumber;
        console.log("Just received phone number " + phoneNumber + " from the Ratings remote application.", 3000);
        console.log("Sending customer name Ron Burgundy to the Ratings remote application for phone number " + phoneNumber, 3000);
        let customerInfo = new CustomerInfo();
        customerInfo.customerName = "Ron Burgundy";
        customerInfo.phoneNumber = phoneNumber;
        let customerInfoMessage = new CustomerInfoMessage(customerInfo);
        console.log(customerInfoMessage);
        let customerInfoJson = JSON.stringify(customerInfoMessage);
        console.log(customerInfoJson);
        this.sendMessageToActivity("com.clover.cfp.examples.RatingsExample", customerInfoJson);
    }

    handleRatings(payload){
        console.log("handleRatings");
        //let RatingsMessage = (RatingsMessage)PayloadMessage.fromJsonString(payload);
        let ratingsMessage = new RatingsMessage(JSON.stringify(payload));
        let ratingsPayload = ratingsMessage.ratings;
        Layout.setStatus(payload);
        //this.showRatingsDialog(ratingsPayload);
    }

    handleRequestRatings() {
        console.log("handleRequestRatings");
        let rating1 = new Rating();
        rating1.id = "Quality";
        rating1.question = "How would you rate the overall quality of your entree?";
        rating1.value = 0;
        let rating2 = new Rating();
        rating2.id = "Server";
        rating2.question = "How would you rate the overall performance of your server?";
        rating2.value = 0;
        let rating3 = new Rating();
        rating3.id = "Value";
        rating3.question = "How would you rate the overall value of your dining experience?";
        rating3.value = 0;
        let rating4 = new Rating();
        rating4.id = "RepeatBusiness";
        rating4.question = "How likely are you to dine at this establishment again in the near future?";
        rating4.value = 0;
        let ratings = [rating1, rating2, rating3, rating4];
        let ratingsMessage = new RatingsMessage(ratings);
        let ratingsListJson = JSON.stringify(ratingsMessage);
        this.sendMessageToActivity("com.clover.cfp.examples.RatingsExample", ratingsListJson);
    }

    sendMessageToActivity(activityId, payload) {
        let messageRequest = new MessageToActivity(activityId, payload);
        this.cloverConnector.sendMessageToActivity(messageRequest);
    }

    onManualRefundResponse(response) {
        console.log("manualRefundResponse" , response);
        if(response.result == "SUCCESS"){
            this.setStatus("Manual Refund Successful", "Toggle");
            let refund = new Refund(this.formatter.convertToFloat(response.credit.amount));
            this.store.addRefund(refund);
        }
    }

    onRefundPaymentResponse(response){
        console.log('refundPaymentResponse', response);
        if(response.result === "SUCCESS") {
            let refund = new Refund(response.refund.amount);
            let payment = this.store.getPaymentByCloverId(response.paymentId);
            payment.addRefund(refund);
            payment.setTransactionType("Refund");
            console.log(payment);
            this.setStatus("Refund Processed Successfully", "Toggle");
        }
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
        console.log("onRetrievePaymentResponse", response);
        let date = new Date(response.payment.createdTime);
        let paymentLines = [];
        paymentLines.push("Retrieve Payment: " + (response.success ? "Success!" : "Failed!"));
        paymentLines.push("Query Status: "+ response.queryStatus);
        paymentLines.push("Reason: "+response.reason);
        paymentLines.push("**************************************************");
        paymentLines.push("PAYMENT");
        paymentLines.push("Result: "+response.payment.result);
        paymentLines.push("    Amount: "+this.formatter.formatCurrency(response.payment.amount));
        paymentLines.push("    Date: " + date.toLocaleDateString()+" "+date.toLocaleTimeString());
        console.log(paymentLines);
        this.setStatus({title: "Payment Details", data: paymentLines});
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
        let cardDataString = this.cdh.getCardDataArray(cardData);
        console.log(cardDataString);
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
            this.setStatus("Error Retrieving Pending Payments", "Toggle");
        }
    }


}
