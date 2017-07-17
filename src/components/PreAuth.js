import React from 'react';
import TitleBar from "./TitleBar";
import ButtonNormal from "./ButtonNormal";

export default class PreAuth extends React.Component {
    render() {
        return (
            <div className="column">
                <div className="preauth_list">
                   <TitleBar title="Pre Authorizations"/>
                </div>
                <div className="preauth_footer">
                    <div className="filler_space"/>
                    <ButtonNormal title="PreAuth Card" color="white"/>
                </div>
            </div>
        );
    }
}