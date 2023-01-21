// =============== MAP FUNCTIONS ================ //
function local_map_update(user, container_size = 15, room_size = 3){
    output = [];
    center_xy = Math.floor(container_size / 2);
    offset_x = 7
    offset_y = 7
    parent = document.getElementById("map_container");
    for (x = 0; x < container_size; x++){
        for (y = 0; y < container_size; y++){
            let span = "<span style='color:rgba(255,255,255," + Math.random() * 0.1 + ");'class='map-bg'>#</span>"
            output.push(span);
        }
    }
    for (const [roomx, dictx] of Object.entries(GLOBAL.localmap)) {
        for (const [roomy, room] of Object.entries(dictx)) {
            console.log(room.doors);
            charx = user.characters[user.current_character].room.x;
            chary = user.characters[user.current_character].room.y;
            x_center = offset_x + ((parseInt(roomx) - charx) * 3);
            y_center = offset_y - ((parseInt(roomy) - chary) * 3);

            output[((y_center - 1) * container_size) + (x_center - 1)] = "<span class='map-tile-wall'>╔</span>"; // create room top left corner

            if (room.doors.n === true){ output[((y_center - 1) * container_size) + (x_center + 0)] = "<span class='map-tile-door'>╩</span>"; } // create room top middle door
            else { output[((y_center - 1) * container_size) + (x_center + 0)] = "<span class='map-tile-wall'>═</span>"; } // create room top middle

            output[((y_center - 1) * container_size) + (x_center + 1)] = "<span class='map-tile-wall'>╗</span>"; // create room top right corner

            if (room.doors.w === true){ output[((y_center + 0) * container_size) + (x_center - 1)] = "<span class='map-tile-door'>╣</span>"; } // create room left middle door
            else { output[((y_center + 0) * container_size) + (x_center - 1)] = "<span class='map-tile-wall'>║</span>"; } // create room left middle

            output[((y_center + 0) * container_size) + (x_center + 0)] = "<span class='map-tile-wall'> </span>"; // create room center (blank)

            if (room.doors.e === true){ output[((y_center + 0) * container_size) + (x_center + 1)] = "<span class='map-tile-door'>╠</span>"; } // create room right middle door
            else { output[((y_center + 0) * container_size) + (x_center + 1)] = "<span class='map-tile-wall'>║</span>"; } // create room right middle

            output[((y_center + 1) * container_size) + (x_center - 1)] = "<span class='map-tile-wall'>╚</span>"; // create room bottom left corner

            if (room.doors.s === true){ output[((y_center + 1) * container_size) + (x_center + 0)] = "<span class='map-tile-door'>╦</span>"; } // create room bottom middle door
            else { output[((y_center + 1) * container_size) + (x_center + 0)] = "<span class='map-tile-wall'>═</span>"; } // create room bottom middle

            output[((y_center + 1) * container_size) + (x_center + 1)] = "<span class='map-tile-wall'>╝</span>"; // create room bottom right corner


        }
    }
    output[offset_y * container_size + offset_x] = "<span class='map-self'>•</span>"; // create player

    let coord = user.characters[user.current_character].room.x + ", " + user.characters[user.current_character].room.y;
    document.getElementById("coord").innerHTML = coord;
    parent.innerHTML = output.join('');
}