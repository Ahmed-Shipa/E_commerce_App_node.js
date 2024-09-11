import Joi from "joi";

const addProductValidation = Joi.object({
  title: Joi.string().min(1).max(50).required(),
  description: Joi.string().min(1).max(50),
  price: Joi.number().min(1).max(50).required(),
  category: Joi.string().hex().length(24).required(),
  subCategory: Joi.string().hex().length(24).required(),
  brand: Joi.string().hex().length(24).required(),
  rateAvg: Joi.number().min(1).max(3).required(),
  rateCount: Joi.number().min(1).max(3).required(),
  priceAfterDiscount: Joi.number().min(1).max(50),
  imageCover: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string()
      .valid("image/jpeg", "image/png", "image/gif", "image/jpg")
      .required(),
    size: Joi.number().max(5242880).required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
  }).required(),
  images: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string()
      .valid("image/jpeg", "image/png", "image/gif", "image/jpg")
      .required(),
    size: Joi.number().max(5242880).required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
  }).required(),
});

export { addProductValidation };
