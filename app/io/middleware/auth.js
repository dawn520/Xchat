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

    nsp.on('connection', socket => {
      console.log('hello,You Are Connected!');
      console.log(socket.decoded_token);

      // set user online status
      if (socket.decoded_token !== undefined) {
        ctx.service.user.getUser({ username: socket.decoded_token.username })
          .then(userData => {
            logger.info('user data', socket.id);
            userData.online = 1;
            userData.socket_id = socket.id;
            userData.save(function(err) {
              console.log(err);
            });
            ctx.socket.userData = userData;
          });
      }

      // push friends list to socket client
      // const receiver = socket.id;
      // const msg = ctx.helper.parseMsg('friendsList', {}, { receiver });
      // socket.emit(msg);

    });

  };
};
