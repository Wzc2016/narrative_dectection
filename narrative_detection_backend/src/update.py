#%%
from flask import Flask, request, Response, jsonify
import json
import sys
import copy
import os
import requests
import pandas as pd
date_dict = {
            "Jan":"01",
            "Feb":"02",
            "Mar":"03",
            "Apr":"04",
            "May":"05",
            "Jun":"06",
            "Jul":"07",
            "Aug":"08",
            "Sep":"09",
            "Oct":"10",
            "Nov":"11",
            "Dec":"12"
            }
data_path = "/data"
input_file = "Leg_Tuck.csv"
command_run = os.system("python3 run.py --pathA N --pathD ../sample/"+input_file+" --pathK N --fastmode Y --N 3 --kthreshold 2 --uthreshold 1")
res_dict = {"positive":0, "negative":0, "neutral":0}
label_file = open("../label/BSMF.label","r")
date_df = pd.read_csv("../sample/"+input_file, sep='\t')
label_line = label_file.readline()
label_to_date = []
count = 0
while label_line:
    label = label_line.split("\t")[-1][:-1]
    date = date_df.iloc[count]["date"]
    date = date_dict[date[0:3]]+date[4:6]+date[7:]
    text = date_df.iloc[count]["rawTweet"]
    label_to_date.append([date,label,text])
    label_line = label_file.readline()
    count+=1
label_to_date_df = pd.DataFrame(label_to_date,columns=["date","label","text"])
# Calculate the average polarization, the larger the more positive
one_df = label_to_date_df.loc[label_to_date_df["label"]=="1"]
one_data_list = [{"text": t, "query": input_file.split(".")[0].replace("_"," ")} for t in one_df["text"]]
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
two_data_list = [{"text": t, "query": input_file.split(".")[0].replace("_"," ")} for t in two_df["text"]]
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
label_to_date_df.to_csv("../results/"+input_file, header=True, index=False, sep="\t")


# %%
