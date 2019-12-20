'use strict';

const socketioJwt = require('socketio-jwt');
const JWT = require('jsonwebtoken');

module.exports = () => {
  return async (ctx, next) => {
    const { app, socket, logger } = ctx;
    const nsp = app.io.of('/');

    // const id = socket.id;
    // const nsp = app.io.of('/');
    const query = socket.handshake.query;
    //
    // // 用户信息
    // const { username, userId } = query;

    // socket
    //   .on('connection', socketioJwt.authorize({
    //     secret: app.config.jwt.secret,
    //     timeout: 1000, // 15 seconds to send the authentication message
    //     callback:false
    //   }))
    //   .on('authenticated', socket => {
    //     // this socket is authenticated, we are good to handle more events from it.
    //     console.log(`hello! ${socket.decoded_token.name}`);
    //     next();
    //   });

    const tick = (id, msg) => {
      logger.debug('#tick', id, msg);
      // 踢出用户前发送消息
      socket.emit(id, ctx.helper.parseMsg('deny', msg));
      // 调用 adapter 方法踢出用户，客户端触发 disconnect 事件
      nsp.adapter.remoteDisconnect(id, true, err => {
        logger.error(err);
      });
    };
    let decodedToken;
    try {
      logger.info(query);
      logger.info(query.token);

      decodedToken = await JWT.verify(query.token, app.config.jwt.secret);
      logger.info(decodedToken);

    } catch (err) {
      logger.error(err);
      tick(socket.id, {
        type: 'invalid',
        message: 'Token invalid.',
      });
      return;
    }
    let quitFlag = 0;

    // set user online status
    if (decodedToken !== undefined) {
      logger.info('hello,You Are Connected!');
      ctx.service.user.getUser({ username: decodedToken.username }, null, 'friends', [ 'avatar', 'username', 'online', '_id' ])
        .then(userData => {
          if (userData.socket_id.indexOf(socket.id) < 0) {
            userData.socket_id.push(socket.id);
            userData.online += 1;
          }
          userData.save();
          ctx.socket.userData = userData;
          logger.info('user data', userData);
          const payload = ctx.helper.deepCloneSimple(userData);
          payload.password = undefined;
          socket.emit(socket.id, ctx.helper.parseMsg('userInfo', payload, { receiver: socket.id }));
        });
    } else {
      const msg = socket.id + ':Token invalid';
      logger.info(msg);
      quitFlag = 1;
    }
    if (quitFlag) {
      logger.info('quitFlag:' + quitFlag);
      tick(socket.id, {
        type: 'invalid',
        message: 'Token invalid.',
      });
      // ctx.socket.disconnect();
      return;
    }
    await next();
    console.log('disconnection!');


    // nsp.use(socketioJwt.authorize({
    //   secret: app.config.jwt.secret,
    //   handshake: true,
    // }));
    // let quitFlag = 0;
    // nsp.once('connection', socket => {
    //   logger.info('hello,You Are Connected!');
    //   logger.info(socket.decoded_token);
    //
    //   // set user online status
    //   if (socket.decoded_token !== undefined) {
    //     ctx.service.user.getUser({ username: socket.decoded_token.username }, null, 'friends', [ 'avatar', 'username', 'online', '_id' ])
    //       .then(userData => {
    //         if (userData.socket_id.indexOf(socket.id) < 0) {
    //           userData.socket_id.push(socket.id);
    //           userData.online += 1;
    //         }
    //         userData.save();
    //         ctx.socket.userData = userData;
    //         logger.info('user data', userData);
    //         const payload = ctx.helper.deepCloneSimple(userData);
    //         payload.password = undefined;
    //         socket.emit(socket.id, ctx.helper.parseMsg('userInfo', payload, { receiver: socket.id }));
    //       });
    //   } else {
    //     const msg = socket.id + ':Token invalid';
    //     logger.info(msg);
    //     quitFlag = 1;
    //   }
    // });
  };
};
