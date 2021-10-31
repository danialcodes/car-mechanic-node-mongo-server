const express = require("express");
const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require("cors");
const port = 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.set('json spaces', 2);
const admin = process.env.DB_USER;
const password = process.env.DB_PASS;

const uri = `mongodb+srv://${admin}:${password}@cluster0.zrm8o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const aaa = [
    {
        "id": 1,
        "name": "ENGINE DIAGNOSTIC",
        "price": "300",
        "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
        "img": "https://i.ibb.co/dGDkr4v/1.jpg"
    },
    {
        "id": 2,
        "name": "WHEEL ALIGNMENT",
        "price": "100",
        "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
        "img": "https://i.ibb.co/tY8dmnP/2.jpg"
    },
    {
        "id": 3,
        "name": "OIL CHANGING",
        "price": "150",
        "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
        "img": "https://i.ibb.co/Yh04YVw/3.jpg"
    },
    {
        "id": 4,
        "name": "BRAKE REPARING",
        "price": "180",
        "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
        "img": "https://i.ibb.co/ZX2Cbkn/4.jpg"
    },
    {
        "id": 5,
        "name": "WASH AND GLASSING",
        "price": "100",
        "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
        "img": "https://i.ibb.co/FgQ3jXp/5.jpg"
    },
    {
        "id": 6,
        "name": "COMPLETE ANALYSIS",
        "price": "300",
        "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa",
        "img": "https://i.ibb.co/zJy5ZDd/6.jpg"
    }
];




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


        // const options = { ordered: true };
        // const result = await servicesCollection.insertMany(aaa, options);
        // console.log(result);



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