//Some of these, especially the features that are required, are imports. Look at terminal_instructions.txt for more info.
import express from 'express';//imports express.js
import { urlencoded, json } from 'body-parser';//imports body-parser
//var mongoose = require('mongoose'); //imports mongoose NOTE: Used for local computer MongoDB server
import { initDB, addUser, getUser, loginUser, addList, deleteUser as _deleteUser, deleteID, getLists, addItem, getItems, getRandom, updateList, deleteList, updateItem, deleteItem, updateUser } from "./database";//Accesses our database connection file
import apiRoutes from "./api-routes";//Accesses API router file that we created
const port = process.env.PORT || 8080;//Sets up server port
import { MongoClient } from 'mongodb';//imports mongodb to integrate MongoDB Atlas database
import { verify, sign } from 'jsonwebtoken';//imports JWT authentication to our API
import cors from 'cors';//imports cross-origin response resource sharing
import { deleteUser } from './database';
import { response } from 'express';
//var db = require("./db") //require grabs the "db.js" file in the same directory as app.js and includes it
const app = express();//initialize app
export default app; //makes the object "app" visibile to the rest of the program
let whitelist = ['http://localhost:3000'];//whitelist of all the servers we are allowing to access our assets
let corsOptions = {
    origin: whitelist,//allows only the sites in our whitelist
    successStatus: 200
}
app.use(cors(corsOptions));//allows any server or site to access this content as long as they are in the whitelist

app.use(urlencoded({//configures body parser to handle post requests
    extended: true
}))

