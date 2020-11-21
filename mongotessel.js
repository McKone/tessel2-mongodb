// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

// Log temperature and humidity readings to MongoDB Atlas
// Updated to mongodb driver version 3.6.3 on 16-Nov-2020

var tessel = require('tessel');
var climatelib = require('climate-si7020');
var climate = climatelib.use(tessel.port['A']);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');


// Initialize the climate module
climate.on('ready', function () {
    console.log('Connected to climate module');

    // Connect to Mongodb Atlas - replace with your connection string
    // Note that MongoDB Atlas connection string dependes on the Mongodb Nodejs driver version
    // Using driver version 3.6
    var uri = 'mongodb+srv://<MongdoDBUsername>:<password>@<DBCluster>/<DatabaseName>?retryWrites=true&w=majority';
    var client = new MongoClient(uri, {useNewUrlParser: true});
    const dbName = 'tesseldata';

     // Connect to MongoDB Atlas database
    client.connect(function(err, client) {
        if(err) throw err;
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        // Variable for the collection
        var measurements = db.collection('measurements');

        // Loop forever
        setImmediate(function loop () {

            // Method syntax: climate.readTemperature([format,] callback(err, temp))
            climate.readTemperature('c', function (err, temp) {

                // Method syntax: climate.readHumidity(callback(err, humidity))
                climate.readHumidity(function (err, humid) {
                    console.log('Degrees:', temp.toFixed(2) + ' C', 'Humidity:', humid.toFixed(4) + ' %RH');

                    // Find timestamp
                    var now = new Date();
                    var jsonDate = now.toJSON();
                    console.log('Timestamp: ' + jsonDate);

                    //Insert measurements, store result of the method in variable r
                    measurements.insertOne(
                        {   timestamp:  now,
                            temp:       temp.toFixed(2),
                            humidity:   humid.toFixed(2) }, function(err, r) {
                              if(err) throw err;
                              console.log("Inserted ", r.insertedCount, " elements")
                            });

                    // Wait 15 minutes
                    setTimeout(loop, 15*60*1000);

                });
            });
        });
    });
})


climate.on('error', function(err) {
  console.log('error connecting climate module', err);
});
