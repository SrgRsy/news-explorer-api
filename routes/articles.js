const articleRout = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const { createArticle, getArticle, deleteArticle } = require('../controllers/articles');

articleRout.post('/', celebrate({
  body: Joi.object().keys({
    link: Joi.string().uri(),
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    image: Joi.string().uri(),
  }),
}), createArticle);


articleRout.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.objectId(),
  }),
}), deleteArticle);


articleRout.get('/', getArticle);


module.exports = articleRout;
