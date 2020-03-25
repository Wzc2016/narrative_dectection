from flask import Flask, request, Response, jsonify
import json
import copy
import os
import numpy as np
import pandas as pd
import pathlib
from bson import ObjectId
app = Flask(__name__)
data_path = "/data"

all_topic_list = []

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return super(NpEncoder, self).default(obj)

def start_update(topic):
    all_topic_list.append(topic)
    pid=os.fork()
    if pid:
        # parent
        pass
    else:
        # child
        command_run = os.system("python3 ./continuous_update.py " + topic)
        sys.exists

def get_result(topic):
    file = pathlib.Path("../results/statistics/"+topic+"_statistics.json")
    if not file.exists():
        return None
    with open("../results/statistics/"+topic+"_statistics.json", 'r') as f:
        result_dict = json.load(f)
    return result_dict

def get_curr_result(topic):
    file = pathlib.Path("../results/statistics/"+topic+"_curr_statistics.json")
    if not file.exists():
        return None
    with open("../results/statistics/"+topic+"_curr_statistics.json", 'r') as f:
        result_dict = json.load(f)
    return result_dict

@app.route('/start_update/<topic>', methods=['POST'])
def start_update_fun(topic):
    start_update(topic)
    return Response("start to update data for "+topic, status=200)

@app.route('/get_result/<topic>', methods=['GET'])
def get_result_fun(topic):
    if not topic:
        return Response("Bad Request! No topic specified!", status=400)
    result_dict = get_result(topic)
    if not result_dict:
        return Response("Bad Request! No topic data found!", status=400)
    return NpEncoder().encode(result_dict),200

@app.route('/get_curr_result/<topic>', methods=['GET'])
def get_curr_result_fun(topic):
    if not topic:
        return Response("Bad Request! No topic specified!", status=400)
    result_dict = get_curr_result(topic)
    if not result_dict:
        return Response("Bad Request! No topic data found!", status=400)
    return NpEncoder().encode(result_dict),200

@app.route('/get_curr_topics', methods=['GET'])
def get_curr_topics_fun():
    result_dict ={"data":all_topic_list}
    return NpEncoder().encode(result_dict),200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)

