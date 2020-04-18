import tweepy
from tweepy import OAuthHandler
from tweepy.streaming import StreamListener
from tweepy import Stream
import time
import sys
import json
 
consumer_key = 'xWc4EaI2wEZ3goR1kfQlQlssI'
consumer_secret = '3Urw4ZdTf7MKa75kZ0nYdbumfNVF9Ouop5JWNTBC9WDFcTjSBs'
access_token = '1059619929735999491-ChYUHUmhECUlilBqaogEVhqmJDe5e0'
access_secret = 'ut3WWKrLHe5dvgxDKxWmWfgEwDHCmOm9zukp00fy2ZkrF'

class file_write_listener(StreamListener):
    def __init__(self):
        super(StreamListener, self).__init__()
        self.save_file = open('./datasets/{}.json'.format('_'.join(phrase_to_search)), 'w')
        self.tweets = []

    def on_data(self, tweet):
        self.tweets.append(json.loads(tweet))
        self.save_file.write(str(tweet))

    def on_error(self, status):
        print(status)
        return True
 
def call_api(stream, phrase):
    # If the time crosses the amount of time mentioned by t_end, then the tweet scrapping stops
    try:
        stream.filter(track=phrase)
    except Exception as e:
        print(e)
 
    # If the stream is already connected, the following will disconnect the stream and reconnect it
    if "Stream object already connected!" in str(e):
        stream.disconnect()
        # print("connecting again")
        stream.filter(track=phrase)
 
if __name__ == '__main__':
    
    phrase_to_search = list(sys.argv[1:])
    listener = file_write_listener()
    auth = OAuthHandler(consumer_key,consumer_secret)
    auth.set_access_token(access_token,access_secret)
    stream = Stream(auth, listener)
    call_api(stream, phrase_to_search)