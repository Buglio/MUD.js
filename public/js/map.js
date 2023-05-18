// Array of runes used for the map background
const runes = ["ᚠ","ᚡ","ᚢ","ᚣ","ᚤ","ᚥ","ᚦ","ᚧ","ᚨ","ᚩ","ᚪ","ᚫ","ᚬ","ᚭ","ᚮ","ᚯ","ᚰ","ᚱ","ᚲ","ᚳ","ᚴ","ᚵ","ᚶ","ᚷ","ᚸ","ᚹ","ᚺ","ᚻ","ᚼ","ᚽ","ᚾ","ᚿ","ᛀ","ᛁ","ᛂ","ᛃ","ᛄ","ᛅ","ᛆ","ᛇ","ᛈ","ᛉ","ᛊ","ᛋ","ᛌ","ᛍ","ᛎ","ᛏ","ᛐ","ᛑ","ᛒ","ᛓ","ᛔ","ᛕ","ᛖ","ᛗ","ᛘ","ᛙ","ᛚ","ᛛ","ᛜ","ᛝ","ᛞ","ᛟ","ᛠ","ᛡ","ᛢ","ᛣ","ᛤ","ᛥ","ᛦ","ᛧ","ᛨ","ᛩ","ᛪ"];

function local_map_update(user, container_size = 15, room_size = 3){
    let output = [];
    let offset_x = 7;
    let offset_y = 7;
    let parent = document.getElementById("map_container");

    // Generate map background
    for (let x = 0; x < container_size; x++){
        for (let y = 0; y < container_size; y++){
            let runechar = runes[Math.floor(Math.random() * (runes.length - 1))];
            let span = `<span style='color:rgba(255,255,255,${Math.random() * 0.03});'class='map-bg'>${runechar}</span>`;
            output.push(span);
        }
    }

    console.log(GLOBAL.localmap)
    // Add rooms to map
    for (const [roomx, dictx] of Object.entries(GLOBAL.localmap)) {
        for (const [roomy, room] of Object.entries(dictx)) {
            let charx = user.characters[user.current_character].room.x;
            let chary = user.characters[user.current_character].room.y;
            let x_center = offset_x + ((parseInt(roomx) - charx) * room_size);
            let y_center = offset_y + ((parseInt(roomy) - chary) * room_size); // Flip y-coordinate

            // Check if room is within bounds of map
            if (x_center < 0 || x_center >= container_size || y_center < 0 || y_center >= container_size) {
                continue; // Skip this room
            }

            // Define the characters for the different types of tiles
            let wall = "<span class='map-tile-wall'>";
            let door = "<span class='map-tile-door'>";
            let empty = "<span class='map-tile-wall'> </span>";

            // Add the room to the map
            output[((y_center - 1) * container_size) + (x_center - 1)] = wall + "╔</span>"; // top left corner
            output[((y_center - 1) * container_size) + (x_center + 0)] = (room.doors.n ? door + "╩</span>" : wall + "═</span>"); // top middle
            output[((y_center - 1) * container_size) + (x_center + 1)] = wall + "╗</span>"; // top right corner
            output[((y_center + 0) * container_size) + (x_center - 1)] = (room.doors.w ? door + "╣</span>" : wall + "║</span>"); // left middle
            output[((y_center + 0) * container_size) + (x_center + 0)] = empty; // center
            output[((y_center + 0) * container_size) + (x_center + 1)] = (room.doors.e ? door + "╠</span>" : wall + "║</span>"); // right middle
            output[((y_center + 1) * container_size) + (x_center - 1)] = wall + "╚</span>"; // bottom left corner
            output[((y_center + 1) * container_size) + (x_center + 0)] = (room.doors.s ? door + "╦</span>" : wall + "═</span>"); // bottom middle
            output[((y_center + 1) * container_size) + (x_center + 1)] = wall + "╝</span>"; // bottom right corner
        }
    }

    // Add player to map
    output[offset_y * container_size + offset_x] = "<span class='map-self'>•</span>";

    // Update coordinates display
    let coord = `${user.characters[user.current_character].room.x}, ${user.characters[user.current_character].room.y}`;
    document.getElementById("coord").innerHTML = coord;

    // Update map display
    parent.innerHTML = output.join('');
}
