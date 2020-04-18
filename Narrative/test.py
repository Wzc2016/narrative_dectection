import pandas as pd
from sklearn.metrics import accuracy_score

outpath = 'self_quarantine'
N = 3

content = []
with open('./output/{}/{}_{}.topTweets'.format(outpath, outpath, N), 'r') as outfile:
    for line in outfile.readlines():
        content.append(line[:-1])

    print (content[0], content[64], content[128])
