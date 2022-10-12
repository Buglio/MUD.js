// books, arrows, swords, 
class Item {
    constructor(name, description, sprite, volume, weight) {
        this.name = name;
        this.description = description;
        this.sprite = sprite;

        this.meleeDmg;
        this.rangedDmg; // calculated vs defined?

        this.volume = volume; // effects visibility in addition to other things
        this.weight = weight;
        
        this.sharpness; // can wait
        this.hardness; // can wait

        this.is_shark = false; // IMPORTANT
    }

    getDensity() { return this.weight / this.volume; }

    getDefense() {
        // calculate defensiveness
    }

}

module.exports = {
    Item,
    
}