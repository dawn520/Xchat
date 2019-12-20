'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async getUser(where, select = null, populate = null, populateSelect) {
    const { ctx } = this;
    const user = await ctx.model.User.findOne(where, select)
      .populate(populate, populateSelect);
    return user;
  }

  async clearOnlineUser() {
    const { ctx } = this;
    await ctx.model.User.updateMany({ _id: { $ne: null } }, { $set: { socket_id: [] } });
  }

}

module.exports = UserService;
