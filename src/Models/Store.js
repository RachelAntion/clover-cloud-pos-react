import clover from 'remote-pay-cloud';

export default class Store {

    constructor() {
        this.cardEntryMethods = clover.CardEntryMethods.DEFAULT;
        this.availableItems = [];
        this.orders = [];
        this.card = null;
        this.credits = [];
        this.preAuths = [];
        this.transactions = [];
        this.refunds = [];

    }

    getOrderById(id){
        let order = null;
        this.orders.filter(function( obj ) {
            if( obj.id == id){
                order = obj;
            }
        });
        return order;
    }

    getOrders(){
        return this.orders;
    }

    getTransactions(){
        this.transactions = [];
        this.orders.forEach(function(order){
            this.transactions.push(order.getOrderPayments());
        }, this);
        return this.transactions;
    }

    getItems(){
        return this.availableItems;
    }

    addItem(item){
        this.availableItems.push(item);
    }

    getOrders(){
        return this.orders;
    }

    addOrder(order){
        this.orders.push(order);
    }

    getCard(){
        return this.card;
    }

    addCard(card){
        this.card = card;
    }

    getCredits(){
        return this.credits;
    }

    addRefund(refund){
        this.credits.push(refund);
    }

    getPreAuths(){
        return this.preAuths;
    }

    addPreAuth(preAuth){
        this.preAuths.push(preAuth);
    }

    getRefunds(){
        return this.refunds;
    }

    addRefund(refund){
        this.refunds.push(refund);
    }




}
