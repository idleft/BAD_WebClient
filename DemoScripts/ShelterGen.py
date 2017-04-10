import uuid
import random
#uuid.uuid4()
seedlocx = 33.6424092
seedlocy = -117.8410603

locid = 7

cnt = 10

for i in range(cnt):
	locx = seedlocx + (round(random.random()) * 2 - 1) * random.random() / 8
	locy = seedlocy + (round(random.random()) * 2 - 1) * random.random() / 8

	uid = uuid.uuid4()
	print("insert into dataset EmergencyShelters({\"name\": \"shelter-" + str(locid) + "-"+ str(i+20) +"\", \"location\":point(\"" + str(locx) + ", " + str(locy) + "\"), \"reportId\":uuid(\"" + str(uid) + "\")})")
