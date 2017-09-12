import React from 'react';
import { browserHistory, Link } from 'react-router';
import ButtonNormal from "./ButtonNormal";
import clover from 'remote-pay-cloud';
import sdk from 'remote-pay-cloud-api';
import CurrencyFormatter from "./../utils/CurrencyFormatter";

export default class HomeMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // showNewOrder : false,
            // preAuthChosen: false,
            redirect : false,
        };
        this.store = this.props.store;
        this.cloverConnector = this.props.cloverConnection.cloverConnector;''
        this.setStatus = this.props.setStatus;
        this.preAuth = this.preAuth.bind(this);
        this.formatter = new CurrencyFormatter;
        //console.log("HomeMenu: ", this.props);
    }

    preAuth(){
        browserHistory.push({pathname: '/register', state : {saleType : 'PreAuth'}});
    }

    render(){
        return(
            <div className="home_menu">
                <div className="home_row">
                    <Link to="/register">
                        <div className="home_button">
                            <div className="home_title">New Order</div>
                            <img className="home_icon" src={'images/new_order.png'}/>
                        </div>
                    </Link>
                    <div className="home_button">
                        <div className="home_title">New Tab (PreAuth)</div>
                        <img className="home_icon" src={'images/new_tab.png'}  onClick={this.preAuth}/>
                    </div>
                    <Link to="/orders">
                        <div className="home_button">
                            <div className="home_title">View Orders</div>
                            <img className="home_icon" src={'images/orders.png'}/>
                        </div>
                    </Link>
                </div>
                <div className="home_row">
                    <Link to="/vault-card">
                        <div className="home_button">
                            <div className="home_title">Customers (Vault Card)</div>
                            <img className="home_icon" src={'images/card.png'}/>
                        </div>
                    </Link>
                    <Link to="/refunds">
                        <div className="home_button">
                            <div className="home_title">Manual Refunds / Credit</div>
                            <img className="home_icon" src={'images/refund.png'}/>
                        </div>
                    </Link>
                    <Link to="/transactions">
                        <div className="home_button">
                            <div className="home_title">Transactions</div>
                            <img className="home_icon" src={'images/transactions.png'}/>
                        </div>
                    </Link>
                </div>
                <div className="home_row">
                    <Link to="/custom-activities">
                        <div className="home_button">
                            <div className="home_title">Custom Activities</div>
                            <img className="home_icon" src={'images/custom_activity.png'}/>
                        </div>
                    </Link>
                    <Link to="/device">
                        <div className="home_button">
                            <div className="home_title">Device</div>
                            <img className="home_icon" src={'images/device.png'}/>
                        </div>
                    </Link>
                    <Link to="/recovery-options">
                        <div className="home_button">
                            <div className="home_title">Recovery Options</div>
                            <img className="home_icon" src={'images/recovery.png'}/>
                        </div>
                    </Link>
                </div>
            </div>
        );
    }
}