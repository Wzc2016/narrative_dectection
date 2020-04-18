- step1:
    mkdir datasets
    python run.py key1 key2 ... keyn
    - you will find raw tweet data files
        - ./datasets/key1_key2_..._keyn/xxx.json
        - one file for every hour

- step2:
    mkdir extracted
    python clean.py
    - you will find those extracted files   
        - ./extracted/key1_key2_..._keyn/xxx.csv
        - one file for every hour
    - you will find a check.list in ./datasets/key1_key2_..._keyn/check.list
        - record the files we have processed

- step3:
    mkdir output
    python run.py
    - you will find those file needed for visualization
        - ./output/key1_key2_..._keyn/xxx
        - self_quarantine_3.topTweets is the sample tweets files (already tagged neutral, positive, negative)
        - check.list (total count for neutral, positive, negative)



