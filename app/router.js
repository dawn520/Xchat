'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const {router, controller, io, jwt} = app;
  router.get('/', controller.home.index);
  router.post('/login', controller.authorization.login);

  io.of('/').route('p2p', io.controller.nsp.p2p);

};
