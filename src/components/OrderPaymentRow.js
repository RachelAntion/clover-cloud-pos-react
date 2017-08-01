import React from 'react';
// import CurrencyFormatter from "./CurrencyFormatter";

export default class OrderPaymentRow extends React.Component {

    constructor(props) {
        super(props);
        this.orderPayment = this.props.orderPayment;
        this.order = this.props.order;
        console.log("orderpayment" , this.orderPayment);
        // this.formatter = new CurrencyFormatter();
    }

    render(){
        const status = this.orderPayment.status;
        const id = this.orderPayment.id;
        const total = this.orderPayment.amount;
        let tip = this.orderPayment.tipAmount;
        const onClick = this.props.onClick;
        if(tip === 0){
            tip = "0.00";
        }
        return (
            <div className="order_item_row" onClick={() => {onClick(this.orderPayment)}}>
                <div className="order_row_left">
                    <div>{status}</div>
                    <div>{id}</div>
                </div>
                <div className="order_row_right">
                    <div><strong>${total}</strong></div>
                    <div>Tip:   ${tip}</div>
                </div>
            </div>
        )
    }
}
