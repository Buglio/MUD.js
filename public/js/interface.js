function render_interface(current_char){
    console.log('render current state');
    if (!current_char){
        document.getElementById("character_stats").style.display = "none";
        document.getElementById("character_inventory").style.display = "none";
        document.getElementById("character_map").style.display = "none";
    }
    else{
        document.getElementById("character_stats").style.display = "block";
        document.getElementById("character_inventory").style.display = "block";
        document.getElementById("character_map").style.display = "block";
    }

    // =============== STATS =============== //
    document.getElementById('character_name').innerText = "CHARACTER: " + current_char.name;
    document.getElementById('character_hp').innerText = "HP: " + current_char.hp.current + "/" + current_char.hp.max;
    document.getElementById('character_hp').style.width = (current_char.hp.current / current_char.hp.max * 99) + "%";
    document.getElementById('character_mp').innerText = "MP: " + current_char.mp.current + "/" + current_char.mp.max;
    document.getElementById('character_mp').style.width = (current_char.mp.current / current_char.mp.max * 99) + "%";
    document.getElementById('character_xp').innerText = "EXP: " + current_char.xp.current + "/" + current_char.xp.max;
    document.getElementById('character_xp').style.width = (current_char.xp.current / current_char.xp.max * 99) + "%";
    document.getElementById('character_dex').innerText = "DEX: " + current_char.stats.dex;
    document.getElementById('character_str').innerText = "STR: " + current_char.stats.str;
    document.getElementById('character_int').innerText = "INT: " + current_char.stats.int;
    document.getElementById('character_wis').innerText = "WIS: " + current_char.stats.wis;
    document.getElementById('character_con').innerText = "CON: " + current_char.stats.con;
    document.getElementById('character_cha').innerText = "CHA: " + current_char.stats.cha;

    // =============== INVENTORY =============== //
    let items_container = document.getElementById('items_container');
    items_container.innerHTML = "";
    for (let x = 0; x < 24; x++)
    {
        let inv_slot = document.createElement("div");
        inv_slot.className = "inv_slot";
        if (current_char.inventory[x]){ // const item of user.characters[user.current_character].inventory
            let inv_item = current_char.inventory[x];
            if (inv_item.max_quantity > 1){ // quantity tag
                let tag = document.createElement("span");
                tag.innerText = inv_item.current_quantity + "x";
                inv_slot.appendChild(tag);
            }
            let image = document.createElement("img");
            image.className = "inv_item"
            image.src = "/sprites/"+ inv_item.sprite;
            inv_slot.appendChild(image);            
        }
        items_container.appendChild(inv_slot);
    }

    // =============== MAP =============== //
}
    