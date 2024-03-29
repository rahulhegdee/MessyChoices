import mongodb from 'mongodb';//imports mongoDB to access atlas database
const {MongoClient} = mongodb;
import mongoose from 'mongoose';
const { mongo } = mongoose;
//To get the uri you have to go to MongoDB Atlas and click connect and follow the steps
const uri = "" //holds the connection uri to our database
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});//creates an instance of our Mongo Client
export default {//this declares that you want to expose this function for use in whatever code requires this file
    initDB: async function connector(){//creates asynchronous function called main
        try{//tries to do the following
            await client.connect(); //wait for the client to connect to our cluster before moving on
            console.log("Connected!");
        }
        catch (e){
            console.log(e);//otherwise print error to console
        }
        /*no need to close database connection until you kill the program
        finally{//this happens regardless of whether the try to catch occurs
            await client.close();//close the connection
        }
        */
    },
    addUser: async function addPerson(newPerson){
        const result = await client.db("BeginnerProject").collection("BeginnerDB").insertOne(newPerson);//inserts one BSON into our collection using MongoDB function "insertOne"
        console.log(`New user created with the following id: ${result.insertedId}`);//lets us know what the id_ of our newly created object is
    },
    getUser: async function getPerson(username){
        const result = await client.db("BeginnerProject").collection("BeginnerDB").findOne({'data':'user', 'username':username});
        return result;
    },
    loginUser: async function loginUser(username, password){
        const result = await client.db("BeginnerProject").collection("BeginnerDB").findOne({'data':'user', 'username':username, 'password':password});
        return result;
    },
    updateUser: async function updatePerson(name, password){
        const result = await client.db("BeginnerProject").collection("BeginnerDB").updateOne({'data':'user', 'username':name},{'$set':{'password':password}});
        return `${result.modifiedCount}`;
    },
    deleteUser: async function deletePerson(name){
        const result = await client.db("BeginnerProject").collection("BeginnerDB").deleteOne({'data':'user', 'username':name});
        await client.db("BeginnerProject").collection("BeginnerDB").deleteMany({'data':'list', 'user':name});
        await client.db("BeginnerProject").collection("BeginnerDB").deleteMany({'data':'item', 'user':name});
        return `${result.deletedCount}`;
    },
    deleteID: async function deleteID(id){
        const result = await client.db("BeginnerProject").collection("BeginnerDB").deleteOne({'_id': new mongo.ObjectId(id)});
        return `${result.deletedCount}`;
    },
    addList: async function addList(newList){
        const result = await client.db("BeginnerProject").collection("BeginnerDB").insertOne(newList);
        console.log(`New list created with the following id: ${result.insertedId}`);//lets us know what the id_ of our newly created object is
    },
    getLists: async function getLists(username){
        const cursor = await client.db("BeginnerProject").collection("BeginnerDB").find({'data':'list', 'user':username});
        const results = await cursor.toArray();
        return results;
    },
    updateList: async function updateList(listID, name, type){
        const result = await client.db("BeginnerProject").collection("BeginnerDB").updateOne({'_id':new mongo.ObjectId(listID)}, {'$set':{'name':name, 'type':type}});
        return `${result.modifiedCount}`;
    },
    deleteList: async function deleteList(listID){
        const result = await client.db("BeginnerProject").collection("BeginnerDB").deleteOne({'_id':new mongo.ObjectId(listID)});
        await client.db("BeginnerProject").collection("BeginnerDB").deleteMany({'data':'item', 'listID':listID});
        return `${result.deletedCount}`;
    },
    addItem: async function addItem(newItem){
        const result = await client.db("BeginnerProject").collection("BeginnerDB").insertOne(newItem);
        console.log(`New item created with the following id: ${result.insertedId}`);//lets us know what the id_ of our newly created object is
    },
    getItems: async function getItems(listID){
        const cursor = await client.db("BeginnerProject").collection("BeginnerDB").find({'data':'item', 'listID':listID});
        const results = await cursor.toArray();
        return results;
    },
    updateItem: async function updateItem(itemID, name, filters){
        const result = await client.db("BeginnerProject").collection("BeginnerDB").updateOne({'_id':new mongo.ObjectId(itemID)}, {'$set':{'name':name}});
        return `${result.modifiedCount}`;
    },
    deleteItem: async function deleteItem(itemID){
        const result = await client.db("BeginnerProject").collection("BeginnerDB").deleteOne({'_id':new mongo.ObjectId(itemID)});
        return `${result.deletedCount}`;
    },
    getRandom: async function getRandom(listID, filters){
        let cursor = await client.db("BeginnerProject").collection("BeginnerDB").find({'data':'item', 'listID':listID});
        const results = await cursor.toArray();
        const randIndex = Math.floor(Math.random() * results.length);//picks random integer from 0 to results.length-1
        return results[randIndex];
    }
};
//connector().catch(console.error);

/*
async function createPerson(client, newPerson){//creates a function that adds to database
    const result = await client.db("BeginnerProject").collection("BeginnerDB").insertOne(newPerson);//inserts one BSON into our collection using MongoDB function "insertOne"
    console.log(`New listing created with the following id: ${result.insertedId}`);//lets us know what the id_ of our newly created object is
}
await createPerson(client, //calls the above function after waiting for client to connect
    {//with the following as the data being inserted into the database as a BSON
        name: "Lovely Loft",
        summary: "A charming loft in Paris",
        bedrooms: 1,
        bathrooms: 1
    }
);
*/