// Objects
const _world_ = require("./objects/world.js");
const _room_ = require("./objects/room.js");
const _item_ = require("./objects/item.js");

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

second_room.items.push(shark);

world.addRoom(start_room);
world.addRoom(second_room);



module.exports = {
    world,

}