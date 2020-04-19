from utils import decompostition, Mmodule, Smodule, getKeyMatrix, getData
from sklearn.metrics import accuracy_score
from itertools import permutations
import matplotlib.pyplot as plt
import numpy as np
import argparse
import os
import json
import time
import requests

# settings
parser = argparse.ArgumentParser()
parser.add_argument('--pathD', default='hawaii',
                    help='path of main data file')
parser.add_argument('--pathK', default='N',
                    help='path of keywordList')
parser.add_argument('--fastmode', default='Y',
                    help='use M-module or not (Y or N)')
parser.add_argument('--seed', type=int, default=150, help='Random seed.')
parser.add_argument('--l1', type=float, default=0.001,
                    help='coefficient of l1-norm')
parser.add_argument('--l2', type=float, default=0.001,
                    help='coefficient of l2-norm')
parser.add_argument('--N', type=int, default=4,
                    help='dimension of beliefs.')
parser.add_argument('--epochs', type=int, default=150,
                    help='number of iterations')
parser.add_argument('--process', type=int, default=40,
                    help='number of available processes')
parser.add_argument('--kthreshold', type=int, default=8,
                    help='the number of minimun keywords contained in processed text')
parser.add_argument('--uthreshold', type=int, default=4,
                    help='the mininum frequency of user occurance')
parser.add_argument('--outpath', type=str,
                    help='output path')

args = parser.parse_args()

def getResult(mode, tweetMap, data, X, N, l1, l2, epochs):
    # plt.figure(figsize=(5, 4))
    U, M, loss, B  = decompostition(X, mode, N, l1, l2, epochs)
    # plt.plot(loss)
    # plt.title(mode + ' Loss')

    tempMap = []
    result = []
    for tweet in data.postTweet:
        tempMap.append(M[tweetMap[tweet], :])
        result.append(M[tweetMap[tweet], :].tolist())
    
    return np.argmax(tempMap, axis=1), M

def scoreResult(pre, gt, mode):

    Map = {'0': 0, 
        '1': 1,
        '2': 2,
        '3': 3}

    JudgeList = []
    if mode == 'BSMF':
        for permu in permutations([1, 2, 3]):
            Map2 = {0: 0, 1: permu[1], 2: permu[2], 3: permu[0]}
            tempTarget = [Map2[Map[t]] for t in gt]
            JudgeList.append(accuracy_score(pre, tempTarget))
    else:
        for permu in permutations([0, 1, 2, 3]):
            Map2 = {0: permu[0], 1: permu[1], 2: permu[2], 3: permu[3]}
            tempTarget = [Map2[Map[t]] for t in gt]
            JudgeList.append(accuracy_score(pre, tempTarget))
    return JudgeList

