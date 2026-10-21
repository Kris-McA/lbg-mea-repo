import database from "../services/database.js";
import {
  ScanCommand,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import accountSchema from "../models/ride.js";

async function getAllRides(req, res, next) {
  try {
    const params = {
      TableName: "Rides",
    };
    const command = new ScanCommand(params);
    const result = await database.send(command);
    res.status(200).json(result.Items);
  } catch (err) {
    next(err);
  }
}

async function createRide(req, res, next) {
  try {
    const uuid = uuidv4();
    req.body.id = uuid;
    const { error, value } = accountSchema.validate(req.body);

    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { id, ride_from, ride_to, seats_available } = value;

    const params = {
      TableName: "Rides",
      Item: {
        id,
        ride_from,
        ride_to,
        seats_available,
      },
    };

    const command = new PutCommand(params);

    await database.send(command);

    res
      .status(201)
      .json({ message: "Successfully created ride", data: params.Item });
  } catch (error) {
    next(error);
  }
}

async function getRideById(req, res, next) {
  const accountId = req.params.id;
  try {
    const params = {
      TableName: "Rides",
      Key: { id: accountId },
    };
    const command = new GetCommand(params);
    const result = await database.send(command);
    if (!result.Item) {
      return res.status(404).json({ message: "No ride found" });
    }
    res.status(200).json(result.Item);
  } catch (err) {
    next(err);
  }
}

async function updateRideById(req, res, next) {
  try {
    const accountId = req.params.id;
    req.body.id = rideId;
    const { error, value } = accountSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { seats_available, ride_from, ride_to } = value;

    // Get the movie from DynamoDB
    const getParams = {
      TableName: "Rides",
      Key: { id: accountId },
    };

    const getCommand = new GetCommand(getParams);

    const result = await database.send(getCommand);

    const account = result.Item;

    if (!account) {
      return res.status(404).json({ message: "No ride found" });
    }

    // Update the account in DynamoDB
    const updateParams = {
      TableName: "Rides",
      Key: { id: accountId },
      UpdateExpression:
        "set #seats_available = :seats_available, #ride_from = :ride_from, #ride_to = :ride_to",
      ExpressionAttributeNames: {
        "#seats_available": "seats_available",
        "#ride_from": "ride_from",
        "#ride_to": "ride_to",
      },
      ExpressionAttributeValues: {
        ":seats_available": seats_available,
        ":ride_from": ride_from,
        ":ride_to": ride_to,
      },
      ReturnValues: "ALL_NEW",
    };
    const updateCommand = new UpdateCommand(updateParams);
    const updatedAccount = await database.send(updateCommand);

    res.status(200).json(updatedRide.Attributes);
  } catch (err) {
    next(err);
  }
}

async function deleteRideById(req, res, next) {
  const rideId = req.params.id;
  try {
    const params = {
      TableName: "Rides",
      Key: { id: accountId },
    };
    const command = new DeleteCommand(params);
    await database.send(command);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export default {
  getAllRides,
  createRide,
  getRideById,
  updateRideById,
  deleteRideById,
};