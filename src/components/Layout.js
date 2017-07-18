import React from 'react';
import { Link } from 'react-router';
import ButtonNormal from "./ButtonNormal";

export default class Layout extends React.Component {
    render() {
        return (
            <div className="app-content">
                <div className="page_header">
                    <div id="connection_status">Disconnected</div>
                    <div className="filler_space"/>
                    <Link to="/register">
                        <ButtonNormal title="Register" color="white" extra="button_margin"/>
                    </Link>
                    <Link to="/orders">
                        <ButtonNormal title="Orders" color="white" extra="button_margin"/>
                    </Link>
                    <Link to="/refund">
                        <ButtonNormal title="Refund" color="white" extra="button_margin"/>
                    </Link>
                    <Link to="/cards">
                        <ButtonNormal title="Cards" color="white" extra="button_margin"/>
                    </Link>
                    <Link to="/preauth">
                        <ButtonNormal title="PreAuth" color="white" extra="button_margin"/>
                    </Link>
                    <Link to="/pending">
                        <ButtonNormal title="Pending" color="white" extra="button_margin"/>
                    </Link>
                    <Link to="/misc">
                        <ButtonNormal title="Misc." color="white" extra="button_margin last"/>
                    </Link>
                </div>
                <div className="body_content">{this.props.children}</div>
            </div>
        );
    }
}