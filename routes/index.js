const publicRout = require('express').Router();
const auth = require('../middlewares/auth');
const articles = require('./articles');
const users = require('./users');
const authoriz = require('./authoriz');


publicRout.use('/', authoriz);
publicRout.use('/users', auth, users);
publicRout.use('/articles', auth, articles);

module.exports = publicRout;
