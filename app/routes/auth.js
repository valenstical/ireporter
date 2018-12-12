import express from 'express';
import Controller from '../controllers/controller';
import Validator from '../middleware/validator';

const router = express.Router();

// POST: Login
router.post('/login',
  Validator.validateLogin,
  Controller.login);

// POST: Signup
router.post('/signup',
  Validator.validateSignup,
  Controller.signup);

export default router;
