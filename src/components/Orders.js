import React from 'react';
import TitleBar from "./TitleBar";

export default class Orders extends React.Component {
    render(){

        return(
            <div className="column">
                <div className="orders_list">
                    <TitleBar title="Orders"/>
                </div>
                <div className="order_items_and_payments">

                    <div className="order_items container_left">
                       <TitleBar title="Order Items"/>
                    </div>

                    <div className="order_payments container_right">
                        <TitleBar title="Order Payments"/>
                    </div>
                </div>
            </div>
        ); } }