'use strict';

const Service = require('egg').Service;


class MessageService extends Service {
  async saveMessage(message) {
    const { ctx } = this;
    const res = await ctx.model.Message.create(message);
    return res;
  }

}

module.exports = MessageService;
