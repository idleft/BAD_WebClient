# BAD_WebClient

This is the web client of BAD system. Learn more about Big Active Data(BAD) at [our site](http://asterix.ics.uci.edu/bigactivedata/).

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
* Preference - set preferences

### For Publisher

* Currently, manually publish by DemoScripts

### For Manager

* Register, update, delete and monitor Applications with dashboards.

### For Admin

* Administer the BAD backend.
