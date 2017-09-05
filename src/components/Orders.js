import React from 'react';
import TitleBar from "./TitleBar";
import OrderRow from "./OrderRow";
import OrderItemRow from "./OrderItemRow";
import OrderPaymentRow from "./OrderPaymentRow";
import { browserHistory } from 'react-router';

export default class Orders extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            order: null,
            orderItems: [],
            orderPayments: []
        }
        this.store = this.props.store;
        this.orders = this.store.getOrders();
        this.showOrderDetails = this.showOrderDetails.bind(this);
        this.goToPayment = this.goToPayment.bind(this);
        //console.log("store",this.store);
        //console.log("orders", this.orders);
    }

    showOrderDetails(id){
        let order = this.store.getOrderById(id);
        if(order !== null){
            this.setState({order: order, orderItems:order.getDisplayItems(), orderPayments:order.getOrderPayments()});
        }

    }

    goToPayment(orderPayment){
        browserHistory.push({pathname: '/payment', state : {payment : orderPayment}});
    }

    render(){
        let discounts = false;
        let discount = null;
        if(this.state.order != null && this.state.order.getDiscount() !== null){
            discounts = true;
            discount = this.state.order.getDiscount();
        }

        return(
            <div className="orders">
                <div className="column">
                    <div className="orders_list">
                        <TitleBar title="Orders"/>
                        {this.orders.map(function (order, i) {
                            return <OrderRow key={'order-'+i} order={order} onClick={this.showOrderDetails}/>
                        }, this)}
                    </div>
                    <div className="order_items_and_payments">

                        <div className="order_items container_left">
                            <TitleBar title="Order Items"/>
                            {this.state.orderItems.map(function (orderItem, i) {
                                return <OrderItemRow key={'order_orderItem-'+i} orderItem={orderItem}/>
                            })}
                            {discounts &&
                            <div className="order_item_row"><strong>Discount: </strong>{discount.name}</div>
                            }
                        </div>

                        <div className="order_payments container_right">
                            <TitleBar title="Transactions"/>
                            {this.state.orderPayments.map(function (orderPayment, i) {
                                return <OrderPaymentRow key={'order_orderPayment-'+i} order={this.state.order} orderPayment={orderPayment} onClick={this.goToPayment}/>
                            },this)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}