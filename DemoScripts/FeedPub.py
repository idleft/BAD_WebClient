#!/bin/env python3
import sys
import simplejson as json
import time
import datetime
import requests
from socket import socket
import uuid


ip = 'promethium.ics.uci.edu'
#port1 = 10001


def feedRecord(filename,port):
    jsonfile = filename + '.json'
    lastOffset = 0
    sock1 = socket()
    sock1.connect((ip, int(port)))
    # currentTime = datetime.datetime.utcnow()

    with open(jsonfile) as f:
        for line in f.readlines():
            record = json.loads(line)

            timestamp = None
            location = None
            impactZone = None

            if 'timeoffset' in record:
                timeOffset = record['timeoffset']
                timeOffset /= 100
                wait = timeOffset - lastOffset 
                time.sleep(wait+10)

                # timestamp = currentTime + datetime.timedelta(seconds=(timeOffset))
                timestamp = datetime.datetime.utcnow()
                timestamp = timestamp.strftime('%Y-%m-%dT%H:%M:%SZ')
                lastOffset = timeOffset

            if 'impactZone' in record:
                iz = record['impactZone']
                impactZone = 'circle(\"%f,%f %f\")' % (iz['center']['x'], iz['center']['y'], iz['radius'])
                del record['impactZone']

            if 'location' in record:
                loc = record['location']
                location = 'point(\"{0}, {1}\")'.format(loc['x'], loc['y'])
                del record['location']


            recordString = json.dumps(record)
            recordString = recordString.replace('}', '')

            if impactZone:
                recordString = '{0}, \"impactZone\":{1}'.format(recordString, impactZone)

            if location:
                recordString = '{0}, \"location\":{1}'.format(recordString, location)

            if timestamp:
                recordString = '{0}, \"timestamp\": datetime(\"{1}\")'.format(recordString, timestamp)
            recordString = '{0}, \"reportId\":uuid(\"{1}\")'.format(recordString,uuid.uuid4())

            recordString = recordString + '}'

            print('send '+recordString)
            sock1.sendall(recordString.encode('utf-8'))

    sock1.close()

if __name__ == "__main__":
    feedRecord(sys.argv[1],sys.argv[2])

