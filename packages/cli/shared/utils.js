const ora = require("ora");

const resolveMsg = msg => {
  if (typeof msg === "object") {
    return msg;
  }
  return {
    loading: msg,
  };
};

// 为异步函数添加加载动画
async function wrapLoading(fn, message, ...args) {
  const { loading, success, fail } = resolveMsg(message);
  const spinner = ora(loading);
  // 开始加载动画
  spinner.start();
  try {
    const result = await fn(...args);
    // 修改 loading 状态为成功
    spinner.succeed(success);
    return result;
  } catch (error) {
    spinner.fail(fail);
    throw error;
  }
}

module.exports = { wrapLoading };
