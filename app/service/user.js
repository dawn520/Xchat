'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async getUser(where) {
    const { ctx } = this;
    const user = await ctx.model.User.findOne(where);
    return user;
  }
}

module.exports = UserService;
