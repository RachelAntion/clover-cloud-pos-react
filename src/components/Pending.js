import React from 'react';
import TitleBar from "./TitleBar";
import ButtonNormal from "./ButtonNormal";

export default class Pending extends React.Component {
    render() {
        return (
            <div className="column">
                <div className="pending_list">
                   <TitleBar title="Pending Paynments"/>
                </div>
                <div className="pending_footer">
                    <div className="filler_space"/>
                    <ButtonNormal title="Refresh" color="white"/>
                </div>
            </div>
        );
    }
}