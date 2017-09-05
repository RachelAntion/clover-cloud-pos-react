
export default class CardDataHelper{

    getExpirationDate(exp){
        let first = exp.substr(0, 2);
        let last = exp.substr(2,4);
        let date = first + "/" + last;
        return date;
    }



}