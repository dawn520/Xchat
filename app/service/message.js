'use strict';

const Service = require('egg').Service;


class MessageService extends Service {
  async saveMessage(message) {
    const { ctx } = this;
    return await ctx.model.Message.create(message);
  }

  async getMessage(page = 1, limit = 10, sender, receiver) {
    const { ctx } = this;
    const skip = (page - 1) * limit;
    const list = await ctx.model.Message.find({
      sender,
      receiver,
    })
      .limit(limit)
      .skip(skip)
      .sort({ occupation: -1 })
    const count = await ctx.model.Message.count({
      sender,
      receiver,
    });
    return ctx.helper.success({ count, list });
  }

}

module.exports = MessageService;
