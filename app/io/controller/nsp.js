'use strict';

const Controller = require('egg').Controller;
const mongoose = require('mongoose');


class NspController extends Controller {

  /**
   * p2p chat
   *
   * @return {Promise<void>}
   */
  async chat() {
    const { ctx, app, logger } = this;
    const args = ctx.args[0] || {};
    const socket = ctx.socket;
    const sender = socket.id;
    try {
      const { receiver, payload } = args;
      if (!receiver) {
        socket.emit(ctx.response.fail('receiver username required!'));
      }
      // 查找用户是否在线
      const receiverUserData = await ctx.service.user.getUser({ username: receiver });
      if (!receiverUserData) {
        socket.emit(ctx.response.fail('receiver does not exist!'));
      }
      console.log(receiverUserData);

      // 查找receiver是否为好友，如不是，则添加
      if (socket.userData.friends.indexOf(receiverUserData._id) < 0) {
        socket.userData.friends.push(receiverUserData._id);
        socket.userData.save();
      }
      logger.info('user data', socket.userData);

      // 查找receiver是否在线，在，则emit
      if (receiverUserData.online === 1 && receiverUserData.socket_id !== undefined) {
        // the receiver is online
        const msg = ctx.helper.parseMsg('chat', payload, { sender, receiver });
        app.io.to(receiverUserData.socket_id).emit(receiverUserData.socket_id, msg);
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
    ctx.service.user.getUser({ socket_id: socket.id })
      .then(userData => {
        logger.info('user data', userData);
        userData.online = '0';
        userData.socket_id = '';
        userData.save(function(err) {
          console.log(err);
        });
      });
  }

  async error() {
    console.log('error');
  }
}


module.exports = NspController;
