import express from "express";
import { body } from "express-validator";
import userController from "./controller.js";
import authMiddleware from "../../middlewares/auth.js";

const router = express.Router();

router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.get('/dashboard', userController.getDashboardData);

router.put(
  '/preferences',
  [
    body('temperatureUnit').optional().isIn(['celsius', 'fahrenheit']),
    body('theme').optional().isIn(['light', 'dark'])
  ],
  userController.updatePreferences
);

router.delete('/account', userController.deactivateAccount);

export default router;