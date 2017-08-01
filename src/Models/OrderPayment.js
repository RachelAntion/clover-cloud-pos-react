export default class OrderPayment {

    constructor(id) {
        this.id = id;
        this.status = "OPEN";
        this.amount = 0.00;
        this.tipAmount = 0.00;
        this.date = new Date();
        this.tender="Credit Card";
        this.transactionType = '';
        this.cardDetails = "EBT 3453";
        this.employee = "Employee";
        this.deviceId = "C03458DF83458";
        this.transactionState="CLOSED";
        this.externalPaymentId;
        this.refunds = [];
        // this.cashBackAmount = 0.00;
        this.entryMethod = "SWIPED";
    }

    getId(){
        return this.id;
    }

    setStatus(status){
        this.status = status;
    }

    getStatus(){
        return this.status;
    }

    setAmount(amount){
        this.amount = amount;
    }

    getAmount() {
        return this.amount;
    }

    setTipAmount(tipAmount){
        this.tipAmount = tipAmount;
    }

    getTipAmount(){
        return this.tipAmount;
    }

    getTender(){
        return this.tender;
    }

    setTender(tender){
        this.tender = tender;
    }

    getTransactionType(){
        return this.transactionType;
    }

    setTransactionType(transactionType){
        this.transactionType = transactionType;
    }

    getTotal(){
        return (parseFloat(this.amount) + parseFloat(this.tipAmount)).toFixed(2);
    }

    addRefund(refund){
        this.refunds.push(refund);
    }
}