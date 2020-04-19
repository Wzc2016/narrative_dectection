import pandas as pd
import sys
import time
import os
import json
import datetime

def process(Dir, File):
    print (Dir, File)
    if not os.path.exists('./extracted/{}'.format(Dir)):
        os.mkdir('./extracted/{}'.format(Dir))
    data = []
    with open('./datasets/{}/{}'.format(dir_i, file_j), 'r') as infile:
        for tweet in infile.readlines():
            data.append(json.loads(tweet))
    with open('./extracted/{}/{}.csv'.format(dir_i, file_j[:-5]), 'w') as outfile:
        print ('name\trawTweet\ttime', file=outfile)
        for tweet in data:
            try:
                user = tweet['user']['id']
                text = tweet['text'].replace('\n', ' ') + ' ' + \
                    'https://twitter.com/' + tweet['user']['screen_name'] + '/status/' + tweet['id_str']
                time = int(datetime.datetime.strptime(tweet['created_at'], "%a %b %d %H:%M:%S  +0000 %Y").timestamp())
                print ('{}\t{}\t{}'.format(user, text, time), file=outfile)
            except:
                pass
            
while 1:
    print ('Start Processing!')
    for dir_i in os.listdir('./datasets'):
        if dir_i == '.DS_Store':
            continue
        checked = []
        try:
            check_file = open('./datasets/{}/check.list'.format(dir_i), 'r')
            for checked_file in check_file.readlines():
                checked.append(checked_file[:-1]) 
            check_file.close(); check_file = open('./datasets/{}/check.list'.format(dir_i), 'a')
        except:
            check_file = open('./datasets/{}/check.list'.format(dir_i), 'w')
        
        for file_j in os.listdir('./datasets/{}'.format(dir_i)):
            if file_j not in checked and file_j != 'check.list':
                process(dir_i, file_j)
                print (file_j, file=check_file)
        check_file.close()
    # traverse every 1 hour
    print ('finished')
    time.sleep(60 * 60)
    
