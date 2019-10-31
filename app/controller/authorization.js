'use strict';

const Controller = require('egg').Controller;

class AuthorizationController extends Controller {
  async login() {
    const { ctx } = this;
    const rule = {
      username: { type: 'string', required: true, message: '必填项' },
      password: { type: 'string', required: true, message: '必填项' },
    };

    const payload = ctx.request.body;
    await ctx.validate(rule, payload); // 验证
    // 从service文件中拿到返回结果
    ctx.body = await ctx.service.authorization.login(payload);
  }
}

module.exports = AuthorizationController;
