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
var second_room = new _room_.Room(
    x = 0,
    y = 1,
    description = "This is the second room, north of the starting room."
);

// Items
var shark = new _item_.Item();
shark.name = "Shark";
shark.description = "It's a shark! doo doo, doo doo doo doo"
shark.is_shark = true;

// sword
let sword1 = items_dict.sword1;
start_room.items.push(sword1);

second_room.items.push(shark);

world.addRoom(start_room);
world.addRoom(second_room);

module.exports = {
    world,

}