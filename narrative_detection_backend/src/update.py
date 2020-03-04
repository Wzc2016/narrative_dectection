#%%
from flask import Flask, request, Response, jsonify
import json
import copy
import os
import pandas as pd
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
    label = label_line.split("\t")[-1]
    date = date_df.iloc[count]["date"]
    label_to_date.append([date,label])
    label_line = label_file.readline()
    count+=1
label_to_date_df = pd.DataFrame(label_to_date,columns=["date","label"])
label_to_date_df.to_csv("../results/Leg_Tuck.csv", header=True, index=False, sep="\t")


# %%
