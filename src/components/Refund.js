import React from 'react';
import TitleBar from "./TitleBar";

export default class Refund extends React.Component {
    render() {
        return (
            <div className="refunds">
                <div className="make_refund">
                    <span>Refund Amount: </span>
                    <form>
                        <input type="text" />
                        <input className="normal_button button_white button_margin" type="submit" value="Refund"/>
                    </form>
                </div>
                <div class="refund_list">
                  <TitleBar title="Manual Refunds"/>
                </div>
            </div>
        );
    }
}