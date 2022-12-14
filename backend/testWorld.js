// Objects
const _world_ = require("./classes/world.js");
const _room_ = require("./classes/room.js");
const _item_ = require("./classes/item.js");

const items_dict = require("./entities/items").dictionary;

// World Data
var world = new _world_.World();
var start_room = new _room_.Room(
    x = 0,
    y = 0,
    description = "This is the starting room all new adventurers are dropped into."
);
var north1 = new _room_.Room(
    x = 0,
    y = 1,
    description = "This is the second room, at coordinates 0, 1."
);
var north2 = new _room_.Room(
    x = 0,
    y = 2,
    description = "This is the third room, at coordinates 0, 2."
);
var west1 = new _room_.Room(
    x = -1,
    y = 0,
    description = "This is the fourth room, at coordinates -1, 0."
);

start_room.items.push(items_dict.sword1);
start_room.items.push(items_dict.potion1);

north1.items.push(items_dict.shark);
north1.items.push(items_dict.book2);
north1.items.push(items_dict.ring1);
north1.items.push(items_dict.potion2);

west1.items.push(items_dict.potion3);
west1.items.push(items_dict.potion4);

world.addRoom(start_room);
world.addRoom(north1);
world.addRoom(north2);
world.addRoom(west1);

module.exports = {
    world,

}