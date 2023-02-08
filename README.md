# MUD.js

## Items
| Param | Type | Required? | Desc |
|-|-|-|-|
| `ITEM.name` | string | Yes | Describes the full accurate name of the item, revealed once item is identified |
| `ITEM.appearance` | string | Yes | Describes the appearance of the item, replaces `ITEM.name` while item is unidentified. |
| `ITEM.id` | int | Yes | The ID number associated with the item. |
| `ITEM.description` | string | Yes | Describes the item in detail, revealed one item is identified |
| `ITEM.sprite` | string | Yes | Path to item sprite, 24px x 24px |
| `ITEM.volume` | float | Yes | Volume in cubic meters |
| `ITEM.weight` | float | Yes | Weight in kilograms |
| `ITEM.max_quantity` | int | No | Max stack quantity (default=1) |
| `ITEM.visibility` | float | No | Value from 0-1, with 0 being completely hidden (default=1) |

### TODO
- rarity
- import/export
- content (other items?, text?)

## Rooms
| Param | Type | Required? | Desc |
|-|-|-|-|
| `ROOM.x` | int | Yes | X coordinate of the room in the world |
| `ROOM.y` | int | Yes | Y coordinate of the room in the world |
| `ROOM.description` | string | Yes | Description of the room when player does a `look` command. Object in the room are added on. |
| `ROOM.items` | [int] | Yes | List of `ITEM.id`s contained in the room. |
| `ROOM.entities` | [int] | Yes | List of ENTITIES contained in the room. |
| `ROOM.doors` | {bool} | Yes | {n,s,e,w} True/False object with the door attachments for each direction |
