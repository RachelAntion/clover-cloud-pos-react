export default class ImageHelper {

    getCardTypeImage(cardType){
        let image = "images/tender_default.png";
        if(cardType === "VISA"){
            image = "images/tender_visa.png";
        }
        else if(cardType === "AMEX"){
            image = "images/tender_amex.png"
        }
        else if(cardType === "MC"){
            image = "images/tender_mc.png"
        }
        else if(cardType === "DISC"){
            image = "images/tender_disc.png"
        }
        else if(cardType === "EBT") {
            image = "images/tender_ebt.png"
        }
        return image;
    }

}