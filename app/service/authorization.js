'use strict';

const Service = require('egg').Service;
const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthorizationService extends Service {
  async login(loginMsg) {
    const { ctx } = this;
    let res;
    const user = await ctx.model.User.findOne({
      username: loginMsg.username,
    });
    if (!user) {
      const message = 'The user does not exist';
      res = ctx.helper.error(-1, message);
    } else {
      console.log(loginMsg);
      if (bcrypt.compareSync(loginMsg.password, user.password)) {
        // 生成token
        const token = JWT.sign({
          id: user._id,
          username: user.username,
        },
        this.config.jwt.secret, {
          expiresIn: 60 * 60 * 24 * 7,
        });
        user.password = undefined;
        res = ctx.helper.success({ user, token });

      } else {
        res = ctx.helper.error(-2, 'Your password verification failed');
      }
    }
    return res;
  }

}

module.exports = AuthorizationService;
