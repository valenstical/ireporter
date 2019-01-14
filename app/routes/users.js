import express from 'express';
import Controller from '../controllers/controller';
import Validator from '../middleware/validator';
import Authenticator from '../middleware/authenticator';


const router = express.Router();


// PATCH: User Details
router.patch('/:id/profile',
  Authenticator.authenticateUser,
  Validator.valideteID,
  Validator.validateRange,
  Validator.validateSignup,
  Validator.verifyUser,
  Controller.signup);

// PATCH: User Password
router.patch('/:id/password',
  Authenticator.authenticateUser,
  Validator.valideteID,
  Validator.validateRange,
  Validator.validatePassword,
  Validator.verifyUser,
  Controller.updatePassword);

router.patch('/:id/image',
  Authenticator.authenticateUser,
  Validator.valideteID,
  Validator.validateRange,
  Validator.verifyFile,
  Validator.validateImage,
  Controller.uploadProfileImage);

export default router;
