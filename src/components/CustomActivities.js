import React from 'react';

export default class CustomActivities extends React.Component {
    constructor(props) {
        super(props);
        console.log("CustomActivities: ", this.props);
    }

    render(){

        return(
            <div className="custom_activities">
                <h2>Custom Activities</h2>
                <div className="custom_options">
                    <div className="misc_row">
                        <div>Non-Blocking</div>
                        <div className="onoffswitch">
                            <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitch" checked/>
                            <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                <span className="onoffswitch-inner"/>
                                <span className="onoffswitch-switch"/>
                            </label>
                        </div>
                    </div>
                    <select className="custom_item">
                        <option value="">BasicExample</option>
                        <option value="">BasicConverationalExample</option>
                        <option value="">WebViewExample</option>
                        <option value="">CarouselExample</option>
                        <option value="">RatingsExample</option>
                        <option value="">NFCExample</option>
                    </select>
                    <input className="custom_item" type="text" value="{name:Bob}"/>
                    <input className="normal_button button_white custom_item" type="submit" value="Start"/>
                </div>
            </div>
        );
    }
}