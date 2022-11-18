import Joi from "joi";
import ApiError from "../error-hendling/api.error.js";

export const queryValidation = async (req, res, next) => {
  const schema = Joi.object({
    query: Joi.string().lowercase().trim().alphanum().required(),
    queryType: Joi.string()
      .valid("getByHash", "getByBlock", "getBySender", "getByRecipient")
      .insensitive(),
  });
  try {
    await schema.validateAsync(req.body);
  } catch (e) {
    return next(ApiError.BadRequest(e.details[0].message));
  }
  next();
};
