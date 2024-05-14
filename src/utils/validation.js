const Joi = require('joi');

function validateUser(user) {
    const validationSchema = Joi.object({
      username: Joi.string()
        .trim()
        .alphanum()
        .min(3)
        .max(50)
        .required()
        .messages({
          'string.base': 'Username must be a string',
          'string.empty': 'Username is required',
          'any.required': 'Username is required',
          'string.min': 'Username should have a minimum of {#limit} characters',
          'string.max': 'Username should have a maximum of {#limit} characters',
          'string.alphanum': 'Username must only contain alphanumeric characters',
        }),
      firstName: Joi.string().trim().allow('').max(50).messages({
        'string.base': 'Firstname must be a string',
        'string.max': 'Firstname should have a maximum of {#limit} characters',
      }),
      lastName: Joi.string().trim().allow('').max(50).messages({
        'string.base': 'Lastname must be a string',
        'string.max': 'Lastname should have a maximum of {#limit} characters',
      }),
      password: Joi.string().trim().required().min(6).max(255).messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password is required',
        'any.required': 'Password is required',
        'string.min': 'Password should have a minimum of {#limit} characters',
        'string.max': 'Password should have a maximum of {#limit} characters',
      }),
    });
  
    return validationSchema.validate(user, { abortEarly: false });
  }

  module.exports = {
    validateUser,
  };