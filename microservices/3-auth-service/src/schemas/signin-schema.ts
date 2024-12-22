import Joi, { ObjectSchema } from 'joi';

const loginSchema: ObjectSchema = Joi.object().keys({
  username: Joi.alternatives().conditional(Joi.string().email(), {
    then: Joi.string().email().required().messages({
      'string.base': 'Email must be a string',
      'string.email': 'Invalid email address',
      'string.empty': 'Email cannot be empty',
      'any.required': 'Email is required'
    }),
    otherwise: Joi.string().min(4).max(12).required().messages({
      'string.base': 'Username must be a string',
      'string.min': 'Username must be at least 4 characters long',
      'string.max': 'Username must be at most 12 characters long',
      'string.empty': 'Username cannot be empty',
      'any.required': 'Username is required'
    })
  }),
  password: Joi.string().min(8).max(20).required().messages({
    'string.base': 'Password must be a string',
    'string.min': 'Passwrod must be at least 8 characters long',
    'string.max': 'Passwrod must be at most 20 characters long',
    'string.empty': 'Passwrod cannot be empty',
    'any.required': 'Passwrod is required'
  })
});

export { loginSchema };
