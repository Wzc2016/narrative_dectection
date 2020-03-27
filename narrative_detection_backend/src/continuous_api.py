from flask import Flask, request, Response, jsonify
import json
import copy
import os
import numpy as np
import pandas as pd
import pathlib
import datetime
from dateutil.parser import parse
from bson import ObjectId
from os import listdir
from os.path import isfile, join


app = Flask(__name__)
data_path = "/data"

child_id_dict = {}
all_topic_set = set()
current_topic_set = set()

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

def check_pid(pid):
    try:
        os.kill(pid, 0)
    except OSError:
        return False
    else:
        return True

def check_childs():
    for pid in child_id_dict:
        if not check_pid(pid):
            current_topic_set.remove(child_id_dict[pid])
            del child_id_dict[pid]

def start_update(topic):
    check_childs()
    if(topic in current_topic_set):
        return -1
    all_topic_set.add(topic)
    current_topic_set.add(topic)
    pid=os.fork()
    if pid:
        # parent
        child_id_dict[pid] = topic
        return 1
    else:
        # child
        command_run = os.system("python3 ./continuous_update.py " + topic)
        return 0

def get_result(topic):
    check_childs()
    file = pathlib.Path("../results/statistics/"+topic+"_statistics.json")
    if not file.exists():
        return None
    with open("../results/statistics/"+topic+"_statistics.json", 'r') as f:
        result_dict = json.load(f)
    return result_dict

def get_curr_result(topic):
    check_childs()
    file = pathlib.Path("../results/statistics/"+topic+"_curr_statistics.json")
    if not file.exists():
        return None
    with open("../results/statistics/"+topic+"_curr_statistics.json", 'r') as f:
        result_dict = json.load(f)
    return result_dict

def get_daily_sample(topic):
    check_childs()
    file = pathlib.Path("../results/data/"+topic+"_result.csv")
    if not file.exists():
        return None
    df = pd.read_csv("../results/data/"+topic+"_result.csv", sep="\t")
    df['date'] = df['date'].apply(lambda x: str(x)[1:12])
    print(df)
    result_list =[]
    start_date = datetime.datetime.strptime(df.iloc[1]["date"],'%Y %b %d')
    end_date = datetime.datetime.strptime(df.iloc[-1]["date"],'%Y %b %d')
    curr_date = start_date
    while curr_date<=end_date:
        today_dict = {}
        curr_day_df = df.loc[df['date'] == datetime.datetime.strftime(curr_date,'%Y %b %d')]
        curr_day_pos = curr_day_df.loc[curr_day_df['label'] == "1"].head(3)
        curr_day_pos_list = list(curr_day_pos["text"])
        curr_day_neg = curr_day_df.loc[curr_day_df['label'] == "2"].head(3)
        curr_day_neg_list = list(curr_day_neg["text"])
        curr_day_neu = curr_day_df.loc[curr_day_df['label'] == "0"].head(3)
        curr_day_neu_list = list(curr_day_neu["text"])
        today_dict = {'positive':curr_day_pos_list, 'neutral':curr_day_neu_list, 'negative':curr_day_neg_list}
        result_list.append(today_dict)
        curr_date += datetime.timedelta(days=1)
    return result_list

@app.route('/start_update/<topic>', methods=['POST'])
def start_update_fun(topic):
    res = start_update(topic)
    if(res==-1):
        return Response("Bad Request! "+topic+" is currently updating!", status=400)
    if(res==1):
        return Response("start to update data for "+topic, status=200)
    if(res==0):
        return Response("gathering of "+topic+" is done.", status=200)

@app.route('/get_result/<topic>', methods=['GET'])
def get_result_fun(topic):
    if not topic:
        return Response("Bad Request! No topic specified!", status=400)
    result_dict = get_result(topic)
    if not result_dict:
        return Response("Bad Request! Didn't find data for "+topic, status=400)
    return NpEncoder().encode(result_dict),200

@app.route('/get_curr_result/<topic>', methods=['GET'])
def get_curr_result_fun(topic):
    if not topic:
        return Response("Bad Request! No topic specified!", status=400)
    result_dict = get_curr_result(topic)
    if not result_dict:
        return Response("Bad Request! Didn't find data for "+topic, status=400)
    return NpEncoder().encode(result_dict),200

@app.route('/get_curr_topics', methods=['GET'])
def get_curr_topics_fun():
    result_dict ={"data":list(current_topic_set)}
    return NpEncoder().encode(result_dict),200

@app.route('/get_all_topics', methods=['GET'])
def get_all_topics_fun():
    all_topic_list = [f[0:-11] for f in listdir("../results/data/") if (isfile(join("../results/data/", f)) and f[-1]=="v")]
    result_dict = {"data":all_topic_list}
    return NpEncoder().encode(result_dict),200

@app.route('/get_daily_sample/<topic>', methods=['GET'])
def get_daily_sample_fun(topic):
    result_list = get_daily_sample(topic)
    if not result_list:
        return Response("Bad Request! Didn't find data for "+topic, status=400)
    result_dict ={"data":result_list}
    return NpEncoder().encode(result_dict),200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)

