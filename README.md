# BAD_WebClient

This is the web client of BAD system. Learn more about Big Active Data(BAD) at [our site](http://asterix.ics.uci.edu/bigactivedata/). BADWeb can be found at [on server](http://radon.ics.uci.edu:9110/). It is recommended to read [Manual](https://docs.google.com/presentation/d/1V4Ev5TqW3gf2HxXuWA_9E9hIWUSpZviBjPgAKLxkCD4/edit?usp=sharing) before you have BAD FUN. BAD System architecture can be found at [ACM DEBS'16](http://dl.acm.org/citation.cfm?id=2933313) and a BAD Demonstration will appear on [VLDB2017](http://www.vldb.org/2017/accepted_papers_demo_track.php).

## BAD

Big Active Data (BAD) system is built by extending an existing scalable open-source BDMS (AsterixDB) in an active direction. 

### System Overview

Outside of the platform are the **Data Publishers** and **Data Subscribers**. Within the system itself, its components provide two broad areas of functionality – BAD **Data Cluster** and BAD **Broker Network**.

* Data Publishers - Data sources from News Broadcasters, Government Agencies, Individuals and so on.
* Data Subscribers - End users of the system.
* Data Cluster - Big Data monitoring and management.
* Broker Network - notification management and distribution.

**Application Manager** (the third BAD users besides Publisher and Subscriber) will create and manage parameterized **Channels** that can be subscribed to in their application.

* Repetitive Channels - executes the channel function periodically and notifications contain the full results.
* Continuous Channel - executes whenever underlying data sets change and notifications contain the differential results.

More info can be accessed from [ACM publication](dl.acm.org/ft_gateway.cfm?id=2933313&type=pdf).

### User Experience

**Suscriber** users can subscribe to channels created by **Manager** users, in which data are provided by **Publisher** users. System **Admin** administers the BAD backend with statistic monitoring.

## WebClient

### For Subscriber

* HomePage - register user and log in
* Notification - recieve notifications
* Subscription - subscribe channels
* Profile - profile settings

### For Publisher

* Publish - publish emergency reports by Loki
* Profile - profile settings

### For Manager

* Register, update and delete Applications
* monitor Applications with Dashboard
* play in-memory Game
* check TopN users
* Output datasets

### For Admin

* Administer the BAD backend
