const jwt = require('jsonwebtoken');
const AuthorizError = require('../errors/authoriz-err');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const handleAuthError = () => next(new AuthorizError('Авторизуйтесь, пожалуйста'));

  const extractBearerToken = (header) => header.replace('Bearer ', '');
  const { authorization } = req.headers;
  // eslint-disable-next-line no-console
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev');
  } catch (err) {
    return next(new AuthorizError('Авторизуйтесь'));
  }
  req.user = payload;

  next();
};
