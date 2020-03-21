# How to run

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
{'text': '@IntyMedia #ChineseVirus', 'id': 1240885384688492544, 'created_at': 'Fri Mar 20 06:18:24 +0000 2020', 'user_id': 700744842289123328}
{'text': 'RT @EvaSaraLandau: @patriciajaniot @POTUS Is not xenophobia, is another way to call the virus, #coronavirus = #ChineseVirus', 'id': 1240885376354566144, 'created_at': 'Fri Mar 20 06:18:22 +0000 2020', 'user_id': 627798694}
{'text': '@petracostal @EmbaixadaChina #ChineseVirus #VirusChines', 'id': 1240885347724263426, 'created_at': 'Fri Mar 20 06:18:16 +0000 2020', 'user_id': 930427013801881605}
{'text': 'RT @loves_nra: BREAKING:\n\nDue to the #ChineseVirus ...\n\nNew Jersey state will permanently shut down all barber shops, beauty &amp; nail salons…', 'id': 1240885330053443585, 'created_at': 'Fri Mar 20 06:18:11 +0000 2020', 'user_id': 339217151}
{'text': 'Join the #CleanHands @ https://t.co/RA147fKf34 #CoronaVirusUpdate #WuhanVirus #ChineseVirus #CV19 #COVID19 https://t.co/nvdKvubRgP', 'id': 1240885313259499521, 'created_at': 'Fri Mar 20 06:18:07 +0000 2020', 'user_id': 784589581756854272}
{'text': 'RT @pauloeneas: O embaixador da China no Brasil agrediu nossa soberania e quebrou uma das regras da diplomacia ao fazer ingerência em assun…', 'id': 1240885313163145217, 'created_at': 'Fri Mar 20 06:18:07 +0000 2020', 'user_id': 53698103}
```
