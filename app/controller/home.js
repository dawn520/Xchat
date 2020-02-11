'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  async getMessage() {
    const { ctx } = this;
    const payload = ctx.request.query;
    this.logger.info('11111', payload);

    payload.page = !payload.page ? 1 : parseInt(payload.page);
    payload.limit = !payload.limit ? 10 : payload.limit;

    const rule = {
      page: { type: 'number', required: true, message: '必填项' },
      limit: { type: 'number', required: true, message: '必填项' },
      receiver: { type: 'string', required: true, message: '必填项' },
    };
    this.logger.info('11111', payload);

    try {
      await ctx.validate(rule, payload); // 验证
    } catch (e) {
      ctx.body = ctx.helper.error(401, e.message, undefined, e.errors);
      return;
    }

    ctx.body = await ctx.service.message.getMessage(payload.page, payload.limit, ctx.app.locals.user._id, payload.receiver);
  }
}

module.exports = HomeController;
