import express from 'express';
const router = express.Router(); //Initializes express router
router.get('/', function(req, res){//sets default get response
    res.json({
        status: "API is working",
        message: "Hello World!"
    })
})
export default router;//exports API routes
