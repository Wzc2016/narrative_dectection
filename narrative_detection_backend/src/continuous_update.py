#%%
from flask import Flask, request, Response, jsonify
import json
import copy
import os
import sys
import requests
import time
import json
import pandas as pd
from dateutil.parser import parse
import pathlib


#%%
if __name__ == '__main__':
    # collect data
    if len(sys.argv) != 2:
        print(sys.argv)
    start_time = time.time()
    hour_count = 0
    total_time = 0
    init_json = {"start_time":start_time,"data":[]}
    with open("../results/statistics/"+sys.argv[1]+"_statistics.json", 'w+') as fp:
        json.dump(init_json, fp)
    curr_hour_stat = [0,0,0,0]
    while hour_count<10:
        # positive, neutral, negative, total activity
        if(time.time()-start_time>(1+hour_count)*30):
            hour_count+=1
            curr_hour_stat[3] = curr_hour_stat[0]+curr_hour_stat[1]+curr_hour_stat[2]
            init_json["data"].append(curr_hour_stat)
            with open("../results/statistics/"+sys.argv[1]+"_statistics.json", 'w+') as fp:
                json.dump(init_json, fp)
            curr_hour_stat = [0,0,0,0]
            #write to statistic file
        command_run = os.system("python3 ../../collect_data/collect.py " + sys.argv[1] + " 100")
    #%%
        #run polarization detection model

        input_file = "extracted_datas/"+sys.argv[1]+"_extracted_data.csv"
        command_run = os.system("python3 run.py --pathA N --pathD ./"+input_file+" --pathK N --fastmode Y --N 3 --kthreshold 2 --uthreshold 1")
        # res_dict = {"positive":0, "negative":0, "neutral":0}
        raw_df = pd.read_csv("./"+input_file, sep='\t')

        label_file = open("../label/BSMF.label","r")
        label_list = []
        label_line = label_file.readline()
        count = 0
        while label_line:
            label = label_line.split("\t")[-1][:-1]
            date = raw_df.iloc[count]["date"]
            text = raw_df.iloc[count]["rawTweet"]
            label_list.append([date,label,text])
            label_line = label_file.readline()
            count+=1
        label_to_date_df = pd.DataFrame(label_list,columns=["date","label","text"])
        
        # Calculate the average polarization, the larger the more positive
        one_df = label_to_date_df.loc[label_to_date_df["label"]=="1"]
        one_data_list = [{"text": t, "query": sys.argv[1]} for t in one_df["text"]]
        r = requests.post(
            "http://www.sentiment140.com/api/bulkClassifyJson?appid=ajing2@illinois.edu ",
            data=json.dumps
            (
                {
                "data": one_data_list
                }
            )
        )
        if(len(one_data_list)==0):
            print("one_data_list null")
            one_avg_polarize = 2
        else:
            one_avg_polarize = sum(r.json()["data"][i]["polarity"] for i in range(0,len(one_data_list)))/len(one_data_list)

        two_df = label_to_date_df.loc[label_to_date_df["label"]=="2"]
        two_data_list = [{"text": t, "query": sys.argv[1]} for t in two_df["text"]]
        r = requests.post(
            "http://www.sentiment140.com/api/bulkClassifyJson?appid=ajing2@illinois.edu ",
            data=json.dumps
            (
                {
                "data": two_data_list
                }
            )
        )
        if(len(two_data_list)==0):
            print("two_data_list null")
            two_avg_polarize = 2
        else:
            two_avg_polarize = sum(r.json()["data"][i]["polarity"] for i in range(0,len(two_data_list)))/len(two_data_list)

        # Always make "1" more positive
        if (two_avg_polarize>one_avg_polarize):
            label_to_date_df = label_to_date_df.replace({'label':{"1":"20","2":"10"}})
            label_to_date_df = label_to_date_df.replace({'label':{"20":"2","10":"1"}})
            curr_hour_stat[0] += len(two_data_list)
            curr_hour_stat[1] += int(label_to_date_df.loc[label_to_date_df["label"]=="0"]["text"].count())
            curr_hour_stat[2] += len(one_data_list)

        file = pathlib.Path("../results/"+sys.argv[1]+"_result.csv")
        
        if file.exists():
            label_to_date_df.to_csv("../results/data/"+sys.argv[1]+"_result.csv", header=False, index=False, sep="\t", mode="a")
        else:
            label_to_date_df.to_csv("../results/data/"+sys.argv[1]+"_result.csv", header=True, index=False, sep="\t", mode="a")

        time.sleep(5)

# %%
# from dateutil.parser import parse
# parse("Feb_15_2020")

# # %%
# if __name__ == '__main__':
    
#     r = requests.post(
#         "http://www.sentiment140.com/api/bulkClassifyJson?appid=ajing2@illinois.edu ",
#         data=json.dumps
#         (
#             {
#             "data": [{"text": "I love Titanic.", "query":"Titanic"}, 
#                      {"text": "Titanic is an American movie"},
#                      {"text": "I hate Titanic.", "query":"Titanic"}]
#             }
#         )
#     )
#     print(r.json())
