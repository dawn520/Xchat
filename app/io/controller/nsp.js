'use strict';

const Controller = require('egg').Controller;

class NspController extends Controller {

  async p2p() {
    const { ctx, app } = this;
    const nsp = app.io.of('/');
    const message = ctx.args[0] || {};
    const socket = ctx.socket;
    const sender = socket.id;


    try {
      const { receiver, payload } = message;
      if (!receiver) return;
      const msg = ctx.helper.parseMsg('p2p', payload, { sender, receiver });
      console.log(msg);
      nsp.emit(receiver, msg);
      // 聊天记录入库
    } catch (error) {
      app.logger.error(error);
    }
  }

  async p2p1() {
    console.log('websocket server is up');
    const { ctx, app } = this;
    const message = ctx.args[0];
    await ctx.socket.emit('res', `Hi! I've got your message: ${message}`);
    console.log(app);

  }
}

module.exports = NspController;
