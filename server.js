require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors())



const uri = process.env.DB_URL;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// collection
const todoCollection = client.db("app").collection("todo");

async function run() {
    await client.connect();
    console.log('database connected...');

    // get todo
    app.get('/todo', async (req, res) => {
        const result = await todoCollection.find().toArray()
        res.send(result)
    })

    // post todo
    app.post('/todo', async (req, res) => {
        const todo = req.body
        const result = await todoCollection.insertOne(todo)
        res.send(result)
    })
    // update todo
    app.put('/todo/:id', async (req, res) => {
        const { id } = req.params
        const complete = req.body.complete
        const filter = { _id: ObjectId(id) }
        const update = {
            $set: { complete }
        }
        const result = await todoCollection.updateOne(filter, update, { upsert: true })
        res.send(result)
    })






}

run().catch(console.dir)



app.get('/', (req, res) => {
    res.send({ message: 'tod server' })
})

app.listen(port, () => {
    console.log(`server is online on port ${port}...`);
})