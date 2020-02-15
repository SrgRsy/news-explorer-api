/* eslint-disable no-undef */
// импорт модели
const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const NotEnoughRight = require('../errors/not-enough-right');

module.exports.createArticle = (req, res, next) => {
  Article.create({
    keyword: req.body.keyword,
    title: req.body.title,
    text: req.user.text,
    date: req.body.date,
    link: req.body.link,
    source: req.user.source,
    image: req.user.image,
  })
    .then((article) => res.send({ data: article }))
    .catch(next);
};


module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .then((article) => {
      if (article === null) {
        throw new NotFoundError('Статься не найдена');
      }
      if (article.owner.toString() === req.user._id) {
        Article.findByIdAndRemove(req.params.articleId)
          .then((articleRemove) => res.send({ remove: articleRemove }))
          .catch(next);
      } else {
        next(new NotEnoughRight('Недостаточно прав'));
      }
    })
    .then((article) => res.send({ data: article }))
    .catch(next);
};


module.exports.getArticle = (req, res, next) => {
  Article.find({})
    .then((article) => res.send({ data: article }))
    .catch(next);
};
