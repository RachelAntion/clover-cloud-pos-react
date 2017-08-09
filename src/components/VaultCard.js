import React from 'react';
import TitleBar from "./TitleBar";
import ButtonNormal from "./ButtonNormal";

export default class VaultCard extends React.Component {
    constructor(props) {
        super(props);
        this.store = this.props.store;
        this.cloverConnector = this.props.cloverConnection.cloverConnector;
        this.vaultCard = this.vaultCard.bind(this);
    }

    vaultCard(){
        this.cloverConnector.vaultCard(this.store.cardEntryMethods);
    }

    render() {
        return (
            <div className="column">
                <div className="card_list">
                   <TitleBar title="Cards"/>
                </div>
                <div className="cards_footer">
                    <div className="filler_space"/>
                    <ButtonNormal title="Vault Card" color="white" onClick={this.vaultCard}/>
                </div>
            </div>
        );
    }
}