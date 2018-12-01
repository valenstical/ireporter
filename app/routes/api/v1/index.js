const express = require('express');
const router = express.Router();

const config=require('../../../model/config');
const incidents=require('../../../data/incidents');


//Handle requests to api/v1
router.get('/', (req, res) => {
    res.status(config.STATUS_OK).json({'message':'Welcome Hacker! This is iReporter api v1.'});
});

//Get all incidents
router.get('/red-flags',(req,res) =>{
    res.status(config.STATUS_OK);
    res.send(config.echo(config.STATUS_OK,incidents.getIncidents()));
});







module.exports = router;
