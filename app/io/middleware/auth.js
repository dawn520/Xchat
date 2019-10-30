'use strict';

const socketioJwt = require('socketio-jwt');

module.exports = () => {
  return async (ctx, next) => {
    const { app, socket, logger, } = ctx;
    const nsp = app.io.of('/');

    // const id = socket.id;
    // const nsp = app.io.of('/');
    const query = socket.handshake.query;
    //
    // // 用户信息
    // const { username, userId } = query;
    console.log('asdasdsadsa');

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
      handshake: true
    }));

    nsp.on('connection', (socket) => {
      console.log('hello!', socket);
    });


    // ctx.socket.disconnect();


  };
};
