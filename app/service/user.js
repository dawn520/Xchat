'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async getUser(where, select = null, populate = null, populateSelect) {
    const { ctx } = this;
    const user = await ctx.model.User.findOne(where, select)
      .populate(populate, populateSelect);
    return user;
  }
}

module.exports = UserService;
