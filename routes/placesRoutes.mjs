// Requrired local modules.
// const searchPlaceFromQuery = require('../controllers/places.js');
// const searchPlacesNearby = require('../controllers/places.js'); API KeY :- AIzaSyDSi1wtWNHTv3LEvmRCa0HVLIEzL3JBiEg , Api Key 2 :- AIzaSyCEiC53dt3YwuKgOKjDfH-yBifgBfnm4J0 
import QueryController from '../controllers/placesController.mjs';

// Required library modules.
import express from 'express';
const QueryRouter = express.Router();

// !Need to implement authentication here  as well.

QueryRouter.route("/querySearch").get(QueryController.searchPlaceFromQuery);
QueryRouter.route("/nearbySearch").get(QueryController.searchPlacesNearby);
QueryRouter.route("/getPlaceDetails").get(QueryController.getPlaceDetails);
QueryRouter.route("/getPhoto").get(QueryController.getPhoto);

export default QueryRouter;
