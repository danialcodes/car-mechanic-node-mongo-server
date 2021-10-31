const express = require("express");
const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.set('json spaces', 2);
const admin = process.env.DB_USER;
const password = process.env.DB_PASS;

const uri = `mongodb+srv://${admin}:${password}@cluster0.zrm8o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




async function run() {
    try {

        await client.connect();
        console.log('Connected Successfully!!');
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");

        // GET API
        app.get("/services", async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            console.log("Sending Services to client");
            res.json(services);
        })
        // GET API for one service
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            const service = await servicesCollection.findOne(query);
            console.log("Sending One service to client");
            res.json(service);
        })
        // Delete one service
        app.delete("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            const result = await servicesCollection.deleteOne(query);
            // console.log("Sending One service to client");
            if (result.deletedCount > 0) {
                console.log("Delete Successful");
                res.json(result);
            }
            else {
                console.log("Couldn't Delete");

            }
            // res.json(service);

        })



        // POST API
        app.post("/services", async (req, res) => {
            const service = req.body;
            // const options = { ordered: true };
            // const result = await servicesCollection.insertMany(services, options);
            const result = await servicesCollection.insertOne(service);
            // console.log(result);
            // res.send(result);
            res.send(result);
        });



    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Welcome To Car Mechanic");
})


app.listen(port, () => {
    console.log("Listening to port", port);
})