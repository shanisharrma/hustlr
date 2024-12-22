import Joi, { ObjectSchema } from 'joi';

const signupSchema: ObjectSchema = Joi.object().keys({
  username: Joi.string().min(4).max(12).required().messages({
    'string.base': 'Username must be a string',
    'string.min': 'Username must be at least 4 characters long',
    'string.max': 'Username must be at most 12 characters long',
    'string.empty': 'Username cannot be empty',
    'any.required': 'Username is required'
  }),
  password: Joi.string().min(8).max(20).required().messages({
    'string.base': 'Password must be a string',
    'string.min': 'Passwrod must be at least 8 characters long',
    'string.max': 'Passwrod must be at most 20 characters long',
    'string.empty': 'Passwrod cannot be empty',
    'any.required': 'Passwrod is required'
  }),
  country: Joi.string().required().messages({
    'string.base': 'Country must be a string',
    'string.empty': 'Country cannot be empty',
    'any.required': 'Country is required'
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Invalid email address',
    'string.empty': 'Email cannot be empty',
    'any.required': 'Email is required'
  }),
  profilePicture: Joi.string().required().messages({
    'string.base': 'Please add a profile picture',
    'string.empty': 'Profile Picture cannot be empty',
    'any.required': 'Profile Picture is required'
  })
});

export { signupSchema };
