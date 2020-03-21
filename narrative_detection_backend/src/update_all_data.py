#%%
from flask import Flask, request, Response, jsonify
import json
import copy
import os
import sys
import pandas as pd
from dateutil.parser import parse

#%%
if __name__ == '__main__':
    # collect data
    if len(sys.argv) != 2:
        print(sys.argv)
    command_run = os.system("python3 ../../collect_data/collect.py " + sys.argv[1] + " 100")
    
    
#%%    
    #run polarization detection model

    input_file = "extracted_data.csv"
    command_run = os.system("python3 run.py --pathA N --pathD ./"+input_file+" --pathK N --fastmode Y --N 3 --kthreshold 2 --uthreshold 1")
    # res_dict = {"positive":0, "negative":0, "neutral":0}
    label_file = open("../label/BSMF.label","r")
    label_list = []
    label_line = label_file.readline()
    while label_line:
        label = label_line.split("\t")[-1]
        label_list.append(label)
        label_line = label_file.readline()
    

    label_to_date_df = pd.DataFrame(label_list,columns=["label"])
    label_to_date_df.to_csv("../results/result.csv", header=True, index=False, sep="\t")


# %%
# from dateutil.parser import parse
# parse("Feb_15_2020")

# %%
