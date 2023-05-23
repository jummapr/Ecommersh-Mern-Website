import express from 'express';
import { createNewUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

router.route('/register').post(createNewUser)
router.route('/login').post(loginUser)

export default router
