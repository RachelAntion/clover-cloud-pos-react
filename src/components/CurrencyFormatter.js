export default class CurrencyFormatter {

    formatCurrency(currency){
        if(currency === 0){
            return "$0.00";
        }
        else {
            let number = currency.toString();
            let first = number.substr(0, number.length - 2);
            let last = number.substr(number.length - 2);
            return "$" + first + "." + last;
        }
    }

    convertToFloat(currency){
        let number = currency.toString();
        let first = number.substr(0,number.length-2);
        let last =  number.substr(number.length-2);
        let float = first+"."+last;
        return parseFloat(float);
    }

    convertFromFloat(currency){
        let parts = currency.split('.');
        const newTotal = parts[0] + parts[1];
        console.log(newTotal);
        return parts[0] + parts[1];
    }
}