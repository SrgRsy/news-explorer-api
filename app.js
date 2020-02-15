
const express = require('express');
require('dotenv').config();

const app = express();
const { PORT = 3002 } = process.env;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const articles = require('./routes/articles');
const users = require('./routes/users');
const authoriz = require('./routes/authoriz');

const { requestLogger, errorLogger } = require('./middlewares/logger');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу монго
mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});


app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', authoriz);
app.use('/users', auth, users);
app.use('/articles', auth, articles);
app.use(errors());

app.use(errorLogger);

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});


app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Используется порт ${PORT}`);
});
