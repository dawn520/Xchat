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
  error(code = -1, message = 'error', status = 'failed', data = undefined, debug = undefined) {
    return {
      code,
      status,
      message,
      data,
      debug,
    };
  },

  /**
   * 删除数组中的某一项
   *
   * @param array
   * @param val
   */
  remove(array = [], val) {
    const index = array.indexOf(val);
    if (index > -1) {
      array.splice(index, 1);
    }
    return array;
  },

  /**
   * 深拷贝简易版（不可以拷贝 undefined ， function， RegExp 等类型）
   *
   * @param target
   * @returns {{}}
   */
  deepCloneSimple(obj) {
    const _obj = JSON.stringify(obj);
    const objClone = JSON.parse(_obj);
    return objClone;
  },

  /**
   * 深拷贝
   *
   * @param target
   * @returns {{}}
   */
  deepClone(target) {
    // 定义一个变量
    let result;
    // 如果当前需要深拷贝的是一个对象的话
    if (typeof target === 'object') {
      // 如果是一个数组的话
      if (Array.isArray(target)) {
        result = []; // 将result赋值为一个数组，并且执行遍历
        for (const i in target) {
          // 递归克隆数组中的每一项
          result.push(this.deepClone(target[i]));
        }
        // 判断如果当前的值是null的话；直接赋值为null
      } else if (target === null) {
        result = null;
        // 判断如果当前的值是一个RegExp对象的话，直接赋值
      } else if (target.constructor === RegExp) {
        result = target;
      } else {
        // 否则是普通对象，直接for in循环，递归赋值对象的所有值
        result = {};
        for (const i in target) {
          result[i] = this.deepClone(target[i]);
        }
      }
      // 如果不是对象的话，就是基本数据类型，那么直接赋值
    } else {
      result = target;
    }
    // 返回最终结果
    return result;
  }
};

