import React from 'react';
// import CurrencyFormatter from "./CurrencyFormatter";

export default class TransactionRow extends React.Component {

    constructor(props) {
        super(props);
        this.transaction = this.props.transaction[0];
        console.log(this.transaction);
        // this.formatter = new CurrencyFormatter();
    }

    render(){
        const date = this.transaction.date.toLocaleDateString();
        const time = this.transaction.date.toLocaleTimeString();
        const paymentId = this.transaction.id;
        let total = this.transaction.getTotal();
        let displayTotal = "$" +total;
        const tender = this.transaction.tender;
        const cardDetails = this.transaction.cardDetails;
        const employee = this.transaction.employee;
        const onClick = this.props.onClick;
        let paymentType = this.transaction.transactionType;
        if(paymentType == 'Sale'){
            paymentType = "Payment";
        }
        else if (paymentType == 'Refund'){
            displayTotal=(<span className="red_text">(${total})</span>);
        }

        return (
            <div className="transaction_row" onClick={() => {onClick(this.transaction)}}>
                <div className="transaction_row_column">
                    <div><strong>{time}</strong></div>
                    <div>{date}</div>
                </div>
                <div className="transaction_row_column">
                    <div>{paymentType}</div>
                    <div>{paymentId}</div>
                </div>
                <div className="transaction_row_column">
                    <div> {displayTotal}</div>
                </div>
                <div className="transaction_row_column">
                    <div>{tender}</div>
                    <div>{cardDetails}</div>
                </div>
                <div className="transaction_row_column last_item">
                    <div>
                        {employee}
                    </div>
                </div>
            </div>
        )
    }
}