def Polarize(sigma, outpath, N):
    content = []
    with open('./output/{}/{}_{}.topTweets'.format(outpath, outpath, N), 'r') as outfile:
        for line in outfile.readlines():
            content.append(line[:-1])
    TEXT = content[2:62:2] + content[66:126:2] + content[130:190:2]
    pre = [0 for _ in range(30)] + [1 for _ in range(30)] + [2 for _ in range(30)]

    r = requests.post(
            "http://www.sentiment140.com/api/bulkClassifyJson?appid=ajing2@illinois.edu ",
            data=json.dumps
            (
                {
                    "data": [{"text": text, "query": ' '.join(outpath.split(' ')[:-1])} for text in TEXT]
                }
            )
        )
    polarity = np.array([item['polarity'] for item in r.json()['data']])
    assign1 = (polarity + 1) % 3; assign2 = (polarity // 2 + 2) % 3                                                                    
    if accuracy_score(assign1, pre) > accuracy_score(assign2, pre):
        content[0], content[64], content[128] = 'neutral', 'negative', 'positive'
    else:
        content[0], content[64], content[128] = 'neutral', 'positive', 'negative'

    with open('./output/{}/{}_{}.topTweets'.format(outpath, outpath, N), 'w') as outfile:
        for line in content:
            print (line, file=outfile)

def outputNarrative(pre, tweetMap, data, M, N, outpath):

    if not os.path.exists('./output/{}'.format(outpath)):
        os.makedirs('./output/{}'.format(outpath))

    # output predicted score
    with open('./output/{}/{}_{}.label'.format(outpath, outpath, N), 'w') as outfile:
        temp = {}
        for i in range(N):
            temp['category{}'.format(i+1)] = sum(pre == i)
        print (temp, file = outfile)
        # for tweet, l in zip(data['rawTweet'], pre):
        #     print ('{}\t{}'.format(tweet, l), file = outfile)

    # output top tweets
    delta = 0.01
    sigma = 30

    with open('./output/{}/{}_{}.topTweets'.format(outpath, outpath, N), 'w') as outfile:
        print ('N = {}'.format(N))
        for i in range(N):
            print ('Narrative', i+1, file=outfile)
            print ('---------------------------', file=outfile)
            tempMap = []

            for tweet in data.postTweet:
                tempMap.append(M[tweetMap[tweet], i])
            tempMap = np.argsort(-np.array(tempMap))

            keyPocket = set()
            s = 0

            for i, (tweet, postTweet) in enumerate(data[['rawTweet', 'postTweet']].iloc[tempMap].values):
                if s >= sigma:
                    break
                # jaccard
                key = postTweet.split()
                if len(set(key) - keyPocket) / (len(keyPocket) + 1) >= delta:
                    print (tweet, file=outfile)
                    print ('-------------', file=outfile)
                    s += 1
                for item in key:
                    keyPocket.add(item)
            print (keyPocket, file=outfile)
            print(file=outfile)
    
    # for positive, negative and neutral
    if N == 3:
        try:
            checked = json.loads(open('./output/{}/check.list'.format(dir_i)).readlines()[-1][:-1])
            positive = int(checked['positive'])
            negative = int(checked['negative'])
            neutral = int(checked['neutral'])
            timestamp = int(checked['time'])
        except:
            positive, negative, neutral, timestamp = 0, 0, 0, 0
        
        temp = data[data.time > timestamp]
        pre = pre[-len(temp):]

        r = requests.post(
                "http://www.sentiment140.com/api/bulkClassifyJson?appid=ajing2@illinois.edu ",
                data=json.dumps
                (
                    {
                    "data": [{"text": text, "query": ' '.join(outpath.split(' ')[:-1])} for text in temp.rawTweet]
                    }
                )
        )
        polarity = np.array([item['polarity'] for item in r.json()['data']])
        assign1 = (polarity + 1) % 3; assign2 = (polarity // 2 + 2) % 3
        if accuracy_score(assign1, pre) > accuracy_score(assign2, pre):
            positive += int(sum(pre == 2))
            negative += int(sum(pre == 1))
            neutral += int(sum(pre == 0))
        else:
            positive += int(sum(pre == 1))
            negative += int(sum(pre == 2))
            neutral += int(sum(pre == 0))
        file_name = sorted(os.listdir('./extracted/{}'.format(outpath)), reverse=True)[0]
        timestamp = int(file_name.split('_')[-1][:-4])
        with open('./output/{}/check.list'.format(outpath), 'a') as outfile:
            json.dump({'positive': positive, 'negative':negative, 'neutral':neutral, 'time': timestamp}, outfile)
            print (file=outfile)

        Polarize(sigma, outpath, N)

def run(pathD=args.pathD, pathK=args.pathK, fastmode=args.fastmode, \
    N=args.N, l1=args.l1, l2=args.l2, epochs=args.epochs, K=args.process, outpath=args.outpath):

    np.random.seed(args.seed)

    # pre-processing
    data = getData(pathD, pathK, args.kthreshold, args.uthreshold)
    # A = Smodule(data.name.unique().tolist(), pathA=args.pathA)
    _, tweetMap, _, tweetKey, userTweet, userTweet2 = getKeyMatrix(data)
    if fastmode == 'N':
        userTweet = Mmodule(userTweet, tweetKey, K)
        X = A @ userTweet
    elif fastmode == 'Y':
        X = userTweet2

    mode = 'BSMF'
    pre, M = getResult(mode, tweetMap, data, X, N, l1, l2, epochs)
    outputNarrative(pre, tweetMap, data, M, N, outpath)

if __name__ == '__main__':
    while 1:
        print ('Start Algorithms!')
        for dir_i in os.listdir('./extracted'):
            if dir_i == '.DS_Store':
                continue
            # check whether need to run
            try:
                checked = json.loads(open('./output/{}/check.list'.format(dir_i)).readlines()[-1][:-1])
                timestamp = int(checked['time'])
                file_name = sorted(os.listdir('./extracted/{}'.format(dir_i)), reverse=True)[0]
                file_time = int(file_name.split('_')[-1][:-4])
                print (timestamp, file_time)
                if timestamp == file_time:
                    break # no check
            except:
                pass

            if len(os.listdir('./extracted/{}'.format(dir_i))) == 0:
                continue
            for N in range(3, 6):
                run(pathD=dir_i, pathK=args.pathK, fastmode=args.fastmode, \
                    N=N, l1=args.l1, l2=args.l2, epochs=args.epochs, K=args.process, outpath=dir_i)
        print ('finished!')
        # traverse every 1 hour
        time.sleep(60 * 60)
