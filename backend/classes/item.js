// books, arrows, swords, 
class Item {
    constructor({name, appearance, id, description, sprite, volume, weight, is_shark = false, max_quantity = 1, visibility = 1}) {
        this.name = name;
        this.appearance = appearance;
        this.visibility = visibility;
        this.id = id;
        this.description = description;
        this.sprite = sprite;

        this.meleeDmg;
        this.rangedDmg; // calculated vs defined?

        this.volume = volume; // effects visibility in addition to other things
        this.weight = weight;
        
        this.sharpness; // can wait
        this.hardness; // can wait

        this.is_shark = is_shark; // IMPORTANT

        // quantity control :D
        this.current_quantity = 1;
        this.max_quantity = max_quantity;
    }

    getDensity() { return this.weight / this.volume; }

    getDefense() {
        // calculate defensiveness
    }

}

module.exports = {
    Item,
    
}