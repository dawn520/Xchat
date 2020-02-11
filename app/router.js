'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io } = app;
  router.get('/', controller.home.index);
  router.post('/login', controller.authorization.login);
  // router.get('/test', controller.authorization.test);
  router.get('/message', app.middleware.jwt(), controller.home.getMessage);


  io.of('/').route('chat', io.controller.nsp.chat);
  io.of('/').route('becomeFriends', io.controller.nsp.becomeFriends);
  io.of('/').route('disconnect', io.controller.nsp.disconnect);
  io.of('/').route('error', io.controller.nsp.disconnect);

};
