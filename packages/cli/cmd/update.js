const { join } = require("path");
const { ensureDirSync } = require("fs-extra");
const chalk = require("chalk");
const Generator = require("../lib/Generator");
const config = require("../config");

/**
 * @description 响应命令行指令 update
 * @example `digital update`
 * @param {Record<string, any>} options 额外的配置
 */
module.exports = async function update(options = {}) {
  const targetDir = process.cwd();

  const generator = new Generator(targetDir, options);

  try {
    initWorkspace(targetDir);
    await generator.update();
  } catch (e) {
    console.log("\r\n");
    console.error(e);
    process.exit(-1);
  }

  console.log(
    `\r\nSuccessfully updated the ${chalk.cyan("digital")} directory.`
  );
};

function initWorkspace(targetDir) {
  // 创建 digital 工作空间
  ensureDirSync(join(targetDir, config.digitalPath));
}
