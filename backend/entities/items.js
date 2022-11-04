const item = require('../classes/item');

const dictionary = {
    sword1: new item.Item(
        name="Iron Sword",
        appearance="Iron Sword",
        id=0,
        description="A regular old iron sword. kinda dull.",
        sprite="sword_blue.png",
        volume=.1,
        weight=3
    ),
    health_potion_1: new item.Item(
        name="Small Health Potion",
        appearance="Bottle of red liquid",
        id=1,
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

/*
const dictionary = [
    new item.Item(
        name="Iron Sword",
        appearance="Iron Sword",
        id=0,
        description="A regular old iron sword. kinda dull.",
        sprite="sword_blue.png",
        volume=.1,
        weight=3
    ),
    new item.Item(
        name="Small Health Potion",
        appearance="Bottle of red liquid",
        id=1,
        description="Plain ol potion",
        sprite="potion_red.png",
        volume=.02,
        weight=1,
        max_quantity=8
    )
]*/