'use strict';

module.exports = {
  parseMsg(action, payload = {}, metadata = {}) {
    const meta = Object.assign({}, {
      timestamp: Date.now(),
    }, metadata);

    return {
      meta,
      data: {
        action,
        payload,
      },
    };
  },
  success(data = undefined, message = 'success', code = 200, status = 'success') {
    return {
      code,
      status,
      message,
      data,
    };
  },
  error(code = -1, message = 'error', status = 'failed', data = undefined) {
    return {
      code,
      status,
      message,
      data,
    };
  },
};
