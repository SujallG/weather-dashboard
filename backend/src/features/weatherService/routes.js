import express from "express";
import  { body, param, query } from "express-validator";
import weatherController from "./controller.js";
import authMiddleware from "../../middlewares/auth.js";

const router = express.Router();

router.use(authMiddleware);

router.get('/my-weather', weatherController.getUserCitiesWeather);

router.post(
  '/cities',
  [
    body('name').notEmpty().trim().escape(),
    body('country').notEmpty().trim().escape(),
    body('latitude').isFloat({ min: -90, max: 90 }),
    body('longitude').isFloat({ min: -180, max: 180 })
  ],
  weatherController.addCity
);

router.delete(
  '/cities/:cityId',
  [param('cityId').isMongoId()],
  weatherController.removeCity
);

router.get(
  '/search',
  [query('query').isLength({ min: 2 })],
  weatherController.searchCities
);

router.post(
  '/cities/reorder',
  weatherController.reorderCities
);

export default router;