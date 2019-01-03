import express from 'express';
import Authenticator from '../middleware/authenticator';
import Controller from '../controllers/controller';
import Validator from '../middleware/validator';

const router = express.Router();

// GET: Get all intervention and red-flag record
router.get('/',
  Authenticator.authenticateUser,
  Controller.getAllIncidents);

// GET: Get specific intervention or red-flag record
router.get('/:id',
  Authenticator.authenticateUser,
  Validator.valideteID,
  Validator.validateRange,
  Validator.validateIncident,
  Controller.getAllIncidents);

// DELETE: Delete intervention or red-flag record
router.delete('/:id',
  Authenticator.authenticateUser,
  Validator.valideteID,
  Validator.validateRange,
  Validator.validateIncident,
  Validator.verifyStatus,
  Controller.deleteIncident);

// PATCH: Update intervention or red-flag comment
router.patch('/:id/comment',
  Authenticator.authenticateUser,
  Validator.valideteID,
  Validator.validateRange,
  Validator.validateComment,
  Validator.validateIncident,
  Validator.verifyStatus,
  Controller.updateIncident);

// PATCH: Update intervention or red-flag location
router.patch('/:id/location',
  Authenticator.authenticateUser,
  Validator.valideteID,
  Validator.validateRange,
  Validator.validateLocation,
  Validator.validateIncident,
  Validator.verifyStatus,
  Controller.updateIncident);

// POST: Create new intervention or red-flag record
router.post('/',
  Authenticator.authenticateUser,
  Validator.validatePostData,
  Controller.createIncident);

// PATCH: Update intervention or red-flag status
router.patch('/:id/status',
  Authenticator.authenticateAdmin,
  Validator.valideteID,
  Validator.validateRange,
  Validator.checkStatus,
  Validator.validateStatus,
  Validator.validateIncident,
  Controller.updateIncidentStatus);

export default router;