app.use(json());
//The next two commented steps are for local MongoDB server running from local computer
//mongoose.connect('mongodb://localhost/beginnerrest', {useNewUrlParser: true, useUnifiedTopology: true});//connects to our new MongoDB database when we search for that link
//var db = mongoose.connection;//sets connection variable
//connection.connector().catch(console.error); //runs the main function in connection.js 
initDB();//this calls the exposed function from database.js
app.use('/api', apiRoutes);//Uses the routes we created in our app (accesses this files contents when we do get "/api")
/* (OLD VERIFICATION METHOD)
app.get("/accounts", verifyToken, async function(req, res){//create an async function so we can get the results from the database
    //calls the verifyToken function before running anything else to make sure we can go forward
    //we need to try...catch when we use await
    try{
        let accounts = await db.getUser();//wait for the database to return the people
        jwt.verify(req.token, 'rahulsecretkey', (err,authorizedData)=>{
            if(err){
                res.status(401).json({
                    'message':'Access Denied'
                })
            }
            else{
                res.status(200).json({
                    'message':'Access Granted',
                    authorizedData,
                    'Accounts':accounts//respond with a json of the database elements
                })
            }
        })
    }
    catch(e){
        res.status(500).json({
            'error': e
        });
    }
});
function verifyToken(req,res,next){
    const bearer = req.headers['authorization'];
    if(typeof bearer != undefined){
        //let bearerToken = bearer.split(' ');
        //let token = bearerToken[1];
        req.token = bearer;
        next();//moves forward because we successfully found a token
    }
    else{
        res.status(401).json({
            'message':'Access Denied'
        })
    }
}
*/
app.get("/account", verifyToken, async function(req, res){//checks if an account is logged in and gives account detail if so
    //create an async function so we can get the results from the database
    //calls the verifyToken function before running anything else to make sure we can go forward
    //we need to try...catch when we use await
    try{
        res.status(200).json({
            'message':'Access Granted',
            'authorizedData':req.tokenData
        })
    }
    catch(e){
        res.status(500).json({
            'error': e
        });
    }
});
function verifyToken(req, res, next){ //verifies JWT token in authorization header and verifies if the token is authentic
    const bearer = req.headers['authorization'];
    if(typeof bearer != undefined){
        //let bearerToken = bearer.split(' ');
        //let token = bearerToken[1];
        req.token = bearer;
        verify(req.token, 'RRkurr3569', (err,authorizedData)=>{
            if(err){
                res.status(401).json({
                    'message':'Access Denied'
                })
            }
            else{
                req.tokenData = authorizedData;
                next();//moves forward because we successfully found a token
            }
        })
    }
    else{
        res.status(401).json({
            'message':'Access Denied'
        })
    }
}
app.post("/user", function(req, res){ //creates new user
    let username = req.body.username;
    let password = req.body.password;
    let account = {'data':"user", 'username':username, 'password':password};
    if(!username){
        res.status(400).json({
            'message':"Account could not be created"
        });
    }
    else{
        addUser(account);//call the database function to add account to db
        res.status(201).json({
            'message':"Account added successfully!"
        });
    }
})
app.post('/username', async function(req,res){ //checks existing usernames to see if the username a user wants is already taken
    let username = req.body.username;
    try{
        let userData = await getUser(username);//checks if user already exists with username
        if(userData === null){
            res.status(200).json({
                'usertaken':false
            });
        }
        else{
            res.status(400).json({
                'usertaken':true
            });
        }
    }
    catch(e){
        res.status(500).json({
            'error': e
        });
    }

})
app.post("/account", async function(req, res){//login an existing user
    let username = req.body.username;
    let password = req.body.password;
    try{
        let user = await loginUser(username, password);
        if(user !== null){
            sign({//sign jwt asynchronously
                username: username,
                exp: Math.floor((Date.now()/1000)+3600),
                id: user._id,
                admin: false
            },'RRkurr3569', (err, token) => {
                if(token){
                    res.status(200).json({
                        'message': 'verified',
                        token
                    })
                }
                else{
                    res.status(401).json({
                        'message':'unverified'
                    })
                }
            });
        }
        else{
            res.status(401).json({
                'message':'unverified'
            })
        }
    }
    catch(e){
        res.status(500).json({
            'error': e
        });
    }
})
app.post("/list", verifyToken, async function(req, res){ //creates a list
    let name = req.body.name;
    let type = req.body.type;
    let filters = req.body.filters;
    console.log(filters);
    try{
        let list = {'data':"list", 'user': req.tokenData.username, 'name': name, 'type': type, 'filters': filters};
        await addList(list);
        res.status(200).json({
            'message':'List Created'
        })
    }
    catch(e){
        res.status(500).json({
            'error': e
        });
    }
})
app.post("/userdelete", verifyToken, async function(req,res){ //deletes a user (same as delete /account/:accountid below) but requires no parameters
    //let username = req.body.username;
    let username = req.tokenData.username;
    try{
        let deleteStatus = await _deleteUser(username);
        if(deleteStatus == 0){
            res.status(404).send(username + " not found");
        }
        else{
            res.status(200).send("account deleted");
        }
    }
    catch(e){
        res.status(500).json({
            'error': e
        });
    }
    
})
app.delete("/account/:accountid", verifyToken, async function(req, res){ //deletes an account
    let id = req.params.accountid;
    try{
        let deleteStatus = await deleteID(id);
        if(deleteStatus == 0){
            res.status(404).json({
                "message": "not found"
            })
        }
        else{
            res.status(200).json({
                "message": "successfully deleted"
            })
        }
    }
    catch(e){
        res.status(500).json({
            'error': e
        })
    }
})
app.get("/lists/:username", verifyToken, async function(req, res){ //gets all the lists of a specific user 
    let user = req.params.username;
    try{
        let userLists = await getLists(user);
        res.status(200).json({
            "lists": userLists
        })
    }
    catch(e){
        res.status(500).json({
            'error': e
        })
    }
})
app.post("/list/item/:listid", verifyToken, async function(req, res){ //posts an item to a specifc list
    let listID = req.params.listid;
    let listName = req.body.listName;
    let name = req.body.name;
    let keyword = req.body.keyword;
    let rank = req.body.rank;
    try{
        let item = {'data':'item', 'user':req.tokenData.username, 'listID':listID, 'listName':listName, 'name': name, 'keyword': keyword, 'rank':rank};
        addItem(item);
        res.status(200).json({
            'message':'Item Created Successfully'
        })
    }
    catch(e){
        res.status(500).json({
            'error': e
        });
    }
})
app.get("/list/items/:listid", verifyToken, async function(req, res){ //gets all items for a specific list
    let listID = req.params.listid;
    try{
        let listItems = await getItems(listID);
        res.status(200).json({
            "items": listItems
        })
    }
    catch(e){
        res.status(500).json({
            'error': e
        });
    }
})
app.post("/random/:listid", verifyToken, async function(req, res){//selects a random element from the provided list (and uses specific parameters of search if requested)
    let listID = req.params.listid;
    let keyword = req.body.keyword;
    let rank = req.body.rank;
    try{
        let item = await getRandom(listID, keyword, rank);
        if(item === undefined){
            res.status(404).json({
                "item":{'name':"None Found!"}
            })
        }
        else{
            res.status(200).json({
                "item": item
            })
        }
    }
    catch(e){
        res.status(500).json({
            'error': e
        });
    }
})
app.patch("/list/:listid", verifyToken, async function(req, res){
    let listID = req.params.listid;
    let name = req.body.name; //if left blank in form, React should put the previous name and type as the body and not ""
    let type = req.body.type;
    try{
        await updateList(listID, name, type);
        res.status(200).json({
            "message":"successfully updated"
        })
    }
    catch(e){
        res.status(500).json({
            'error': e
        });
    }
})
app.delete("/list/:listid", verifyToken, async function(req, res){
    let listID = req.params.listid;
    try{
        await deleteList(listID);
        res.status(200).json({
            "message":"successfully deleted"
        })
    }
    catch(e){
        res.status(500).json({
            'error': e
        });
    }
})
app.patch("/item/:itemid", verifyToken, async function(req, res){
    let itemID = req.params.itemid;
    let name = req.body.name;
    let keyword = req.body.keyword;
    let rank = req.body.rank;
    try{
        await updateItem(itemID, name, keyword, rank);
        res.status(200).json({
            "message":"successfully updated"
        })
    }
    catch(e){
        res.status(500).json({
            'error': e
        });
    }
})
app.delete("/item/:itemid", verifyToken, async function(req, res){
    let itemID = req.params.itemid;
    try{
        await deleteItem(itemID);
        res.status(200).json({
            "message":"successfully deleted"
        })
    }
    catch(e){
        res.status(500).json({
            'error': e
        });
    }
})

/* API's below are currently irrelevant to the project at this time */
app.patch("/friends/:name", async function(req,res){
    let name = req.params.name;
    let password = req.body.password;
    try{
        let updateStatus = await updateUser(name, password);
        if(updateStatus == 0){
            res.status(404).send(name + " not found");
        }
        else{
            res.status(200).send(name + " updated");
        }
    }
    catch(e){
        res.status(500).json({
            'error': e
        });
    }
})
app.delete("/friends/:name", async function(req,res){
    let name = req.params.name;
    try{
        let status = await _deleteUser(name);
        if(status == 0){
            res.status(404).send(name + " was not found");
        }
        else{
            res.status(200).send(name + " was deleted");
        }
    }
    catch(e){
        res.status(500).json({
            'error': e
        });
    }
})
app.listen(port, function(){
    console.log("Running on port " + port);
})

