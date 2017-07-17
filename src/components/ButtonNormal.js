import React from 'react';

export default class ButtonNormal extends React.Component {

    render(){
        const title = this.props.title;
        const color = this.props.color;
        const extraClassNames = this.props.extra;

        var className;
        if(color == "green"){
            className = "normal_button button_green";
        }
        else if(color == "white"){
            className = "normal_button button_white";
        }
        else if(color == "red"){
            className = "normal_button button_red";
        }
        className += " " + extraClassNames;

        return (
            <button className={ className } >{ title }</button>
        )
    }
}

ButtonNormal.defaulProps = {
    color: "white",
    extraClassNames: '',
};