import tweepy
from tweepy import OAuthHandler
from requests_oauthlib import OAuth1
import requests
import pandas as pd
import sys
import json
import time

def request_auth():
    oauth =  OAuth1(CONSUMER_KEY,client_secret=CONSUMER_SECRET,resource_owner_key=TOKEN_KEY,resource_owner_secret=TOKEN_SECRET)
    return oauth

since_id = 0
with open('./max_ids.json', 'r+') as f:
    data = json.load(f)

try:
    since_id = data[sys.argv[1]]
except:
    pass

def make_request(baseurl, params):
    response = requests.get(BASE_URL,params=params,auth=oauth)
    return response.json()

if __name__ == '__main__':
    CONSUMER_KEY = 'xWc4EaI2wEZ3goR1kfQlQlssI'
    CONSUMER_SECRET = '3Urw4ZdTf7MKa75kZ0nYdbumfNVF9Ouop5JWNTBC9WDFcTjSBs'
    TOKEN_KEY = '1059619929735999491-ChYUHUmhECUlilBqaogEVhqmJDe5e0'
    TOKEN_SECRET = 'ut3WWKrLHe5dvgxDKxWmWfgEwDHCmOm9zukp00fy2ZkrF'

    BASE_URL = "https://api.twitter.com/1.1/search/tweets.json"

    f = open("output.txt","w+")
    oauth = request_auth()
    
    flag = True
    
    topic = ' '.join(sys.argv[1:])
    parameters = {"q": topic, "count": 100, 'result_type': 'recent', 'include_entities': False, 'since_id': since_id, 'truncated': True}
    
    while flag:
        results = make_request(BASE_URL, parameters)
        print(results)
        if len(results['statuses'])>50:
            print(len(results['statuses']))
            with open('./max_ids.json', 'w') as f2:
                data[sys.argv[1]] = results['search_metadata']['max_id']
                f2.write(json.dumps(data))
            my_keys = ['text', 'id', 'created_at']
            data_list = []
            for item in results['statuses']:
                item_modified = { my_key: item[my_key] for my_key in my_keys }
                item_modified['user_id'] = item['user']['id']
                item_modified['url'] = 'https://twitter.com/'+item['user']['screen_name']+'/status/'+item['id_str'];
                f.write(str(item_modified) + '\n')
                data_list.append([item_modified['user_id'], item_modified['text'], item_modified['created_at'][4:10]+item_modified['created_at'][-5:], item_modified['url']])
            extracted_dataframe = pd.DataFrame(data_list,columns=["name","rawTweet","date","url"])
            extracted_dataframe.to_csv("./extracted_datas/"+topic.replace(" ","_")+"_extracted_data.csv", header=True, index=False, sep="\t")
            flag = False
        else:
            time.sleep(5)
