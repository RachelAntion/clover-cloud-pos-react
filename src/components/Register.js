import React from 'react';
import ButtonNormal from "./ButtonNormal";
import RegisterLine from "./RegisterLine";

export default class Register extends React.Component {
    render(){

        return(
            <div className="register">
                <div className="register_left">
                    <div className="register_sale_items">
                        <h3>Current Order: </h3>
                    </div>
                    <div className="register_actions">

                        <RegisterLine left="Subtotal:" right="$0.00"/>
                        <RegisterLine left="Discounts:"/>
                        <RegisterLine left="Tax:" right="$0.00"/>
                        <RegisterLine left="Total:" right="$0.00" extraLeft="total"/>
                        <div className="register_buttons">
                            <ButtonNormal title="New" color="white" extra="register_button"/>
                            <ButtonNormal title="Sale" color="green" extra="middle register_button"/>
                            <ButtonNormal title="Auth" color="green" extra="register_button"/>
                        </div>
                    </div>
                </div>
                <div className="register_right">
                    <div>I AM HERE :D</div>
                </div>
            </div>
        );
    }
}