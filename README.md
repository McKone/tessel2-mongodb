Application for Tessel 2 and the climate module
Log temperature and humidity readings to MongoDB Atlas
Updated to mongodb driver version 3.6.3 on 16-Nov-2020

Connect to Mongodb Atlas - replace the uri in file mongotessel.js with your connection string
Note that MongoDB Atlas connection string dependes on the Mongodb Nodejs driver version


Check www.mongodb.com for MongoDB Atlas usage
Check https://tessel.io for Tessel 2 installation instructions

NOTE: execute the app with the --compress=false flag in the t2 command:

t2 run mongotessel.js --compress=false
