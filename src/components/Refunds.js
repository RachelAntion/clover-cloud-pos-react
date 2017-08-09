import React from 'react';
import ButtonNormal from "./ButtonNormal";
import Refund from "../Models/Refund";
import TitleBar from "./TitleBar";
import RefundRow from "./RefundRow";

export default class Refunds extends React.Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.makeRefund = this.makeRefund.bind(this);
        this.store = this.props.store;
        this.state = {
            refundAmount: 0.00,
            refunds : this.store.getRefunds(),
        };
        console.log(this.state.refunds);
    }

    handleChange(e){
        this.setState({ refundAmount: e.target.value });
    }

    makeRefund(){
        let refund = new Refund(this.state.refundAmount);
        this.store.addRefund(refund);
        this.setState({refunds : this.store.getRefunds()});
        document.getElementById("refund_input").value = "0.00";

    }

    render(){
        let refunds = this.state.refunds;
        return(
            <div className="refunds">
                <div className="make_refund">
                <div>Enter the Refund Amount:</div>
                <span className="dollar_span_refund">$</span>
                <input id="refund_input" className="refund_input" type="text" defaultValue="0.00" onChange={this.handleChange}/>
                <ButtonNormal extra="refund_button" title="Make Refund" color="white" onClick={this.makeRefund} />
                </div>
                <TitleBar title="Refunds"/>
                {refunds.map(function (refund, i) {
                    return <RefundRow key={'refund-'+i} refund={refund}/>
                }, this)}
            </div>
        );
    }
}