import React from 'react';
// import CurrencyFormatter from "./CurrencyFormatter";

export default class OrderItemRow extends React.Component {

    constructor(props) {
        super(props);
        this.orderItem = this.props.orderItem;
        // this.formatter = new CurrencyFormatter();
    }

    render(){
        const quantity = this.orderItem.quantity;
        const itemName = this.orderItem.item.title;
        const orderTotal = this.orderItem.calculateTotal();
        return (
            <div className="order_item_row">
                <div>{quantity}</div>
                <div>{itemName}</div>
                <div>${orderTotal}</div>
            </div>
        )
    }
}
