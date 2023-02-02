
# IMPORTS
import random
import numpy as np
import json

# PARAMS
shape = (20,20)
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
    json_obj = json.dumps(m, indent=4)
    with open("map.json", "w") as outpath:
        outpath.write(json_obj)

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
items = {
    {
        1:{
            "name":"Book of Summoning",
            "appearance":"A dark green leather-bound book titled ᛒᛟᛟᚲ᛬ᛟᚠ᛬ᛊᚢᛗᛗᛟᚾᛁᛜ.",
            "id":3001,
            "description":"The book of summoning.",
            "sprite":"book_green.png",
            "volume":.02,
            "weight":.5
        },
        2:{

        },
        3:{

        }
    }
}


# Item creation
def gen_items(x,y):
    return ["default", "default", "default"]

# Entity creation
def gen_entities(x,y):
    return ["default", "default", "default"]


# GENERATE AND POPULATE A SINGLE ROOM AT X,Y
def create_room(x,y,new_map):

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
        "items": gen_items(x,y),
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
                room = create_room(x,y,new_map)
                if (room["doors"]["n"] == True or room["doors"]["s"] == True or room["doors"]["e"] == True or room["doors"]["w"] == True):
                    if y not in room_list: room_list[y] = {}
                    room_list[y][x] = room
    output_json(room_list)
main()