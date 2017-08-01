
export default class Item {

    constructor(id, title, price){
        this.id = id;
        this.title = title;
        this.price = price;
    }

    getId(){
        return this.id;
    }

    getTitle(){
        return this.title;
    }

    getPrice(){
        return this.price;
    }
}