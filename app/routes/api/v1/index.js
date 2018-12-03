const express = require('express');

const router = express.Router();

const config = require('../../../utils/config');
const {success, error } = config;
const incidents = require('../../../controllers/incident-controller');


// Handle requests to api/v1
router.all('/', (req, res) => {
    if (req.method==='GET') {
      res.status(config.STATUS_OK).json({ message: 'Welcome Hacker! This is iReporter api v1.' });  
    }   
    else{
      res.status(config.STATUS_NOT_FOUND).json({ message: 'Resource not found!' });
    }
});


// Get all incidents
router.get('/red-flags/', (req, res) => {
  success(res, config.STATUS_OK, incidents.getIncidents());
});

// Get incident by id
router.get('/red-flags/:id', (req, res) => {
  const incident = incidents.getIncident(req.params.id);
  if (incident === false) {
    error(res, config.STATUS_UNPROCESSED, 'No incident matching that id');
  } else {
    success(res, config.STATUS_OK, incident);
  }
});


// create incident report
router.post('/red-flags', (req, res) => {
  const {errorMessage,id,code} = incidents.addIncident(req.body);
  if (id === -1) {
    error(res,code, errorMessage);
  } else {
    success(res, config.STATUS_CREATED, [{ id: id, message: `Created ${req.body.type} record.` }]);
  }

});

//update location and comment
router.patch('/red-flags/:id/:path', (req, res) => {
    let result={id:-1,code:config.STATUS_OK,message:''}; 
    if (req.params.path==='location') {
        result =incidents.editLocation(req.body,req.params);      
    }
    else{
      result =  incidents.editComment(req.body,req.params)
    }
  if (result.id === -1) {
    error(res,result.code, result.message);
  } else {
    success(res,result.code, [{ id: result.id, message: result.message }]);
  }   

});

//delete incident report
router.delete('/red-flags/:id/', (req, res) => {
  const {message,id,code} = incidents.deleteIncident(req.params);
  if (id === -1) {
    error(res,code, message);
  } else {
    success(res,code, [{ id: id, message: message }]);
  }
});

module.exports = router;
