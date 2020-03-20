from flask import Flask, request, Response, jsonify
import json
import copy
import os
import numpy as np
import pandas as pd
from bson import ObjectId
app = Flask(__name__)
data_path = "/data"


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

def get_result(output_file):
    data_df = pd.read_csv(output_file, sep='\t', dtype={'date': str})
    res_dict = {"positive":0, "negative":0, "neutral":0}
    pos_df = data_df.loc[data_df['label']==1]
    neg_df = data_df.loc[data_df['label']==2]
    neu_df = data_df.loc[data_df['label']==0]
    res_dict = {"positive":pos_df['label'].count(), "negative":neg_df['label'].count(), "neutral":neu_df['label'].count()}
    if res_dict["positive"]<res_dict["negative"]:
        res_dict["positive"],res_dict["negative"] = res_dict["negative"],res_dict["positive"]
    return res_dict

def get_date_result(output_file, date):
    res_dict = {"positive":0, "negative":0, "neutral":0}
    data_df = pd.read_csv(output_file, sep='\t', dtype={'date': str})
    date_df = data_df.loc[data_df['date']==date]
    pos_df = date_df.loc[date_df['label']==1]
    neg_df = date_df.loc[date_df['label']==2]
    neu_df = date_df.loc[date_df['label']==0]
    res_dict = {"positive":pos_df['label'].count(), "negative":neg_df['label'].count(), "neutral":neu_df['label'].count()}
    if res_dict["positive"]<res_dict["negative"]:
        res_dict["positive"],res_dict["negative"] = res_dict["negative"],res_dict["positive"]
    return res_dict

def get_all_result(output_file):
    res_dict = {}
    data_df = pd.read_csv(output_file, sep='\t', dtype={'date': str})
    for date in data_df.date.unique():
        curr_res_dict = {"positive":0, "negative":0, "neutral":0}
        date_df = data_df.loc[data_df['date']==date]
        pos_df = date_df.loc[date_df['label']==1]
        neg_df = date_df.loc[date_df['label']==2]
        neu_df = date_df.loc[date_df['label']==0]
        curr_res_dict = {"positive":pos_df['label'].count(), "negative":neg_df['label'].count(), "neutral":neu_df['label'].count()}
        if curr_res_dict["positive"]<curr_res_dict["negative"]:
            curr_res_dict["positive"],curr_res_dict["negative"] = curr_res_dict["negative"],curr_res_dict["positive"]
        res_dict[str(date)] = curr_res_dict
    return res_dict

# @app.route('/polar_result/<dataset>/<date>', methods=['GET'])
# def get_by_date(dataset,date):
#     # date: MMDDYYYY 02012020
#     # dataset: ACFT, Leg_Tuck
#     formatted_date = date.replace("_"," ")
#     if not date:
#         return Response("Bad Request! No date specified", status=400)
#     if not dataset:
#         return Response("Bad Request! No dataset specified", status=400)
#     out_file = "../results/"+dataset+".csv"
#     res_dict = get_date_result(out_file,formatted_date)
#     # res_dict = {'positive': 68, 'negative': 25, 'neutral': 23}
#     return NpEncoder().encode(res_dict),200

# @app.route('/polar_result/<dataset>/<date1>/<date2>', methods=['GET'])
# def get_by_range(dataset,date1,date2):
#     # date1: MMDDYYYY 02012020 start date
#     # date1: MMDDYYYY 02012020 end date
#     # dataset: ACFT, Leg_Tuck
#     res_dict = {"positive":0, "negative":0, "neutral":0}
#     if not date1:
#         return Response("Bad Request! No date specified", status=400)
#     if not date2:
#         return Response("Bad Request! No date specified", status=400)
#     if not dataset:
#         return Response("Bad Request! No dataset specified", status=400)
#     out_file = "../results/"+dataset+".csv"
#     date1 = date1[-4:]+date1[0:-4]
#     date2 = date2[-4:]+date2[0:-4]
#     # print(date1)
#     # print(date2)
#     for i in range(int(date1),int(date2)+1):
#         print(i)
#         curr_date = str(i)[4:]+str(i)[0:4]
#         curr_dict = get_date_result(out_file,curr_date)
#         print(curr_date)
#     # res_dict = {'positive': 68, 'negative': 25, 'neutral': 23}
#         res_dict["positive"]+=curr_dict["positive"]
#         res_dict["negative"]+=curr_dict["negative"]
#         res_dict["neutral"]+=curr_dict["neutral"]
#     return NpEncoder().encode(res_dict),200

