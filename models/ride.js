import joi from "joi";

const accountSchema = joi.object({
  id: joi.string().required(),
  ride_from: joi.string().required(),
  ride_to: joi.number().required(),
  seats_available: joi.number().required(),
});

export default accountSchema;