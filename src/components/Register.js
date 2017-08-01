import React from 'react';
import ButtonNormal from "./ButtonNormal";
import RegisterLine from "./RegisterLine";
import AvailableItem from "./AvailableItem";
const data = require ("../../src/items.js");
import Order from '../Models/Order';
import Item from '../Models/Item';
import CurrencyFormatter from "./CurrencyFormatter";
import OrderPayment from "../Models/OrderPayment";
import RegisterLineItem from "./RegisterLineItem";

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderItems: [],
            showPaymentMethod: false,
            areVaultedCards: true,
            subtotal : 0,
            showNewOrder : false,
            preAuthChosen: false,
            tax: 0,
            total: 0,
        };
        this.addToOrder = this.addToOrder.bind(this);
        this.newOrder = this.newOrder.bind(this);
        this.choosePaymentMethod = this.choosePaymentMethod.bind(this);
        this.closePaymentMethods = this.closePaymentMethods.bind(this);
        this.saleChosen = this.saleChosen.bind(this);
        this.authChosen = this.authChosen.bind(this);
        this.cardChosen = this.cardChosen.bind(this);
        this.vaultedCardChosen = this.vaultedCardChosen.bind(this);
        this.preAuthChosen = this.preAuthChosen.bind(this);
        this.closeNewOrder = this.closeNewOrder.bind(this);
        this.closePreAuth = this.closePreAuth.bind(this);
        this.choosePreAuth = this.choosePreAuth.bind(this);
        this.openPreAuth = this.openPreAuth.bind(this);
        // console.log("Register: ", this.props);
        this.saleMethod = null;
        if(this.props.location.state != null){
            this.saleMethod = this.props.location.state.saleType;
        }
        this.orderId = 1;
        this.paymentId = 1;
        this.order = new Order(this.orderId);
        this.formatter = new CurrencyFormatter;
        // console.log(this.order.getItems());
    }

    // showNewOrder(){
    //     this.setState({ showNewOrder: true });
    // }

    closeNewOrder(){
        this.setState({ showNewOrder: false });
    }

    closePreAuth(){
        this.setState({ preAuthChosen : false});
    }

    addToOrder(id, title, price) {
        this.order.addItem(new Item(id, title, price));
        this.setState({
            orderItems:this.order.getItems(),
            subtotal:this.order.getTotal(),
            tax: this.order.getTax(),
            total: this.order.getTotalwithTax()
        });
    }

    newOrder(){
        if(this.state.orderItems.length > 0) {
            this.props.store.addOrder(this.order);
            this.orderId++;
            this.order = new Order(this.orderId);
            this.setState({orderItems: this.order.getItems(), subtotal: 0.00, tax: 0.00, total: 0.00, showNewOrder: true});
        }
        // console.log("new order",this.order);
    }

    choosePaymentMethod(){
        console.log("choose your payment method!");
        this.setState({showPaymentMethod: true});
    }

    closePaymentMethods(){
        this.setState({showPaymentMethod: false});
    }

    saleChosen(){
        console.log("Sale was chosen");
       this.saleMethod ='Sale';
       this.closeNewOrder();
    }

    authChosen(){
        console.log("Auth was chosen");
        this.saleMethod = "Auth";
        this.closeNewOrder();

    }

    choosePreAuth(){
        console.log("preAuth was chosen");
        this.closeNewOrder();
        this.setState({ preAuthChosen : true});
    }

    openPreAuth(){
        console.log("opening preauth");
        this.saleMethod = "PreAuth";
        this.setState({ preAuthChosen : false});
    }

    cardChosen(){
        console.log("card chosen");
        let orderPayment = new OrderPayment(this.paymentId);
        this.paymentId++;
        orderPayment.setStatus("PAID");
        orderPayment.setAmount(this.state.total);
        orderPayment.setTransactionType(this.saleMethod);
        this.order.addOrderPayment(orderPayment);
        this.order.setStatus("PAID");
        this.newOrder();
        this.closePaymentMethods();
    }

    vaultedCardChosen(){
        console.log("vaulted card chosen");
        let orderPayment = new OrderPayment(this.paymentId);
        this.paymentId++;
        orderPayment.setStatus("PAID");
        orderPayment.setAmount(this.state.total);
        orderPayment.setTransactionType(this.saleMethod);
        this.order.addOrderPayment(orderPayment);
        this.order.setStatus("PAID");
        this.newOrder();
        this.closePaymentMethods();
    }

    preAuthChosen(){
        console.log("preauth chosen");
        let orderPayment = new OrderPayment(this.paymentId);
        this.paymentId++;
        orderPayment.setStatus("PAID");
        orderPayment.setAmount(this.state.total);
        orderPayment.setTransactionType("PreAuth");
        orderPayment.setTender(this.saleMethod);
        this.order.addOrderPayment(orderPayment);
        this.order.setStatus("PAID");
        this.newOrder();
        this.closePaymentMethods();
    }

    render(){
        const showPayMethods = this.state.showPaymentMethod;
        let newOrder;
        let cardText = "Card";
        let showVaultedCard = this.state.areVaultedCards;
        let showPreAuth = false;
        if(this.saleMethod != null){
            if(this.saleMethod === 'Sale'){
                newOrder = 'New Sale';
            }
            else if(this.saleMethod === 'Auth'){
                newOrder = 'New Authorization'
            }
            else if(this.saleMethod === 'PreAuth'){
                newOrder = 'New Pre Authorization'
                showPreAuth = true;
                showVaultedCard = false;
                cardText = "Other Card"
            }
        }
        let orderItems = this.state.orderItems;

        const subtotal = "$"+parseFloat(this.state.subtotal).toFixed(2);
        const tax = "$"+parseFloat(this.state.tax).toFixed(2);
        const total = "$"+parseFloat(this.state.total).toFixed(2);
        const newOrderPopup = this.state.showNewOrder;
        const preAuthPopup = this.state.preAuthChosen;
        return(

            <div className="register">
                {newOrderPopup &&
                <div className="popup_container popup">
                    <div className="close_popup" onClick={this.closeNewOrder}>x</div>
                    <div className="new_order_types">
                        <ButtonNormal title="Sale" onClick={this.saleChosen} extra="button_large" color="white"/>
                        <ButtonNormal title="Auth" onClick={this.authChosen} extra="button_large" color="white"/>
                        <ButtonNormal title="PreAuth" onClick={this.choosePreAuth} extra="button_large" color="white"/>
                    </div>
                </div>}
                {preAuthPopup &&
                <div className="preauth_popup popup">
                    Please swipe your card
                    <div className="preauth_button_row">
                        <ButtonNormal title="Cancel" color="red" onClick={this.closePreAuth} extra="preauth_button"/>
                        <ButtonNormal title="Card Swiped" color="white" onClick={this.openPreAuth} extra="preauth_button"/>
                    </div>
                </div>}
                {showPayMethods &&
                <div className="popup_container popup">
                    <div className="close_popup" onClick={this.closePaymentMethods}>x</div>
                    <div className="payment_methods">
                        <ButtonNormal title={cardText} onClick={this.cardChosen} extra="button_large" color="white"/>
                        {showVaultedCard && <ButtonNormal title="Vaulted Card" onClick={this.vaultedCardChosen} extra="button_large" color="white"/>}
                        {showPreAuth && <ButtonNormal title="Existing PreAuth" onClick={this.preAuthChosen} extra="button_large" color="white"/>}
                    </div>
                </div>}
                <div className="register_left">
                    <h2>{newOrder}</h2>
                    <div className="register_sale_items">
                        <h3>Current Order: </h3>
                        <div className="order_items">
                            {orderItems.map(function (orderItem, i) {
                                return <RegisterLineItem key={'orderItem-'+i} quantity={orderItem.quantity}  title={orderItem.item.title} price={this.formatter.formatCurrency(orderItem.item.price)}/>
                            }, this)}
                        </div>
                    </div>
                    <div className="register_actions">

                        <RegisterLine left="Subtotal:" right={subtotal}/>
                        <RegisterLine left="Discounts:"/>
                        <RegisterLine left="Tax:" right={tax}/>
                        <RegisterLine left="Total:" right={total} extraLeft="total"/>
                        <div className="register_buttons">
                            <ButtonNormal title="Save" color="green" extra="register_button left" onClick={this.newOrder}/>
                            <ButtonNormal title="Pay" color="green" extra="register_button right" onClick={this.choosePaymentMethod}/>
                        </div>
                    </div>
                </div>
                <div className="register_right">
                    <div className="register_items">
                        {data.map((item, i) => {
                            return <AvailableItem key={'item-'+i} id={item.id} title={item.title} itemPrice={item.itemPrice} onClick={this.addToOrder}/>
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

