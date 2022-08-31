// books, arrows, swords, 
class Item {
    constructor() {
        this.name;
        this.description;

        this.meleeDmg;
        this.rangedDmg; // calculated vs defined?

        this.volume; // effects visibility in addition to other things
        this.weight;
        
        this.sharpness;
        this.hardness;

        this.is_shark = false;
    }

    getDensity() { return this.weight / this.volume; }

    getDefense() {
        // calculate defensiness
    }

}

module.exports = {
    Item,
    
}