//for setup the demo, you need run the DemoAQL in http://promethium.ics.uci.edu:19001/ interface
//the SetupAQL includes initialize, create [datatypes, datasets, functions, channels, feeds] and connect feeds
SetupAQL

//application creation in NewAppAQL by create [datatypes, datasets, broker], which should be done at http://128.195.52.128:8989/ by local access
NewAppAQL

//for feed dataset, run python3 FeedPub.py [datasetname port]
//the default ip is 'promethium.ics.uci.edu'
python3 FeedPub.py EmergencyReports 10001
python3 FeedPub.py EmergencyShelters 10002
python3 FeedPub.py UserLocations 10003


//for new version setup
check at [Demo Intro Release](https://docs.google.com/presentation/d/1-YWiU1oMdhn8FQILJWuPUvcoeZ8KKOUn3QZ8iZ37SVI/edit?usp=sharing)
