const item = require('../classes/item');

const dictionary = {
    shark: new item.Item({
        "name": "Shark",
        "appearance": "A shark! Oh no!",
        "id": 0,
        "description":"It's a shark! doo doo, doo doo doo doo",
        "sprite": "shark.png",
        "volume": 50,
        "weight": 100,
        "max_quantity": 1,
        "visibility": 0,
        "is_shark": true,
    }),
    sword1: new item.Item({
        "name":"Iron Sword",
        "appearance":"Iron Sword",
        "id":1001,
        "description":"A regular old iron sword. kinda dull.",
        "sprite":"sword_grey.png",
        "volume":.1,
        "weight":3
    }),
    sword2: new item.Item({
        "name":"Cobalt Sword",
        "appearance":"A blueish metal sword.",
        "id":1002,
        "description":"A very special cobalt sword.",
        "sprite":"sword_blue.png",
        "volume":.1,
        "weight":3
    }),
    sword3: new item.Item({
        "name":"Meteorite Sword",
        "appearance":"A jet black metal sword.",
        "id":1003,
        "description":"A sword forged from a meteorite.",
        "sprite":"sword_black.png",
        "volume":.1,
        "weight":2
    }),
    potion1: new item.Item({
        "name":"Health Potion",
        "appearance":"Bottle of red liquid",
        "id":2001,
        "description":"Plain ol' potion",
        "sprite":"potion_red.png",
        "volume":.02,
        "weight":1,
        "max_quantity":8
    }),
    potion2: new item.Item({
        "name":"Magic Potion",
        "appearance":"Bottle of teal liquid",
        "id":2002,
        "description":"Plain ol' magic potion",
        "sprite":"potion_teal.png",
        "volume":.02,
        "weight":1,
        "max_quantity":8
    }),
    potion3: new item.Item({
        "name":"Charisma Potion",
        "appearance":"Bottle of purple liquid",
        "id":2003,
        "description":"Plain ol' charisma potion",
        "sprite":"potion_purple.png",
        "volume":.02,
        "weight":1,
        "max_quantity":8
    }),
    potion4: new item.Item({
        "name":"Poison Potion",
        "appearance":"Bottle of light green liquid",
        "id":2004,
        "description":"Plain ol' poison potion",
        "sprite":"potion_lightgreen.png",
        "volume":.02,
        "weight":1,
        "max_quantity":8
    }),
    book1: new item.Item({
        "name":"Book of Summoning",
        "appearance":"A dark green leather-bound book titled ᛒᛟᛟᚲ᛬ᛟᚠ᛬ᛊᚢᛗᛗᛟᚾᛁᛜ.",
        "id":3001,
        "description":"The book of summoning.",
        "sprite":"book_green.png",
        "volume":.02,
        "weight":.5
    }),
    book2: new item.Item({
        "name":"Tome of Blood",
        "appearance":"A crimson leather-bound book titled ᛏᛟᛗᛖ᛫ᛟᚠ᛫ᛒᛚᛟᛟᛞ.",
        "id":3002,
        "description":"The Tomb of Blood.",
        "sprite":"book_red.png",
        "volume":.02,
        "weight":.5
    }),
    ring1: new item.Item({
        "name":"The One Ring",
        "appearance":"A shimmering golden ring.",
        "id":4001,
        "description":"A ring of unimaginable power.",
        "sprite":"ring_gold.png",
        "volume":.02,
        "weight":.002
    }),
};

module.exports = {
    dictionary
}

/*
const dictionary = [
    new item.Item(
        "name":"Iron Sword",
        "appearance":"Iron Sword",
        "id":0,
        "description":"A regular old iron sword. kinda dull.",
        "sprite":"sword_blue.png",
        "volume":.1,
        "weight":3
    ),
    new item.Item(
        "name":"Small Health Potion",
        "appearance":"Bottle of red liquid",
        "id":1,
        "description":"Plain ol potion",
        "sprite":"potion_red.png",
        "volume":.02,
        "weight":1,
        "max_quantity":8
    )
]*/