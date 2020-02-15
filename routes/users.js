const userRout = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const { getUsers } = require('../controllers/users');


userRout.get('/me', celebrate({
  body: Joi.object().keys({
    link: Joi.string().uri(),
    name: Joi.string().required().min(2).max(30),
  }),
}), getUsers);


module.exports = userRout;
