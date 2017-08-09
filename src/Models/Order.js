import CurrencyFormatter from "../components/CurrencyFormatter";
import clover from 'remote-pay-cloud-api';

export default class Order {

    constructor(id) {
        this.id = id;
        this.items = [];
        this.status = "OPEN";
        this.date = new Date();
        this.orderPayments = [];
        this.refunds = [];
        this.formatter = new CurrencyFormatter();
    }

    getId() {
        return this.id;
    }

    getStatus() {
        return this.status;
    }

    setStatus(status) {
        this.status = status;
    }

    addItem(id, title, price){
        let orderItem = this.getOrderItemById(id);
        if(orderItem == null){
            let lineItem = new clover.order.DisplayLineItem();
            lineItem.setId(id);
            lineItem.setName(title);
            lineItem.setPrice(this.formatter.formatCurrency(price));
            lineItem.setQuantity(1);
            this.items.push(lineItem);
        }
        else{
            orderItem.setQuantity(orderItem.quantity + 1);
        }
    }

    getItems(){
        return this.items;
    }

    getOrderItemById(id){
        let orderItem = null;
        this.items.filter(function( obj ) {
            if( obj.id == id){
                orderItem = obj;
            }
        });
        return orderItem;
    }

    getPaymentById(id){
        let payment= null;
        this.payments.filter(function( obj ) {
            if( obj.id == id){
                payment = obj;
            }
        });
        return payment;
    }

    getTotal(){
        return this.calculateTotal();
    }

    getTax(){
        let total = this.getTotal();
        return (total*.07).toFixed(2);
    }

    getTotalwithTax(){
        let total = parseFloat(this.getTotal());
        let tax = parseFloat(this.getTax());
        return (total + tax).toFixed(2);
    }

    calculateTotal(){
        let total = 0;
        this.items.forEach(function(item){
            total += (this.formatter.convertStringToFloat(item.price) * item.quantity);
        }, this);
        return total;
    }

    getDate(){
        return this.date;
    }

    addOrderPayment(orderPayment){
        this.orderPayments.push(orderPayment);
    }

    getOrderPayments(){
        return this.orderPayments;
    }

    getRefunds(){
        return this.refunds;
    }

    addRefund(refund){
        this.refunds.push(refund);
    }
}