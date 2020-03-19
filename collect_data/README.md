## How to run

There are two options. You can run

```
python3 collect.py Trump 100
```

which means to collect data of 100 recent posts with hashtag 'Trump'.

Or you can run

```
python3 collect.py Trump
```

which means to collect data of 15 recent posts with hashtag 'Trump'.

You can find data in the file 'output.txt'.

Sample output:

```c
{'text': 'RT @pollsofpolitics: Who is or would be the better #POTUS, @JoeBiden or @realDonaldTrump??\n\nPlease Vote and Retweet to spread poll. Thanks!…', 'id': 1240439968406831104, 'source': '<a href="https://mobile.twitter.com" rel="nofollow">Twitter Web App</a>', 'geo': None, 'metadata': {'iso_language_code': 'en', 'result_type': 'recent'}, 'id_str': '1240439968406831104', 'created_at': 'Thu Mar 19 00:48:29 +0000 2020'}
{'text': 'Exactly, because I believe that #trump &amp; #GOP R not doing anything because they want it to go to November and then… https://t.co/VbRAk5CzcY', 'id': 1240439963910656002, 'source': '<a href="https://mobile.twitter.com" rel="nofollow">Twitter Web App</a>', 'geo': None, 'metadata': {'iso_language_code': 'en', 'result_type': 'recent'}, 'id_str': '1240439963910656002', 'created_at': 'Thu Mar 19 00:48:28 +0000 2020'}
{'text': "RT @mterr337: @bocacurly @RichDish @AntonKreitzer5 @inky_mark @politico #trump can't unilaterally postpone or cancel an election. It's a ve…", 'id': 1240439953747775489, 'source': '<a href="http://twitter.com/download/android" rel="nofollow">Twitter for Android</a>', 'geo': None, 'metadata': {'iso_language_code': 'en', 'result_type': 'recent'}, 'id_str': '1240439953747775489', 'created_at': 'Thu Mar 19 00:48:25 +0000 2020'}
{'text': 'RT @Lybio: 2015 @realDonaldTrump👍The greatest social program is a job. I will be the greatest jobs #BestPresidentEver that God ever created…', 'id': 1240439945380032512, 'source': '<a href="http://twitter.com/download/iphone" rel="nofollow">Twitter for iPhone</a>', 'geo': None, 'metadata': {'iso_language_code': 'en', 'result_type': 'recent'}, 'id_str': '1240439945380032512', 'created_at': 'Thu Mar 19 00:48:23 +0000 2020'}
{'text': 'RT @blaze0497: #Trump Is Making Moves To Keep America Safe!\n#coronavirus #COVID19 #COVID2019 #TrumpPandemic\n#FightCOVID19\n\nhttps://t.co/uHe…', 'id': 1240439932121841664, 'source': '<a href="http://twitter.com/download/android" rel="nofollow">Twitter for Android</a>', 'geo': None, 'metadata': {'iso_language_code': 'en', 'result_type': 'recent'}, 'id_str': '1240439932121841664', 'created_at': 'Thu Mar 19 00:48:20 +0000 2020'}
{'text': "Don't anyone say a thing when #Trump give himself a Purple 💜 and a Bronze 🌕 he'd be the 1st , it would be unprecedented 🤣🤣🤣\n#Wartimeidiot", 'id': 1240439925075595266, 'source': '<a href="http://twitter.com/download/android" rel="nofollow">Twitter for Android</a>', 'geo': None, 'metadata': {'iso_language_code': 'en', 'result_type': 'recent'}, 'id_str': '1240439925075595266', 'created_at': 'Thu Mar 19 00:48:19 +0000 2020'}
{'text': 'I will not pretend they are not lying cheating mass murdering corrupt men and women taking advantage of raping abus… https://t.co/MtbKhfIUrU', 'id': 1240439922126770176, 'source': '<a href="https://mobile.twitter.com" rel="nofollow">Twitter Web App</a>', 'geo': None, 'metadata': {'iso_language_code': 'en', 'result_type': 'recent'}, 'id_str': '1240439922126770176', 'created_at': 'Thu Mar 19 00:48:18 +0000 2020'}
{'text': 'RT @21WIRE: Incredible story here w/#Venezuela and #coronavirus. US-dominated IMF playing with lives now. Is #Trump Admin using #COVID19 cr…', 'id': 1240439918259777537, 'source': '<a href="http://twitter.com/download/android" rel="nofollow">Twitter for Android</a>', 'geo': None, 'metadata': {'iso_language_code': 'en', 'result_type': 'recent'}, 'id_str': '1240439918259777537', 'created_at': 'Thu Mar 19 00:48:17 +0000 2020'}
{'text': '@JoeMomma833 @rogertansey @holachola @wolflayla420 @AriadneBoudicca @MapleTommy @Nitemists @karenamyatt… https://t.co/jPAFaLIqWq', 'id': 1240439912350003200, 'source': '<a href="https://mobile.twitter.com" rel="nofollow">Twitter Web App</a>', 'geo': None, 'metadata': {'iso_language_code': 'en', 'result_type': 'recent'}, 'id_str': '1240439912350003200', 'created_at': 'Thu Mar 19 00:48:16 +0000 2020'}
{'text': 'Por Covid-19, #Trump limita cruces en frontera con #México  #Coronavirus - https://t.co/6PSUK6JMkf https://t.co/xtaHKkpa6s', 'id': 1240439895761584128, 'source': '<a href="http://www.lavozdgo.com" rel="nofollow">La Voz de Durango APPTwitter</a>', 'geo': None, 'metadata': {'iso_language_code': 'es', 'result_type': 'recent'}, 'id_str': '1240439895761584128', 'created_at': 'Thu Mar 19 00:48:12 +0000 2020'}
{'text': 'I guess #trump is now balking at signing it saying he rather spend money bailing out the hotel, cruise line and air… https://t.co/jWwzkuzCRx', 'id': 1240439880930357248, 'source': '<a href="http://twitter.com/download/iphone" rel="nofollow">Twitter for iPhone</a>', 'geo': None, 'metadata': {'iso_language_code': 'en', 'result_type': 'recent'}, 'id_str': '1240439880930357248', 'created_at': 'Thu Mar 19 00:48:08 +0000 2020'}
{'text': '@mitchellvii They want to blame Trump for the Virus,  thats why he continues to call it #ChineseVirus #Trump #winning', 'id': 1240439876169936897, 'source': '<a href="http://twitter.com/download/iphone" rel="nofollow">Twitter for iPhone</a>', 'geo': None, 'metadata': {'iso_language_code': 'en', 'result_type': 'recent'}, 'id_str': '1240439876169936897', 'created_at': 'Thu Mar 19 00:48:07 +0000 2020'}
{'text': 'From 1994, Trump acting like Trump in The Little Rascals #maga? #trump #omghespresident https://t.co/tyJ8S8ty92', 'id': 1240439874169249793, 'source': '<a href="http://twitter.com/download/iphone" rel="nofollow">Twitter for iPhone</a>', 'geo': None, 'metadata': {'iso_language_code': 'en', 'result_type': 'recent'}, 'id_str': '1240439874169249793', 'created_at': 'Thu Mar 19 00:48:06 +0000 2020'}
{'text': 'RT @ArifBrindel: Iran vs Amerika. Mantap betul ini lagu. Cocok buat si #Trump #wwlll #worldwar3 https://t.co/jc6agjP3GJ', 'id': 1240439864996155392, 'source': '<a href="http://twitter.com/download/android" rel="nofollow">Twitter for Android</a>', 'geo': None, 'metadata': {'iso_language_code': 'in', 'result_type': 'recent'}, 'id_str': '1240439864996155392', 'created_at': 'Thu Mar 19 00:48:04 +0000 2020'}
{'text': '@AP Bankrupting the #US like just another #Trump casino.\n\n#coronavirus \n#COVID19', 'id': 1240439859287937024, 'source': '<a href="http://twitter.com/download/android" rel="nofollow">Twitter for Android</a>', 'geo': None, 'metadata': {'iso_language_code': 'en', 'result_type': 'recent'}, 'id_str': '1240439859287937024', 'created_at': 'Thu Mar 19 00:48:03 +0000 2020'}
```
