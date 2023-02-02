
# IMPORTS
import random
import numpy as np
import json
import math
import random

import string
import random

# PARAMS
shape = (40,40)
WALL = 0
FLOOR = 1
fill_prob = 0.3
generations = 5
# PRINT MAP
def print_map(m):
    for y in m:
        printstr = ""
        for x in y:
            if x == 1: printstr += "[]"
            else: printstr += ".."
        print(printstr)

# OUTPUT JSON
def output_json(m):
    map_id = ''.join(random.choices(string.ascii_letters, k=7))

    json_obj = json.dumps(m, indent=4)
    with open("data/" + map_id + "_map.json", "w") as outpath:
        outpath.write(json_obj)
    return map_id

# CELLULAR AUTOMATA GENERATOR
def gen_map():
    new_map = np.ones(shape)
    for i in range(shape[0]):
        for j in range(shape[1]):
            choice = random.uniform(0, 1)
            new_map[i][j] = WALL if choice < fill_prob else FLOOR
    for generation in range(generations):
        for i in range(shape[0]):
            for j in range(shape[1]):
                submap = new_map[max(i-1, 0):min(i+2, new_map.shape[0]),max(j-1, 0):min(j+2, new_map.shape[1])]
                wallcount_1away = len(np.where(submap.flatten() == WALL)[0])
                submap = new_map[max(i-2, 0):min(i+3, new_map.shape[0]),max(j-2, 0):min(j+3, new_map.shape[1])]
                wallcount_2away = len(np.where(submap.flatten() == WALL)[0])
                if generation < 5:
                    if wallcount_1away >= 5 or wallcount_2away <= 7:
                        new_map[i][j] = WALL
                    else:
                        new_map[i][j] = FLOOR
                else:
                    if wallcount_1away >= 5:
                        new_map[i][j] = WALL
                    else:
                        new_map[i][j] = FLOOR
    outmap = []
    for i in range(new_map.shape[0]):
        row = []
        for j in range(new_map.shape[1]):
            char = 0 if new_map[i][j] == WALL else 1
            #print(char, end='')
            row.append(char)
        #print()
        outmap.append(row)
    return outmap

# Description creation
def gen_description(x,y,doors):
    return "sample description"

# ITEM DEFS (rarity?)
ITEM_LIST = {
    "1":{
        "name":"Book of Summoning",
        "appearance":"A dark green leather-bound book titled ᛒᛟᛟᚲ᛬ᛟᚠ᛬ᛊᚢᛗᛗᛟᚾᛁᛜ.",
        "id":3001,
        "description":"The book of summoning.",
        "sprite":"book_green.png",
        "volume":.02,
        "weight":.5,
        "rarity": 5
    },
    "2":{
        "name":"Book of Something else",
        "appearance":"A dark green leather-bound book titled ᛒᛟᛟᚲ᛬ᛟᚠ᛬ᛊᚢᛗᛗᛟᚾᛁᛜ.",
        "id":3002,
        "description":"The book of summoning.",
        "sprite":"book_green.png",
        "volume":.02,
        "weight":.5,
        "rarity": 5
    },
    "3":{
        "name":"Health Potion",
        "appearance":"Bottle of red liquid",
        "id":2001,
        "description":"Plain ol' potion",
        "sprite":"potion_red.png",
        "volume":.02,
        "weight":1,
        "max_quantity":8,
        "rarity": 1
    },
    "4":{
        "name":"Health Potion2",
        "appearance":"Bottle of red liquid",
        "id":2002,
        "description":"Plain ol' potion",
        "sprite":"potion_red.png",
        "volume":.02,
        "weight":1,
        "max_quantity":8,
        "rarity": 1
    },
    "5":{
        "name":"Health Potion3",
        "appearance":"Bottle of red liquid",
        "id":2003,
        "description":"Plain ol' potion",
        "sprite":"potion_red.png",
        "volume":.02,
        "weight":1,
        "max_quantity":8,
        "rarity": 1
    },
    "6":{
        "name":"Health Potion4",
        "appearance":"Bottle of red liquid",
        "id":2004,
        "description":"Plain ol' potion",
        "sprite":"potion_red.png",
        "volume":.02,
        "weight":1,
        "max_quantity":8,
        "rarity": 1
    },
    "7":{
        "name":"Health Potion5",
        "appearance":"Bottle of red liquid",
        "id":2005,
        "description":"Plain ol' potion",
        "sprite":"potion_red.png",
        "volume":.02,
        "weight":1,
        "max_quantity":8,
        "rarity": 1
    },
    "8":{
        "name":"Health Potion6",
        "appearance":"Bottle of red liquid",
        "id":2006,
        "description":"Plain ol' potion",
        "sprite":"potion_red.png",
        "volume":.02,
        "weight":1,
        "max_quantity":8,
        "rarity": 1
    },
    "9":{
        "name":"Health Potion7",
        "appearance":"Bottle of red liquid",
        "id":2007,
        "description":"Plain ol' potion",
        "sprite":"potion_red.png",
        "volume":.02,
        "weight":1,
        "max_quantity":8,
        "rarity": 1
    }
}
def gen_item_occurance():
    occurance_out = []
    occurance_rates = {
        0: 1,
        1: 200,
        2: 40,
        3: 10,
        4: 5,
        5: 1
    }
    for key in ITEM_LIST:
        for x in range(occurance_rates[ITEM_LIST[key]["rarity"]]):
            occurance_out.append(ITEM_LIST[key]["id"])
    random.shuffle(occurance_out)
    return occurance_out

# Item creation
def gen_items(x,y,occ):
    NUM_ITEMS = random.randint(2,8)
    ids_out = []
    for x in range(NUM_ITEMS):
        item = occ.pop()
        ids_out.append(item)
    return ids_out

# Entity creation
def gen_entities(x,y):
    return ["default", "default", "default"]


# GENERATE AND POPULATE A SINGLE ROOM AT X,Y
def create_room(x,y,new_map,occ):

    # DOOR DETECTION
    if y > 1:
        room_n = (new_map[y-1][x] == 1)
    else: room_n = False

    if y < len(new_map[x]) - 2:
        room_s = (new_map[y+1][x] == 1)
    else: room_s = False

    if x < len(new_map) - 2:
        room_e = (new_map[y][x+1] == 1)
    else: room_e = False

    if x > 1:
        room_w = (new_map[y][x-1] == 1)
    else: room_w = False
    doors = {
        "n": room_n,
        "s": room_s,
        "e": room_e,
        "w": room_w
    }

    # Create ROOM OBJECT
    new_room = {
        "x": x,
        "y": y,
        "description": gen_description(x,y,doors),
        "items": gen_items(x,y,occ),
        "entities": gen_entities(x,y),
        "doors": doors
    }
    return new_room

def main():
    room_list = {}
    new_map = gen_map()
    print_map(new_map)
    for y in range(len(new_map)):
        for x in range(len(new_map[y])):
            if new_map[y][x] == 1:
                room = create_room(x,y,new_map,gen_item_occurance())
                if (room["doors"]["n"] == True or room["doors"]["s"] == True or room["doors"]["e"] == True or room["doors"]["w"] == True):
                    if y not in room_list: room_list[y] = {}
                    room_list[y][x] = room
    map_id = output_json(room_list)
    return map_id
