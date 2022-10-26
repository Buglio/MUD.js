const item = require('../classes/item');

const dictionary = {
    sword1: new item.Item(
        name="Iron Sword",
        id=1,
        description="A regular old iron sword. kinda dull.",
        sprite="sword_blue.png",
        volume=.1,
        weight=3
    ),
    health_potion_1: new item.Item(
        name="Small Health Potion",
        id=2,
        description="Plain ol potion",
        sprite="potion_red.png",
        volume=.02,
        weight=1,
        max_quantity=8
    )
};

module.exports = {
    dictionary
}