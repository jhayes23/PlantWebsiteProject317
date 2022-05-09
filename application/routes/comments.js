var express = require('express');
var router = express.Router();
const {errorPrint, successPrint} = require('../helpers/debug/debugprinters');
const {create} = require('../models/Comments');

router.post('/create',(req,res,next) => {
    console.log(req.body);
    res.json("Comment received");
})

module.exports = router;