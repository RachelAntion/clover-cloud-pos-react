import React from 'react';
import ButtonNormal from "./ButtonNormal";

export default class RecoveryOptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPaymentPopup : false,
            keepPaymentPopupOpen: false,
        };
        this.addPaymentID = this.addPaymentID.bind(this);
        this.closePaymentID = this.closePaymentID.bind(this);
        this.buttonPop = this.buttonPop.bind(this);
        console.log("Recovery Options: ", this.props);
    }

    addPaymentID(){
        console.log("add was called");
        this.setState({ showPaymentPopup: true});
    }

    closePaymentID(){
        console.log("close was called");
        this.setState({ showPaymentPopup : false});
    }

    buttonPop(){
        console.log("I WAS CLICKED SON");
    }

    render(){
        let showPaymentId = this.state.showPaymentPopup;
        return(
            <div className="recovery_options">
                {showPaymentId? (
                    <div className="enter_payment_id popup">
                        <div className="close_popup" onClick={this.closePaymentID}>x</div>
                        <div className="payment_id_body">
                            <div>Enter Payment ID:</div>
                            <div className="payment_id_entry">
                                <input type="text"  />
                                <button onClick={this.closePaymentID}>Lookup</button>
                            </div>
                        </div>
                    </div>
                ):(
                    <div/>
                )}
                <h2>Recovery Options</h2>
                <ButtonNormal title="Reset" color="white" extra="button_large"/>
                <ButtonNormal title="Payment by ID" color="white" extra="button_large" onClick={this.addPaymentID}/>
                <ButtonNormal title="Pending Payments" color="white" extra="button_large"/>
                <ButtonNormal title="Device Status" color="white" extra="button_large"/>
                <ButtonNormal title="Device Status (w/message resend)" color="white" extra="button_large"/>
            </div>
        );
    }
}