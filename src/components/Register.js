import React from 'react';
import ButtonNormal from "./ButtonNormal";
import RegisterLine from "./RegisterLine";
import AvailableItem from "./AvailableItem";
const data = require ("../../src/items.js");
import Order from '../Models/Order';
import CurrencyFormatter from "./CurrencyFormatter";
import OrderPayment from "../Models/OrderPayment";
import RegisterLineItem from "./RegisterLineItem";
import clover from 'remote-pay-cloud-api';
import clove from 'remote-pay-cloud';

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allowTips : false,
            orderItems: [],
            showSaleMethod: false,
            areVaultedCards: false,
            makingSale: false,
            subtotal : 0,
            preAuthChosen: false,
            payNoItems: false,
            saveNoItems: false,
            showSettings: false,
            showPaymentMethods: false,
            tax: 0,
            total: 0,
        };
        this.setStatus = this.props.setStatus;
        this.closeStatus = this.props.closeStatus;
        this.addToOrder = this.addToOrder.bind(this);
        this.newOrder = this.newOrder.bind(this);
        this.chooseSaleMethod = this.chooseSaleMethod.bind(this);
        this.saleChosen = this.saleChosen.bind(this);
        this.authChosen = this.authChosen.bind(this);
        this.cardChosen = this.cardChosen.bind(this);
        this.vaultedCardChosen = this.vaultedCardChosen.bind(this);
        this.closePreAuth = this.closePreAuth.bind(this);
        this.onChange = this.onChange.bind(this);
        this.closeSettings = this.closeSettings.bind(this);
        this.choosePaymentMethod = this.choosePaymentMethod.bind(this);
        this.closePaymentMethods = this.closePaymentMethods.bind(this);
        this.closeSaleMethod = this.closeSaleMethod.bind(this);
        this.makeSale = this.makeSale.bind(this);
        this.saleMethod = null;
        this.orderId = 1;
        this.paymentId = 1;
        this.order = new Order(this.orderId);
        this.formatter = new CurrencyFormatter;
        this.displayOrder = new clover.order.DisplayOrder();
        this.cloverConnector = this.props.cloverConnection.cloverConnector;
        this.store = this.props.store;
        this.cloverConnector.showWelcomeScreen();
        if(this.props.location.state != null){
            this.saleMethod = this.props.location.state.saleType;
        }
    }

    closePreAuth(){
        this.setState({ preAuthChosen : false});
    }

    addToOrder(id, title, price) {
        this.order.addItem(id, title, price);
        this.setState({
            orderItems:this.order.getItems(),
            subtotal:this.order.getTotal(),
            tax: this.order.getTax(),
            total: this.order.getTotalwithTax(),
            payNoItems: false,
            saveNoItems: false,
        });
        this.displayOrder.setLineItems(this.order.getItems());
        this.displayOrder.setSubtotal("$"+parseFloat(this.order.getTotal()).toFixed(2));
        this.displayOrder.setTax("$"+parseFloat(this.order.getTax()).toFixed(2));
        this.displayOrder.setTotal("$"+parseFloat(this.order.getTotalwithTax()).toFixed(2));
        this.cloverConnector.showDisplayOrder(this.displayOrder);
    }

    newOrder(){
        if(this.state.orderItems.length > 0) {
            this.props.store.addOrder(this.order);
            this.orderId++;
            this.order = new Order(this.orderId);
            this.setState({orderItems: this.order.getItems(), subtotal: 0.00, tax: 0.00, total: 0.00, makingSale: false});
        }
        else{
            this.setState({saveNoItems : true, payNoItems : false});
        }
        // console.log("new order",this.order);
    }


    choosePaymentMethod(){
        this.setState({showPaymentMethods: true, showSettings: false});
    }

    closePaymentMethods(){
        this.setState({showPaymentMethods: false});
    }

    chooseSaleMethod(){
        if(this.state.orderItems.length > 0) {
            console.log("choose your payment method!");
            if(this.saleMethod !== "Vaulted"){
                this.setState({showSaleMethod: true, makingSale: true});
            }
            else{
                this.setState({showSettings: true, makingSale: true});
            }

        }
        else{
            this.setState({payNoItems : true, saveNoItems : false});
        }
    }
    closeSaleMethod(){
        this.setState({showSaleMethod: false});
    }

    closeSettings(){
        this.setState({showSettings: false});
    }

    saleChosen(){
        console.log("Sale was chosen");
        this.saleMethod = 'Sale';
        this.setState({showSettings: true, showSaleMethod: false});
    }

    authChosen(){
        console.log("Auth was chosen");
        this.saleMethod = "Auth";
        this.setState({showSettings: true, showSaleMethod: false});
    }

    makeSale(){
        if(this.saleMethod === 'Sale' || this.saleMethod === 'Auth'){
            this.cardChosen();
        }
        else if(this.saleMethod === 'Vaulted'){
            this.vaultedCardChosen();
        }

    }

    cardChosen(){
        this.setState({showSettings: false, showPaymentMethods : false});
        let externalPaymentID = clove.CloverID.getNewId();
        // console.log("ExternalPaymentID:" + externalPaymentID);
        // store.getCurrentOrder().setPendingPaymentId(externalPaymentID);
        let request = new clover.remotepay.SaleRequest();
        request.setAmount(this.formatter.convertFromFloat(this.order.getTotalwithTax()));
        request.setExternalId(externalPaymentID);
        if(this.state.allowTips){
            request.setTipMode(clover.payments.TipMode.ON_SCREEN_BEFORE_PAYMENT);
        }
        else{
            request.setTipMode(clover.payments.TipMode.NO_TIP);
        }
        this.cloverConnector.sale(request);
        if(this.state.allowTips){
            this.setStatus('Customer is Tipping...');
        }
        else{
            this.setStatus('Customer is choosing payment method');
        }
         this.newOrder();
    }

    vaultedCardChosen(){
        console.log("Vaulted Card Chosen")
        this.setState({showSettings: false, showPaymentMethods : false});
        let externalPaymentID = clove.CloverID.getNewId();
        let request = new clover.remotepay.SaleRequest();
        request.setAmount(this.formatter.convertFromFloat(this.order.getTotalwithTax()));
        request.setExternalId(externalPaymentID);
        let card = this.store.getCard();
        console.log("card", card);
        request.setVaultedCard(card);
        if(this.state.allowTips){
            request.setTipMode(clover.payments.TipMode.ON_SCREEN_BEFORE_PAYMENT);
        }
        else{
            request.setTipMode(clover.payments.TipMode.NO_TIP);
        }
        this.cloverConnector.sale(request);
        if(this.state.allowTips){
            this.setStatus('Customer is Tipping...');
        }
        else{
            this.setStatus('Processing...');
        }
        this.newOrder();
    }


    onChange(){
        this.setState({allowTips: !this.state.allowTips});
    }

    componentWillReceiveProps(newProps) {
        // console.log("newProps", newProps);
        if(newProps.saleFinished === true){
            let orderPayment = new OrderPayment(this.paymentId);
            this.paymentId++;
            orderPayment.setStatus("PAID");
            orderPayment.setAmount(this.state.total);
            orderPayment.setTransactionType(this.saleMethod);
            orderPayment.setTipAmount(this.formatter.convertToFloat( newProps.tipAmount));
            this.order.addOrderPayment(orderPayment);
            this.order.setStatus("PAID");
            this.newOrder();
            this.setState({makingSale: false});
        }
    }

    render(){
        const showSaleMethods = this.state.showSaleMethod;
        const showPayMethods = this.state.showPaymentMethods;
        let newOrder = 'New Order';
        let cardText = "Card";
        let showVaultedCard = this.state.areVaultedCards;
        let showPreAuth = false;
        let isSale = false;
        let settingType = "Sale";
        if(this.saleMethod !== null){
            if(this.saleMethod === 'Sale'){
                newOrder = 'New Sale';
                isSale = true;
            }
            else if(this.saleMethod === 'Auth'){
                newOrder = 'New Authorization';
                settingType = 'Auth';
            }
            else if(this.saleMethod === 'Vaulted'){
                newOrder = 'New Vaulted Card Sale';
                isSale = true;
            }
        }
        let orderItems = this.state.orderItems;

        const subtotal = "$"+parseFloat(this.state.subtotal).toFixed(2);
        const tax = "$"+parseFloat(this.state.tax).toFixed(2);
        const total = "$"+parseFloat(this.state.total).toFixed(2);
        const preAuthPopup = this.state.preAuthChosen;
        return(
            <div className="register">
                {this.state.showSettings &&
                <div className="settings">
                    <div className="close_popup" onClick={this.closeSettings}>x</div>
                    <h2 className="no_margin">{settingType} Settings</h2>
                    <div className="transaction_settings">
                        <div className="settings_left settings_side">
                            <h3>Card Options</h3>
                            <div className="settings_row">
                                <div>Manual</div>
                                <div className="onoffswitch">
                                    <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox"
                                           id="myonoffswitch" defaultChecked/>
                                    <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                        <span className="onoffswitch-inner"/>
                                        <span className="onoffswitch-switch"/>
                                    </label>
                                </div>
                            </div>
                            <div className="settings_row">
                                <div>Swipe</div>
                                <div className="onoffswitch">
                                    <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox"
                                           id="myonoffswitch" defaultChecked/>
                                    <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                        <span className="onoffswitch-inner"/>
                                        <span className="onoffswitch-switch"/>
                                    </label>
                                </div>
                            </div>
                            <div className="settings_row">
                                <div>Chip</div>
                                <div className="onoffswitch">
                                    <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox"
                                           id="myonoffswitch" defaultChecked/>
                                    <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                        <span className="onoffswitch-inner"/>
                                        <span className="onoffswitch-switch"/>
                                    </label>
                                </div>
                            </div>
                            <div className="settings_row">
                                <div>Contactless</div>
                                <div className="onoffswitch">
                                    <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox"
                                           id="myonoffswitch" defaultChecked/>
                                    <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                        <span className="onoffswitch-inner"/>
                                        <span className="onoffswitch-switch"/>
                                    </label>
                                </div>
                            </div>
                            <h3>Offline Payments</h3>
                            <div className="settings_row">
                                <div>Force Offline Payment</div>
                                <form action="">
                                    <input className="radio_button" type="radio" name="" value="default"
                                           defaultChecked="true"/> Default
                                    <input className="radio_button" type="radio" name="" value="yes"/> Yes
                                    <input className="radio_button" type="radio" name="" value="no"/> No
                                </form>
                            </div>

                            <div className="settings_row">
                                <div>Allow Offline Payments</div>
                                <form action="">
                                    <input className="radio_button" type="radio" name="" value="default"
                                           defaultChecked="true"/> Default
                                    <input className="radio_button" type="radio" name="" value="yes"/> Yes
                                    <input className="radio_button" type="radio" name="" value="no"/> No
                                </form>
                            </div>

                            <div className="settings_row">
                                <div>Accept Offline w/o Prompt</div>
                                <form action="">
                                    <input className="radio_button" type="radio" name="" value="default"
                                           defaultChecked="true"/> Default
                                    <input className="radio_button" type="radio" name="" value="yes"/> Yes
                                    <input className="radio_button" type="radio" name="" value="no"/> No
                                </form>
                            </div>

                            {isSale &&
                            <div>
                                <h3>Tips</h3>
                                <div className="settings_row">
                                    <div>Tip Mode</div>
                                    <select className="setting_select">
                                        <option value="">Default</option>
                                        <option value="">Tip Provided</option>
                                        <option value="">On Screen Before Payment</option>
                                        <option value="">No Tip</option>
                                    </select>
                                </div>

                                <div className="settings_row">
                                    <div>Tip Amount</div>
                                    <input className="setting_input" type="text"/>
                                </div>
                            </div>
                            }

                        </div>
                        <div className="settings_right settings_side">
                            <h3>Signatures</h3>
                            <div className="settings_row">
                                <div>Signature Entry Location</div>
                                <select className="setting_select">
                                    <option value="">Default</option>
                                    <option value="">On Screen</option>
                                    <option value="">On Paper</option>
                                    <option value="">None</option>
                                </select>
                            </div>

                            <div className="settings_row">
                                <div>Signature Threshold</div>
                                <input className="setting_input" type="text"/>
                            </div>
                            <h3>Payment Acceptance</h3>
                            <div className="settings_row">
                                <div>Disable Duplicate Payment Checking</div>
                                <div className="onoffswitch">
                                    <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox"
                                           id="myonoffswitch" defaultChecked/>
                                    <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                        <span className="onoffswitch-inner"/>
                                        <span className="onoffswitch-switch"/>
                                    </label>
                                </div>
                            </div>

                            <div className="settings_row">
                                <div>Disable Device Receipt Options Screen</div>
                                <div className="onoffswitch">
                                    <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox"
                                           id="myonoffswitch" defaultChecked/>
                                    <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                        <span className="onoffswitch-inner"/>
                                        <span className="onoffswitch-switch"/>
                                    </label>
                                </div>
                            </div>

                            <div className="settings_row">
                                <div>Disable Device Printing</div>
                                <div className="onoffswitch">
                                    <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox"
                                           id="myonoffswitch" defaultChecked/>
                                    <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                        <span className="onoffswitch-inner"/>
                                        <span className="onoffswitch-switch"/>
                                    </label>
                                </div>
                            </div>

                            <div className="settings_row">
                                <div>Automatically Confirm Signature</div>
                                <div className="onoffswitch">
                                    <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox"
                                           id="myonoffswitch" defaultChecked/>
                                    <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                        <span className="onoffswitch-inner"/>
                                        <span className="onoffswitch-switch"/>
                                    </label>
                                </div>
                            </div>

                            <div className="settings_row">
                                <div>Automatically Confirm Payment Challenges</div>
                                <div className="onoffswitch">
                                    <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox"
                                           id="myonoffswitch" defaultChecked/>
                                    <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                        <span className="onoffswitch-inner"/>
                                        <span className="onoffswitch-switch"/>
                                    </label>
                                </div>
                            </div>
                            <div className="filler_space"/>
                            <div className="settings_actions">
                                <ButtonNormal extra="refund_button" title="Continue" color="white" onClick={this.makeSale}/>
                            </div>
                        </div>
                    </div>
                </div>
                }
                {preAuthPopup &&
                <div className="preauth_popup popup">
                    Please swipe your card
                    <div className="preauth_button_row">
                        <ButtonNormal title="Cancel" color="red" onClick={this.closePreAuth} extra="preauth_button"/>
                        <ButtonNormal title="Card Swiped" color="white" onClick={this.openPreAuth} extra="preauth_button"/>
                    </div>
                </div>}
                {showSaleMethods &&
                <div className="popup_container popup">
                    <div className="close_popup" onClick={this.closeSaleMethod}>x</div>
                    <div className="payment_methods">
                        <ButtonNormal title="Sale" onClick={this.saleChosen} extra="button_large" color="white"/>
                        <ButtonNormal title="Auth" onClick={this.authChosen} extra="button_large" color="white"/>
                    </div>
                </div>}
                {showPayMethods &&
                <div className="popup_container popup">
                    <div className="close_popup" onClick={this.closePaymentMethods}>x</div>
                    <div className="payment_methods">
                        <ButtonNormal title={cardText} onClick={this.cardChosen} extra="button_large" color="white"/>
                        {showVaultedCard && <ButtonNormal title="Vaulted Card" onClick={this.vaultedCardChosen} extra="button_large" color="white"/>}
                        {showPreAuth && <ButtonNormal title="Existing PreAuth" onClick={this.preAuthChosen} extra="button_large" color="white"/>}
                    </div>
                </div>}
                <div className="register_left">
                    <h2>{newOrder}</h2>
                    <div className="register_sale_items">
                        <h3>Current Order: </h3>
                        <div className="order_items">
                            {orderItems.map(function (orderItem, i) {
                                return <RegisterLineItem key={'orderItem-'+i} quantity={orderItem.quantity}  title={orderItem.name} price={orderItem.price}/>
                            }, this)}
                        </div>
                        {this.state.payNoItems && <div>You cannot make a sale with no items</div>}
                        {this.state.saveNoItems && <div>You cannot save an order with no items</div>}
                    </div>
                    <div className="register_actions">

                        <RegisterLine left="Subtotal:" right={subtotal}/>
                        <RegisterLine left="Discounts:"/>
                        <RegisterLine left="Tax:" right={tax}/>
                        <RegisterLine left="Total:" right={total} extraLeft="total"/>
                        <div className="register_buttons">
                            <ButtonNormal title="Save" color="green" extra="register_button left" onClick={this.newOrder}/>
                            <ButtonNormal title="Pay" color="green" extra="register_button right" onClick={this.chooseSaleMethod}/>
                        </div>
                        <div className="register_allow_tips">
                            <input type="checkbox" name="allowTips"  value="TIPS_ALLOWED" onChange={this.onChange} />
                            <div>Allow Tips?</div>
                        </div>
                    </div>
                </div>
                <div className="register_right">
                    {!this.state.makingSale &&
                    <div className="register_items">
                        {data.map((item, i) => {
                            return <AvailableItem key={'item-' + i} id={item.id} title={item.title}
                                                  itemPrice={item.itemPrice} onClick={this.addToOrder}/>
                        })}
                    </div>
                    }
                </div>
            </div>
        );
    }
}

