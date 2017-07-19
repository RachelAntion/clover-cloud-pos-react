import React from 'react';
import { Link } from 'react-router';
import ButtonNormal from "./ButtonNormal";
import Connect from "./CloverConnection";

export default class Layout extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            connected : false,
            uriText : "wss://192.168.0.126:12345/remote_pay",
        };
        this.toggleConnectionState = this.toggleConnectionState.bind(this);
        this.connect = this.connect.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.cloverConnection = new Connect(this.toggleConnectionState);
    }

    toggleConnectionState(connected){
        console.log("toggleConnectionState called");
        this.setState({ connected: connected});
    }


    connect(){
        this.cloverConnection.connectToDevice(this.state.uriText);
    }

    handleChange (e) {
        this.setState({ uriText: e.target.value });
    }


    render() {
        let connectionState = "Disconnected";
        if( this.state.connected) {
            connectionState = "Connected";
        }
        let showBody = this.state.connected;
        return (
            <div className="app-content">
                <div className="page_header">
                    <div id="connection_status">
                        {connectionState}
                    </div>
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
                {showBody? (
                    <div className="body_content">{React.cloneElement(this.props.children,
                        {
                            toggleConnectionState: this.toggleConnectionState,
                            setCloverConnector: this.setCloverConnector,
                            cloverConnector: this.state.cloverConnector
                        })}
                    </div>
                ):(
                    <div>
                        <input type="text" id="uri" value={this.state.uriText} onChange={this.handleChange}/>
                        <button onClick={this.connect}>Connect</button>
                    </div>
                )}
            </div>
        );
    }
}