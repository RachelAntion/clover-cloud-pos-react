import React from 'react';
// import CurrencyFormatter from "./CurrencyFormatter";

export default class OrderRow extends React.Component {

    constructor(props) {
        super(props);
        this.order = this.props.order;
        // this.formatter = new CurrencyFormatter();
    }

    render(){
        const orderId = this.order.id;
        const orderStatus = this.order.status;
        const orderDate = this.order.date;
        // const totalWTax = this.formatter.formatCurrency(this.order.getTotalwithTax());
        // const total = this.formatter.formatCurrency(this.order.getTotal());
        // const tax = this.formatter.formatCurrency(this.order.getTax());
        const totalWTax = this.order.getTotalwithTax();
        const total = this.order.getTotal();
        const tax = this.order.getTax();
        const onClick = this.props.onClick;

        return (
            <div className="order_row" onClick={() => {onClick(orderId)}}>
                <div className="order_row_left">
                    <div>{orderId}</div>
                    <div>{orderStatus}</div>
                </div>
                <div className="order_row_middle">
                    {orderDate.toLocaleDateString()}  {orderDate.toLocaleTimeString()}
                </div>
                <div className="order_row_right">
                    <div>
                        <div className="order_grand_total"><strong>${totalWTax}</strong></div>
                        <div>Subtotal:  ${total}</div>
                        <div>Tax:   ${tax}</div>
                    </div>
                </div>
            </div>
        )
    }
}
