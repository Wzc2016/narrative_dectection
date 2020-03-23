import tweepy
from tweepy import OAuthHandler
from requests_oauthlib import OAuth1
import requests
import pandas as pd
import sys
import json

def request_auth():
	oauth =  OAuth1(CONSUMER_KEY,
            client_secret=CONSUMER_SECRET,
            resource_owner_key=TOKEN_KEY,
            resource_owner_secret=TOKEN_SECRET)
	return oauth


since_id = 0


with open('./max_ids.json') as f:
  data = json.load(f)

try:
	since_id = data[sys.argv[1]]
except:
	pass


def make_request(baseurl, params):
	response = requests.get(BASE_URL, 
                        params=params, 
                        auth=oauth)
	return response.json()

if __name__ == '__main__':
	CONSUMER_KEY = 'xWc4EaI2wEZ3goR1kfQlQlssI'
	CONSUMER_SECRET = '3Urw4ZdTf7MKa75kZ0nYdbumfNVF9Ouop5JWNTBC9WDFcTjSBs'
	TOKEN_KEY = '1059619929735999491-ChYUHUmhECUlilBqaogEVhqmJDe5e0'
	TOKEN_SECRET = 'ut3WWKrLHe5dvgxDKxWmWfgEwDHCmOm9zukp00fy2ZkrF'
	
	BASE_URL = "https://api.twitter.com/1.1/search/tweets.json"
	
	f = open("output.txt","w+")
	oauth = request_auth()

	if len(sys.argv) != 3 and len(sys.argv) != 2:
		print(sys.argv)
		raise ValueError("The format should be python3 collect.py KEYWORD COUNT or python3 collect.py KEYWORD")

	hashtag = '#' + sys.argv[1]

	if len(sys.argv) == 3:
		count = int(sys.argv[2])

		

		parameters = {"q": hashtag, "count": count, 'result_type': 'recent', 'include_entities': False, 'since_id': since_id}

		results = make_request(BASE_URL, parameters)

		with open('./max_ids.json', 'w') as f2:
			data[sys.argv[1]] = results['search_metadata']['max_id']
			f2.write(json.dumps(data))
		# my_keys = ['user', 'text', 'profile_image_url', 'to_user_id_str', 'from_user', 'from_user_id', 'to_user_id', 'geo', 'id', 'iso_language_code', 'from_user_id_str', 'source', 'id_str', 'created_at', 'metadata']

		# my_keys = [x for x in my_keys if x in results['statuses'][0].keys()]

		my_keys = ['text', 'id', 'created_at']
		data_list = []

		for item in results['statuses']:
			item_modified = { my_key: item[my_key] for my_key in my_keys }
			item_modified['user_id'] = item['user']['id']
			f.write(str(item_modified) + '\n')
			data_list.append([item_modified['user_id'], item_modified['text'], item_modified['created_at'][4:10]+item_modified['created_at'][-5:]])
		extracted_dataframe = pd.DataFrame(data_list,columns=["name","rawTweet","date"])	
		extracted_dataframe.to_csv("./extracted_data.csv", header=True, index=False, sep="\t")
	else:
		parameters = {"q": hashtag, 'result_type': 'recent', 'include_entities': False, 'since_id': since_id}

		results = make_request(BASE_URL, parameters)
		with open('./max_ids.json', 'w') as f2:
			data[sys.argv[1]] = results['search_metadata']['max_id']
			f2.write(json.dumps(data))
		# print(results['search_metadata'])
		# my_keys = ['user', 'text', 'profile_image_url', 'to_user_id_str', 'from_user', 'from_user_id', 'to_user_id', 'geo', 'id', 'iso_language_code', 'from_user_id_str', 'source', 'id_str', 'created_at', 'metadata']

		# my_keys = [x for x in my_keys if x in results['statuses'][0].keys()]

		my_keys = ['text', 'id', 'created_at']
		data_list = []
		for item in results['statuses']:
			item_modified = { my_key: item[my_key] for my_key in my_keys }
			item_modified['user_id'] = item['user']['id']
			f.write(str(item_modified) + '\n')
			data_list.append([item_modified['user_id'], item_modified['text'], item_modified['created_at'][4:10]+item_modified['created_at'][-5:]])
		extracted_dataframe = pd.DataFrame(data_list,columns=["name","rawTweet","date"])	
		extracted_dataframe.to_csv("./extracted_data.csv", header=True, index=False, sep="\t")

