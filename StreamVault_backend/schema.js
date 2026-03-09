import Joi from 'joi';

export const userRegisterSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  fullName: Joi.string().min(3).max(50).required(),
  watchHistory: Joi.array().items(Joi.string()),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  avatar: Joi.any(), // You can add more specific validation for files if needed
  coverImage: Joi.any()
});

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),   
  password: Joi.string().min(6).max(128).required(),
});