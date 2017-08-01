import OrderItem from "./OrderItem";
import CurrencyFormatter from "../components/CurrencyFormatter";

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

    addItem(item){
        let orderItem = this.getOrderItemById(item.id);
        if(orderItem == null){
            this.items.push(new OrderItem(item,this.id));
        }
        else{
            orderItem.incrementQuantity(1);
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
            total += (item.item.price * item.quantity);
        }, this);
        return this.formatter.convertToFloat(total);
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