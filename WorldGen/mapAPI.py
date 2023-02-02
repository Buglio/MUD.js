from datetime import date
from flask import Flask, jsonify
import json
import worldgen1 as wg1


app = Flask(__name__)

@app.route('/map')
def return_map():
    f = open('map.json')
    data = jsonify(json.load(f))
    data.headers.add('Access-Control-Allow-Origin', '*')
    return data 

@app.route('/newmap')
def return_map():
    status = wg1.main()
    data = jsonify(json.load(status))
    data.headers.add('Access-Control-Allow-Origin', '*')
    return data 


if __name__=='__main__':
    app.run(host="0.0.0.0")