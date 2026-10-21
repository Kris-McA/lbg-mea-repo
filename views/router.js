import express from "express";
import ridesController from "../controllers/ridesController.js";

const Router = express.Router();

Router.route("/rides")
  .get(ridesController.getAllRides)
  .post(ridesController.createRide);

Router.route("/Rides/:id") // <-- this defines an endpoint with a "placeholder" for the id
  .get(ridesController.getRideById)
  .put(ridesController.updateRideById)
  .delete(ridesController.deleteRideById);

export default Router;