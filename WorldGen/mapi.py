from datetime import date
from flask import Flask, jsonify, request
import json
import worldgen1 as wg1


app = Flask(__name__)

@app.route('/map')
def return_map():
    id = request.args.get('id')
    f = open("data/" + id + '_map.json')
    data = jsonify(json.load(f))
    data.headers.add('Access-Control-Allow-Origin', '*')
    return data 

@app.route('/newmap')
def update_map():
    map_id = wg1.main()
    data = jsonify({"id":map_id})
    data.headers.add('Access-Control-Allow-Origin', '*')
    return data 


if __name__=='__main__':
    app.run(host="0.0.0.0")