# @app.route('/polar_result/<dataset>', methods=['GET'])
# def get_all(dataset):
#     # dataset: ACFT, Leg_Tuck
#     if not dataset:
#         return Response("Bad Request! No dataset specified", status=400)
#     out_file = "../results/"+dataset+".csv"
#     res_dict = get_all_result(out_file)
#     # res_dict = {'positive': 68, 'negative': 25, 'neutral': 23}
#     return NpEncoder().encode(res_dict),200

@app.route('/polar_result/<dataset>', methods=['GET'])
def get_results(dataset):
    # dataset: ACFT, Leg_Tuck
    if not dataset:
        return Response("Bad Request! No dataset specified", status=400)
    command_run = os.system("python3 ./update_all_data.py " + dataset)
    out_file = "../results/result.csv"
    res_dict = get_result(out_file)
    # res_dict = {'positive': 68, 'negative': 25, 'neutral': 23}
    return NpEncoder().encode(res_dict),200

if __name__ == '__main__':
    # print(get_date_result("../results/ACFT.csv","Feb 01 2020"))
    # print(get_all_result("../results/ACFT.csv"))
    app.run(host='0.0.0.0', port=8000, debug=True)
    # command_run = os.system("python3 ./update_all_data.py " + "covid-19")
# def get_all_result(output_file):
#     file = open(output_file,"r")
#     curr_line = file.readline()
#     while curr_line:
#         polarization = curr_line.split("\t")[1].strip()
#         if polarization=="0":
#             res_dict["neutral"]+=1
#         elif polarization=="1":
#             res_dict["positive"]+=1
#         else:
#             res_dict["negative"]+=1
#         curr_line = file.readline()
#     if res_dict["positive"]<res_dict["negative"]:
#         res_dict["positive"],res_dict["negative"] = res_dict["negative"],res_dict["positive"]
#     return res_dict

# def exec_model(input_file):
#     try:
#         os.chdir("./narrative-detection/src")
#     except:
#         pass
#     command_run = os.system("python3 run.py --pathA N --pathD ../sample/"+input_file+" --pathK N --fastmode Y --N 3 --kthreshold 2 --uthreshold 1")
#     return command_run

# def get_result(output_file):
#     try:
#         os.chdir("./narrative-detection/src")
#     except:
#         pass
#     res_dict = {"positive":0, "negative":0, "neutral":0}
#     file = open(output_file,"r")
#     curr_line = file.readline()
#     while curr_line:
#         polarization = curr_line.split("\t")[1].strip()
#         if polarization=="0":
#             res_dict["neutral"]+=1
#         elif polarization=="1":
#             res_dict["positive"]+=1
#         else:
#             res_dict["negative"]+=1
#         curr_line = file.readline()
#     if res_dict["positive"]<res_dict["negative"]:
#         res_dict["positive"],res_dict["negative"] = res_dict["negative"],res_dict["positive"]
#     return res_dict

# # exec_model("Feb_01_2020.csv")
# # print(get_result("../label/BSMF.label"))

# @app.route('/polar_result/<dataset>/<date>', methods=['GET'])
# def get_by_date(dataset,date):
#     # date: MM_DD_YYYY Feb_01_2020
#     # First letter of month capital letter
#     # dataset: ACFT, Leg_Tuck
#     if not date:
#         return Response("Bad Request! No date specified", status=400)
#     if not dataset:
#         return Response("Bad Request! No dataset specified", status=400)
#     file_name = dataset+"/"+date+".csv"
#     res = exec_model(file_name)
#     if(res!=0):
#         return Response("Bad Date! No data for that date", status=400)
#     res_dict =  get_result("../label/BSMF.label")
#     return JSONEncoder().encode(res_dict),200

# @app.route('/polar_result/', methods=['GET'])
# def get_all():
#     # MM_DD_YYYY
#     # First letter of month capital letter
#     date_list = []
#     for i in range(1,10):
#         date_list.append("Feb_0"+str(i)+"_2020")
#     for i in range(10,17):
#         date_list.append("Feb_"+str(i)+"_2020")
#     for i in range(24,32):
#         date_list.append("Jan_"+str(i)+"_2020")
#     date_set = set(date_list)
#     res_dict = {}
#     for date in date_set:
#         file_name = date+".csv"
#         res = exec_model(file_name)
#         if(res!=0):
#             curr_res_dict = {"positive":0, "negative":0, "neutral":0}
#         else:
#             curr_res_dict =  get_result("../label/BSMF.label")
#         res_dict[date] = curr_res_dict
#     return JSONEncoder().encode(res),200



