'use strict';

const Controller = require('egg').Controller;

class NspController extends Controller {

  /**
   * p2p chat
   *
   * @return {Promise<void>}
   */
  async chat() {
    const { ctx, app, logger } = this;
    let args = ctx.args[0] || {};
    const socket = ctx.socket;
    const sender = socket.id;
    try {
      socket.emitEvent = 'chat';
      logger.info(socket);

      logger.info('参数的类型' + typeof (args));
      if (typeof (args) === 'string') {
        console.log(args);
        args = JSON.parse(args);
      }
      const { receiver, payload } = args;
      logger.info('参数的类型' + typeof (args));
      logger.info(args);
      logger.info(receiver);
      if (!receiver) {
        socket.emit(ctx.helper.error('receiver username required!'));
        return;
      }
      if (!payload.message) {
        socket.emit(ctx.helper.error('message required!'));
        return;
      }
      if (!payload.message_type) {
        socket.emit(ctx.helper.error('message_type required!'));
        return;
      }
      // 查找用户是否在线
      const receiverUserData = await ctx.service.user.getUser({ username: receiver });
      if (!receiverUserData) {
        socket.emit(ctx.response.fail('receiver does not exist!'));
        return;
      }

      // 查找receiver是否为好友，如不是，则添加
      if (socket.userData.friends.indexOf(receiverUserData._id) < 0) {
        socket.userData.friends.push(receiverUserData._id);
        socket.userData.save();
      }
      // logger.info('user data', socket.userData);

      // 查找receiver是否在线，在，则emit
      if (receiverUserData.online > 0 && receiverUserData.socket_id !== undefined && receiverUserData.socket_id !== []) {
        // the receiver is online
        logger.info(receiverUserData.socket_id);

        const msg = ctx.helper.parseMsg('chat', payload, { sender, receiver });
        //  app.io.to(receiverUserData.socket_id)
        //   .emit(receiverUserData.socket_id, msg);
        let a;
        for (a in receiverUserData.socket_id) {
          app.io.to(receiverUserData.socket_id[a]).emit(receiverUserData.socket_id[a], msg);
        }
      }
      // save the message
      const message = {
        sender: socket.userData._id,
        receiver: receiverUserData._id,
        message: payload.message,
        message_type: payload.message_type,
      };
      ctx.service.message.saveMessage(message);
    } catch (error) {
      app.logger.error(error);
    }
  }

  /**
   * the client disconnected
   *
   * @return {Promise<void>}
   */
  async disconnect() {
    const { ctx, logger } = this;
    const socket = ctx.socket;
    console.log('bye bye,You Are disConnected!');
    console.log(socket.id);

    await ctx.service.user.getUser({ socket_id: socket.id })
      .then(userData => {
        logger.info('user data', userData);
        if (userData) {
          userData.socket_id = ctx.helper.remove(userData.socket_id, socket.id);
          logger.info('user data', userData);
          userData.online -= 1;
          if (userData.socket_id.length <= 0) {
            userData.online -= 0;
          }
          userData.save(function(err) {
            console.log(err);
          });
        } else {
          logger.info('bye');
        }
      });
  }

  async error() {
    console.log('error');
  }
}

module.exports = NspController;
