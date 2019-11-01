'use strict';

const socketioJwt = require('socketio-jwt');

module.exports = () => {
  return async (ctx, next) => {
    const { app, socket, logger } = ctx;
    const nsp = app.io.of('/');

    // const id = socket.id;
    // const nsp = app.io.of('/');
    // const query = socket.handshake.query;
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

    nsp.use(socketioJwt.authorize({
      secret: app.config.jwt.secret,

      handshake: true,
    }));

    nsp.once('connection', socket => {
      logger.info('hello,You Are Connected!');
      logger.info(socket.decoded_token);

      // set user online status
      if (socket.decoded_token !== undefined) {
        ctx.service.user.getUser({ username: socket.decoded_token.username }, null, 'friends', [ 'avatar', 'username', 'online', '_id' ])
          .then(userData => {
            if (userData.socket_id.indexOf(socket.id) < 0) {
              userData.socket_id.push(socket.id);
              userData.online += 1;
            }
            userData.save();
            ctx.socket.userData = userData;
            logger.info('user data', userData);
            const payload = Object.assign(userData);
            payload.password = undefined;
            socket.emit(socket.id, ctx.helper.parseMsg('userInfo', payload, { receiver: socket.id }));
          }).then();
      }
    });

  };
};
