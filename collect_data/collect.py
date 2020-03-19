import tweepy
from tweepy import OAuthHandler
from requests_oauthlib import OAuth1
import requests
import sys


def request_auth():
	oauth =  OAuth1(CONSUMER_KEY,
            client_secret=CONSUMER_SECRET,
            resource_owner_key=TOKEN_KEY,
            resource_owner_secret=TOKEN_SECRET)
	return oauth


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

		parameters = {"q": hashtag, "count": count, 'result_type': 'recent', 'include_entities': False}

		results = make_request(BASE_URL, parameters)

		my_keys = frozenset(('text', 'profile_image_url', 'to_user_id_str', 'from_user', 'from_user_id', 'to_user_id', 'geo', 'id', 'iso_language_code', 'from_user_id_str', 'source', 'id_str', 'created_at', 'metadata'))

		my_keys = [x for x in my_keys if x in results['statuses'][0].keys()]

		for item in results['statuses']:
			item_modified = { my_key: item[my_key] for my_key in my_keys }
			f.write(str(item_modified) + '\n')

	else:
		parameters = {"q": hashtag, 'result_type': 'recent', 'include_entities': False}

		results = make_request(BASE_URL, parameters)

		my_keys = frozenset(('text', 'profile_image_url', 'to_user_id_str', 'from_user', 'from_user_id', 'to_user_id', 'geo', 'id', 'iso_language_code', 'from_user_id_str', 'source', 'id_str', 'created_at', 'metadata'))

		my_keys = [x for x in my_keys if x in results['statuses'][0].keys()]

		for item in results['statuses']:
			item_modified = { my_key: item[my_key] for my_key in my_keys }
			f.write(str(item_modified) + '\n')

