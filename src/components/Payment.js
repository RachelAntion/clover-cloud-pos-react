import React from 'react';
import PaymentRow from "./PaymentRow";
import ButtonNormal from "./ButtonNormal";
import Refund from "../Models/Refund";
import CurrencyFormatter from "./../utils/CurrencyFormatter";
import Checkmark from './Checkmark';
import sdk from 'remote-pay-cloud-api';
import clover from 'remote-pay-cloud';

export default class Payment extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showTipAdjust: false,
            showRefund: false,
            tipAmount: 0.00,
        }
        if(this.props.location.state != null){
            this.payment = this.props.location.state.payment;
            if(this.payment.refunds !== undefined){
                this.setState({refund: true});
            }
        }
        console.log(this.state.total);
        this.adjustTip = this.adjustTip.bind(this);
        this.finishAdjustTip = this.finishAdjustTip.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.makeRefund = this.makeRefund.bind(this);
        this.cloverConnector = this.props.cloverConnection.cloverConnector;
        this.formatter = new CurrencyFormatter();
        console.log(this.payment);
    }

    adjustTip(tipAmount){
        console.log("adjust tip");
        this.setState({showTipAdjust : true});
    }

    finishAdjustTip(){
        this.setState({showTipAdjust: false});
        console.log("tip amount", this.state.tipAmount);
        let tempTip = parseFloat(this.state.tipAmount).toFixed(2);
        this.payment.setTipAmount(tempTip);
        console.log(this.payment);
    }

    handleChange (e) {
        this.setState({ tipAmount: e.target.value });
    }

    makeRefund(){
        let _refund = new Refund(this.payment.amount);
        console.log(this.payment);
        this.payment.addRefund(_refund);
        this.payment.setTransactionType("Refund");
        this.setState({ showRefund: true});
        console.log(_refund);

        let refund = new sdk.remotepay.RefundPaymentRequest();
        refund.setAmount(this.formatter.convertFromFloat(this.payment.getTotal()));
        refund.setPaymentId(this.payment.id);
        refund.setOrderId(this.payment.orderId);
        refund.setFullRefund(true);
        console.log('makeRefund', refund);
        this.cloverConnector.refundPayment(refund);
    }

    render(){
        const date = this.payment.date;
        const total = this.formatter.formatCurrency(this.payment.amount);
        const tender = this.payment.tender;
        const cardDetails = this.payment.cardDetails;
        const employee = this.payment.employee;
        const deviceId = this.payment.deviceId;
        const paymentId = this.payment.id;
        const entryMethod = this.payment.entryMethod;
        const transactionType = this.payment.transactionType;
        const transactionState = this.payment.transactionState;
        // let cashBack = this.payment.cashBackAmount;
        // if(cashBack === 0) {
        //     cashBack = "$0.00";
        // }
        let showTips = true;
        let tipText = "Adjust Tip";
        let tipAmount = parseFloat(this.formatter.convertToFloat(this.payment.tipAmount)).toFixed(2);
        if(tipAmount ===0 || tipAmount <= 0){
            showTips = false;
            tipAmount = "0.00";
            tipText = "Add Tip";
        }
        const showRefunds = this.state.showRefund;
        const showTipAdj = this.state.showTipAdjust;
        let absTotal = parseFloat(parseFloat(this.formatter.convertToFloat(this.payment.amount)) + parseFloat(this.formatter.convertToFloat(this.payment.tipAmount))).toFixed(2);
        if(this.state.showRefund){
            absTotal = "$0.00";
        }
        let check = false;
        let status = this.payment.status;
        if(status === "SUCCESS"){
            check = true;
        }

        return(
            <div className="payments">
                <h2>Payment Details</h2>
                <div className="payments_container">
                    <div className="payments_all_details">
                        <div className="payments_list">
                            <div className="paymentDetails">
                                <div className="space_between_row space_under">
                                    <div><strong>Payment</strong></div>
                                    <div className="middle_grow"><strong>{date.toLocaleDateString()}  •  {date.toLocaleTimeString()}</strong></div>
                                    <div><strong>{total}</strong></div>
                                </div>
                                {check && <div className="row"><Checkmark/><div className="payment_successful">Payment successful</div></div>}
                                <div className="payment_details_list">
                                    <PaymentRow left="Tender:" right={tender}/>
                                    <PaymentRow left="Card Details:" right={cardDetails}/>
                                    <PaymentRow left="Employee:" right={employee}/>
                                    <PaymentRow left="Device ID:" right={deviceId}/>
                                    <PaymentRow left="Payment ID:" right={paymentId}/>
                                    <PaymentRow left="Entry Method:" right={entryMethod}/>
                                    <PaymentRow left="Transaction Type:" right={transactionType}/>
                                    <PaymentRow left="Transaction State:" right={transactionState}/>
                                    {/*<PaymentRow left="Cashback:" right={cashBack}/>*/}
                                </div>
                            </div>
                            {showTips &&
                            <div className="payment_section">
                                <div className="space_between_row space_under">
                                    <div><strong>Tip</strong></div>
                                    <div><strong>${tipAmount}</strong></div>
                                </div>
                            </div>}
                            {showRefunds &&
                            <div className="payment_section">
                                {this.payment.refunds.map(function (refund, i) {
                                    return(
                                        <div key={'refund-'+i} className="space_between_row space_under">
                                            <div><strong>Refund</strong></div>
                                            <div className="middle_grow"><strong>{refund.date.toLocaleDateString()}  •  {refund.date.toLocaleTimeString()}</strong></div>
                                            <div><strong>{this.formatter.formatCurrency(refund.amount)}</strong></div>
                                        </div>)
                                }, this)}
                            </div>
                            }
                            <div className="payment_section">
                                <div className="space_between_row space_under">
                                    <div><strong>Total</strong></div>
                                    <div><strong>${absTotal}</strong></div>
                                </div>
                            </div>
                            {showTipAdj && <div className="popup_container popup">
                                <h4>Adjust Tip Amount:</h4>
                                <div className="tip_adjust_input">
                                    <span className="dollar_span">$</span>
                                    <input id="adjustTip" type="number" min="0.01" step="0.01" defaultValue={tipAmount} onChange={this.handleChange}/>
                                </div>
                                <ButtonNormal title="Save" color="white" onClick={this.finishAdjustTip}/>

                            </div>}
                        </div>
                    </div>
                    <div className="column">
                        <ButtonNormal title="Refund" color="red" extra="add_tip" onClick={this.makeRefund}/>
                        <ButtonNormal title="Void Payment" color="white" extra="add_tip" onClick={this.adjustTip}/>
                        <ButtonNormal title={tipText} color="white" extra="add_tip" onClick={this.adjustTip}/>
                    </div>
                </div>
            </div>
        );
    }
}