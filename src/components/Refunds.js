import React from 'react';
import ButtonNormal from "./ButtonNormal";

export default class Refunds extends React.Component {
    render(){

        return(
            <div className="refunds">
                <div>Enter the Refund Amount</div>
                <span className="dollar_span_refund">$</span>
                <input className="refund_input" type="text" defaultValue="0.00"/>
                <ButtonNormal title="Make Refund" color="white"/>
            </div>
        );
    }
}