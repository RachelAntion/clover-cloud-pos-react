import React from 'react';
import PropTypes from 'prop-types';
import CurrencyFormatter from "./CurrencyFormatter";

export default class AvailableItem extends React.Component {

    constructor(props) {
        super(props);
        this.formatter = new CurrencyFormatter();
    }

    render(){
        const id =this.props.id;
        const title = this.props.title;
        const itemPrice = this.formatter.formatCurrency(this.props.itemPrice);
        const onClick = this.props.onClick;
        return (
           <div className="available_item" onClick={() => {onClick(id, title, this.props.itemPrice)}}>
               <div className="item_title"><span>{title}</span></div>
               <div className="item_price">{itemPrice}</div>
           </div>
        )
    }
}

AvailableItem.propTypes = {
    title : PropTypes.string
}

