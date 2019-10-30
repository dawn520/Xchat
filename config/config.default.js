/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1572423063255_5581';

  // add your middleware config here
  config.middleware = [];

  config.jwt = {
    secret: 'egg-api-jwt-ad445123',
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.io = {
    init: {}, // passed to engine.io
    namespace: {
      '/': {
        connectionMiddleware: ['auth'],
        packetMiddleware: [],
      },
      '/example': {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
    },
    // redis: {
    //   host: '127.0.0.1',
    //   port: 6379,
    // },
  };

  // config.io = {
  //   redis: {
  //     host: '127.0.0.1',
  //     port: 6379,
  //     auth_pass: null,
  //     db: 10,
  //   },
  // };
  config.mongoose = {
    client: {
      url: 'mongodb://192.168.3.103/chat', options: {},
    },
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
