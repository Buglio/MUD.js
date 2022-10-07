class Character {
    constructor(name) {
        this.name = name;
        this.stats = {
            str: 15,
            con: 12,
            wis: 10,
            int: 12,
            dex: 13,
            cha: 16
        };
        this.hp = {
            max: 10,
            current: 10
        };
        this.room = null;
    }

    equipItem(item) {
        // check weight of item against strength of character
        // if below threshold, can't equip, if barely over threshold, it isn't effective
    }

    holdItem(item) {
        // check weight of item against strength of character
        // if below threshold, can't hold, if barely over threshold, reduces maneuverability (can't walk?)
    }
}

module.exports = {
    Character,
}