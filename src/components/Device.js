import React from 'react';
import ButtonNormal from "./ButtonNormal";

export default class Device extends React.Component {
    constructor(props) {
        super(props);
        console.log("Device: ", this.props);
    }

    render(){

        return(
            <div className="device">
                <h2>Device Options</h2>
                <div className="device_options">
                    <form className="misc_row">
                        <input className="device_input" type="text" value="Hello Message!"/>
                        <input className="normal_button button_white button_input" type="submit" value="Show Message"/>
                    </form>

                    <form className="misc_row">
                        <input className="device_input" type="text" value="Print This!!!"/>
                        <input className="normal_button button_white button_input" type="submit" value="Print Text"/>
                    </form>
                    <form className="misc_row">
                        <input className="device_input" type="text" value="JANRZXDFT3JF"/>
                        <input className="normal_button button_white button_input" type="submit" value="Query Payment"/>
                    </form>

                    <div className="misc_row">
                        <ButtonNormal extra="button_device" color="white" title="Show Welcome Screen"/>
                        <ButtonNormal extra="button_device" color="white" title="Show Thank You Screen"/>
                    </div>
                    <div className="misc_row">
                        <ButtonNormal extra="button_device" color="white" title="Closeout Orders"/>
                        <ButtonNormal extra="button_device" color="white" title="Open Cash Drawer"/>
                    </div>
                    <div className="misc_row">
                        <ButtonNormal extra="button_device" color="white" title="Print Image"/>
                        <ButtonNormal title="Print from URL" color="white" extra="button_device"/>
                    </div>
                    <div className="misc_row">
                        <ButtonNormal extra="button_device" color="white" title="Read Card Data"/>
                    </div>

                </div>
            </div>
        );
    }
}