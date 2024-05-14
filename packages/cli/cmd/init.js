const { join } = require("path");
const fse = require("fs-extra");
const inquirer = require("inquirer");
const chalk = require("chalk");
const { wrapLoading } = require("../shared/utils");
const config = require("../config");
const Generator = require("../lib/Generator");

/**
 * @description 响应命令行指令 init // TODO: 待重构
 * @example `digital init app`
 * @param {string} appName 要生成的项目名
 * @param {Record<string, any>} options 额外的配置
 */
module.exports = async function init(appName, options = {}) {
  // 当前命令行选择的目录
  const cwd = process.cwd();
  // 新建项目的地址
  const targetDir = join(cwd, appName);

  const generator = new Generator(targetDir, { ...options, appName });

  try {
    await initWorkspace(targetDir, options);
    await generator.create();
  } catch (e) {
    console.log("\r\n");
    console.error(e);
    process.exit(-1);
  }

  console.log(`\r\nSuccessfully init project ${chalk.cyan(appName)}`);
  console.log(`\r\n  cd ${chalk.cyan(appName)}`);
  console.log("  npm install");
  console.log("  npm start\r\n");
};

async function initWorkspace(targetDir, options = {}) {
  // 判断目标目录是否存在
  if (fse.existsSync(targetDir)) {
    // 是否需要强制创建
    if (options.force) {
      fse.removeSync(targetDir);
    } else {
      // 询问是否需要覆盖
      const { action } = await inquirer.prompt([
        {
          name: "action",
          type: "confirm",
          message: "Target directory already exists. Overwrite?",
          default: true,
        },
      ]);
      // 如果用户选择了取消，则退出
      if (!action) {
        process.exit(0);
      }

      if (action) {
        // 移除已存在的目录
        wrapLoading(
          () => {
            fse.removeSync(targetDir);
          },
          {
            loading: `Removing existing target directory ${targetDir}`,
            success: `Removed existing target directory ${targetDir}.`,
            fail: `Remove existing target directory ${targetDir} failed.`,
          }
        );
      }
    }
  }
  // 创建 digital 工作空间
  fse.ensureDirSync(join(targetDir, config.digitalPath));
}
