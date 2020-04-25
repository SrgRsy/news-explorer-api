
const express = require('express');
require('dotenv').config();


const app = express();
const { PORT = 3002, MONGO_URL, NODE_ENV } = process.env;
var cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const publicRout = require('./routes/index');

const MONGO_ADRESS = NODE_ENV === 'production' ? MONGO_URL : 'mongodb://localhost:27017/mydb';

const { requestLogger, errorLogger } = require('./middlewares/logger');

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключаемся к серверу монго
console.log(MONGO_ADRESS);
mongoose.connect(MONGO_ADRESS, {
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

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');

  next();
});

app.use(publicRout);
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
