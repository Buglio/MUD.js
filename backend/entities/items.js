const item = require('../classes/item');

const dictionary = {
    sword1: new item.Item(
        name="Iron Sword",
        description="A regular old iron sword. kinda dull.",
        sprite="sword1.png",
        volume=.1,
        weight=3
    ),
};

module.exports = {
    dictionary
}