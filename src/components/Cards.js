import React from 'react';
import TitleBar from "./TitleBar";
import ButtonNormal from "./ButtonNormal";

export default class Cards extends React.Component {
    render() {
        return (
            <div className="column">
                <div className="card_list">
                   <TitleBar title="Cards"/>
                </div>
                <div className="cards_footer">
                    <div className="filler_space"/>
                    <ButtonNormal title="Vault Card" color="white"/>
                </div>
            </div>
        );
    }
}