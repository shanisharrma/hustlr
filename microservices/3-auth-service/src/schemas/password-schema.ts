import Joi, { ObjectSchema } from 'joi';

const emailSchema: ObjectSchema = Joi.object().keys({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email address must be valid a email',
    'string.empty': 'Email cannot be empty',
    'any.required': 'Email is required'
  })
});

const passwordSchema: ObjectSchema = Joi.object().keys({
  password: Joi.string().required().min(8).max(20).messages({
    'string.base': 'Password must be a string',
    'string.min': 'Password must be at least 8 characters long',
    'string.max': 'Passwod must be at most 20 characters long',
    'string.empty': 'Password cannot be empty',
    'any.required': 'Password is required'
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.only': 'Passwords should match',
    'any.required': 'Confirm Password is required.'
  })
});

const changePasswordSchema: ObjectSchema = Joi.object().keys({
  currentPassword: Joi.string().min(8).max(20).required().messages({
    'string.base': 'Password should be a string',
    'string.min': 'Password must be at least 8 characters long',
    'string.max': 'Password must be at most 20 characters long',
    'string.empty': 'Current Password cannot be empty',
    'any.required': 'Current Password is required'
  }),
  newPassword: Joi.string().min(8).max(20).required().messages({
    'string.base': 'New Password should be a string',
    'string.min': 'New Password must be at least 8 characters long',
    'string.max': 'New Password must be at most 20 characters long',
    'string.empty': 'New Password cannot be empty',
    'any.required': 'New Password is required'
  }),
  confirmNewPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.only': 'New Passwords should match',
    'any.required': 'Confirm New Password is required.'
  })
});

export { changePasswordSchema, emailSchema, passwordSchema };
