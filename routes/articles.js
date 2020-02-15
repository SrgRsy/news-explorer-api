const articleRout = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const { createArticle, getArticle, deleteArticle } = require('../controllers/articles');

articleRout.post('/', celebrate({
  body: Joi.object().keys({
    link: Joi.string().uri(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createArticle);


articleRout.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.objectId(),
  }),
}), deleteArticle);


articleRout.get('/', getArticle);


module.exports = articleRout;
