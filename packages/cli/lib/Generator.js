const { dirname, join, resolve } = require("path");
const glob = require("glob");
const fse = require("fs-extra");
const mergeConfigFile = require("../lib/mergeConfigFile");
const downloadRepo = require("../lib/downloadRepo");
const config = require("../config");

// 采用细粒度的文件复制而非直接复制文件夹
// 复制模板项目的文件到新项目
function copyFiles(sourceDir, targetDir) {
  // const digitalDir = join(targetDir, config.digitalPath);
  const files = glob.sync("**/*", {
    cwd: sourceDir,
    dot: true, // 扫描隐藏文件(.开头的文件)
    ignore: ["**/node_modules/**", "**/.git/**"],
  });
  files.forEach(file => {
    const absFile = join(sourceDir, file);
    // if (absFile.includes("config/router.config.js")) {
    //   // 将静态路由文件移动到 digital 工作空间
    //   fse.copyFileSync(absFile, join(digitalDir, "routes.js"));
    //   // 为新项目保留路由模板
    //   copyTempalate("routes.ejs", join(targetDir, "config/router.config.js"));
    //   return;
    // }
    // if (absFile.includes("config/config.js")) {
    //   copyConfig(absFile, join(targetDir, "config/config.js"));
    //   return;
    // }

    const absTarget = join(targetDir, file);
    const isDir = fse.statSync(absFile).isDirectory();

    // 文件夹无需复制，复制其子文件时会创建对应文件夹
    if (isDir) return;
    // 先确保目标文件夹存在
    fse.ensureDirSync(dirname(absTarget));
    fse.copyFileSync(absFile, absTarget);
  });
}

// 复制模板文件
function copyTempalate(template, targetDir) {
  const nativeTplDir = resolve(dirname(__filename), "../templates");
  fse.copyFileSync(join(nativeTplDir, template), targetDir);
}

async function copyConfig(configPath, targetDir, options) {
  try {
    const configContent = await mergeConfigFile(configPath, options);
    fse.writeFileSync(targetDir, configContent);
  } catch (error) {
    console.error(error);
  }
}

class Generator {
  constructor(targetDir, options = {}) {
    if (!targetDir) {
      throw new Error("required targetDir!");
    }
    this.targetDir = targetDir;
    this.options = options;
  }

  async create() {
    const targetDir = this.targetDir;
    const options = this.options;
    fse.ensureDirSync(targetDir);
    // 拉取模板
    const removeTemplate = await downloadRepo(targetDir, options.branch);

    const absTplPath = join(targetDir, config.templatePath);
    // 将基础的文件复制到新项目的工作空间
    copyFiles(absTplPath, targetDir);

    // 复制处理后的配置文件
    await copyConfig(
      join(absTplPath, "config/config.js"),
      join(targetDir, "config/config.js"),
      options
    );

    // 清除模板缓存
    removeTemplate();
  }

  async update() {
    const targetDir = this.targetDir;
    const options = this.options;
    fse.ensureDirSync(targetDir);
    const absTplPath = join(targetDir, config.templatePath);
    // 拉取模板
    const removeTemplate = await downloadRepo(targetDir, options.branch);
    // 更新 src/digital 下的文件
    copyFiles(join(absTplPath, "src/digital"), join(targetDir, "src/digital"));
    // 清除模板缓存
    removeTemplate();
  }
}

module.exports = Generator;
