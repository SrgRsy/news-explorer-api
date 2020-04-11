/* eslint-disable no-undef */
// импорт модели
const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const NotEnoughRight = require('../errors/not-enough-right');

module.exports.createArticle = (req, res, next) => {
  Article.create({
    keyword: req.body.keyword,
    title: req.body.title,
    text: req.body.text,
    date: req.body.date,
    link: req.body.link,
    source: req.body.source,
    image: req.body.image,
    owner: req.user._id,
  })
    .then(() => res.send({ message: 'Статья добавлена' }))
    .catch(next);
};


module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .then((article) => {
      if (article === null) {
        throw new NotFoundError('Статья не найдена');
      }
      if (article.owner.toString() === req.user._id) {
        Article.findByIdAndRemove(req.params.articleId)
          .then(() => res.send({ message: 'Статья удалена' }))
          .catch(next);
      } else {
        next(new NotEnoughRight('Недостаточно прав'));
      }
    })
    .catch(next);
};


module.exports.getArticle = (req, res, next) => {
  Article.find({})
    .then((article) => res.send({ data: article }))
    .catch(next);
};
