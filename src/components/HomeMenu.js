import React from 'react';
import { browserHistory, Link } from 'react-router';
import ButtonNormal from "./ButtonNormal";

export default class HomeMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // showNewOrder : false,
            // preAuthChosen: false,
            redirect : false,
        };
        this.store = this.props.store;
        this.cloverConnector = this.props.cloverConnection.cloverConnector;
        this.setStatus = this.props.setStatus;
        this.vaultCard = this.vaultCard.bind(this);
        console.log("HomeMenu: ", this.props);
    }

    // showNewOrder(){
    //     this.setState({ showNewOrder: true });
    // }
    //
    // closeNewOrder(){
    //     this.setState({ showNewOrder: false });
    // }
    //
    // closePreAuth(){
    //     this.setState({ preAuthChosen : false});
    // }
    //
    // saleChosen(){
    //     console.log("Sale was chosen");
    //     browserHistory.push({pathname: '/register', state : {saleType : 'Sale'}});
    // }
    //
    // authChosen(){
    //     console.log("Auth was chosen");
    //     browserHistory.push({pathname: '/register', state : {saleType : 'Auth'}});
    //
    // }
    //
    // preAuthChosen(){
    //     console.log("preAuth was chosen");
    //     this.closeNewOrder();
    //     this.setState({ preAuthChosen : true});
    //     // browserHistory.push({pathname: '/preauth', state : {saleType : 'preauth'}});
    // }
    //
    // openPreAuth(){
    //     console.log("opening preauth");
    //     browserHistory.push({pathname: '/register', state : {saleType : 'PreAuth'}});
    // }

    vaultCard(){
        this.setStatus('Customer is Vaulting Card....');
        this.cloverConnector.vaultCard(this.store.cardEntryMethods);
        browserHistory.push({pathname: '/register', state : {saleType : 'Vaulted'}});
    }


    render(){
        // const newOrderPopup = this.state.showNewOrder;
        // const preAuthPopup = this.state.preAuthChosen;

        return(
            <div className="home_menu">
                {/*{newOrderPopup &&*/}
                {/*<div className="popup_container popup">*/}
                {/*<div className="close_popup" onClick={this.closeNewOrder}>x</div>*/}
                {/*<div className="new_order_types">*/}
                {/*<ButtonNormal title="Sale" onClick={this.saleChosen} extra="button_large" color="white"/>*/}
                {/*<ButtonNormal title="Auth" onClick={this.authChosen} extra="button_large" color="white"/>*/}
                {/*<ButtonNormal title="PreAuth" onClick={this.preAuthChosen} extra="button_large" color="white"/>*/}
                {/*</div>*/}
                {/*</div>}*/}
                {/*{preAuthPopup &&*/}
                {/*<div className="preauth_popup popup">*/}
                {/*Please swipe your card*/}
                {/*<div className="preauth_button_row">*/}
                {/*<ButtonNormal title="Cancel" color="red" onClick={this.closePreAuth} extra="preauth_button"/>*/}
                {/*<ButtonNormal title="Card Swiped" color="white" onClick={this.openPreAuth} extra="preauth_button"/>*/}
                {/*</div>*/}
                {/*</div>}*/}
                <Link to="/register">
                    <ButtonNormal title="New Order" color="white" extra="button_large"/>
                </Link>
                <Link to="/preauth">
                    <ButtonNormal title="New Tab (PreAuth)" color="white" extra="button_large"/>
                </Link>
                <Link to="/orders">
                    <ButtonNormal title="View Orders" color="white" extra="button_large"/>
                </Link>
                <ButtonNormal title="Vault Card" color="white" extra="button_large" onClick={this.vaultCard}/>
                <Link to="/refunds">
                    <ButtonNormal title="Manual Refunds / Credits" color="white" extra="button_large"/>
                </Link>
                <Link to="/transactions">
                    <ButtonNormal title="Transactions" color="white" extra="button_large"/>
                </Link>
                <Link to="/custom-activities">
                    <ButtonNormal title="Custom Activities" color="white" extra="button_large"/>
                </Link>
                <Link to="/device">
                    <ButtonNormal title="Device" color="white" extra="button_large"/>
                </Link>
                <Link to="/recovery-options">
                    <ButtonNormal title="Recovery Options" color="white" extra="button_large"/>
                </Link>
            </div>
        );
    }
}