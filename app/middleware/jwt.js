// app/middleware/jwt.js
'use strict';
const JWT = require('jsonwebtoken');

module.exports = () => {
  return async function jwt(ctx, next) {
    const { app } = ctx;
    const authorization = ctx.header.authorization;
    if (!authorization) {
      ctx.status = 401;
      ctx.body = ctx.helper.error(401, 'Failed to authenticate because of bad credentials or an invalid authorization header.');
    }

    const arr = authorization.split(' ');
    const token = arr[1];
    let decodedToken;
    try {
      decodedToken = await JWT.verify(token, app.config.jwt.secret);
    } catch (e) {
      ctx.status = 401;
      ctx.body = ctx.helper.error(401, e.message);
      return;
    }
    if (Date.now() - decodedToken.expire > 0) {
      ctx.status = 401;
      ctx.body = ctx.helper.error(401, 'Token expired');
    }
    ctx.service.user.getUser({ username: decodedToken.username })
      .then(userData => {
        ctx.logger.info('zcxzxcz', userData);
        app.locals.user = userData;
      });
    await next();
  };
};
