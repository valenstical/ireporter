const express = require('express');

const router = express.Router();

const config = require('../../../model/config');

const { echo, error } = config;


const incidents = require('../../../data/incidents');


// Handle requests to api/v1
router.get('/', (req, res) => {
  res.status(config.STATUS_OK).json({ message: 'Welcome Hacker! This is iReporter api v1.' });
});

router.post('/', (req, res) => {
  res.status(config.STATUS_NOT_FOUND).json({ message: 'Resource not found!' });
});

// Get all incidents
router.get('/red-flags/', (req, res) => {
  echo(res, config.STATUS_OK, incidents.getIncidents());
});

// Get incident by id
router.get('/red-flags/:id', (req, res) => {
  const incident = incidents.getIncident(req.params.id);
  if (incident === false) {
    error(res, config.STATUS_UNPROCESSED, 'No incident matching that id');
  } else {
    echo(res, config.STATUS_OK, incident);
  }
});


// create incident report
router.post('/red-flags', (req, res) => {
  const {errorMessage,id,code} = incidents.addIncident(req.body);
  if (id === -1) {
    error(res,code, errorMessage);
  } else {
    echo(res, config.STATUS_CREATED, [{ id: id, message: `Created ${req.body.type} record.` }]);
  }

});


module.exports = router;
