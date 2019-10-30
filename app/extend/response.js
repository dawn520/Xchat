'use strict';

module.exports = {
  success(data = undefined, message = 'success', code = 200, status = 'success') {
    return {
      code,
      status,
      message,
      data,
    };
  },
  fail(code = -1, message = 'error', status = 'failed', data = undefined) {
    return {
      code,
      status,
      message,
      data,
    };
  },
};
