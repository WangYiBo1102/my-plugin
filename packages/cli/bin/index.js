const { program } = require("commander");
const chalk = require("chalk");
const figlet = require("figlet");
const { init, update } = require("../cmd");
const pkgInfo = require("../package.json");

const VERSION = pkgInfo.version;

function runner() {
  // 定义指令
  program
    .command("init <app-name>")
    .description("create a new project based on digital-lotus")
    .option("-f, --force", "overwrite target directory if it exists")
    .option(
      "-b, --branch <branch>",
      "specify a branch for template repository",
      "master"
    )
    .action((name, options) => {
      init(name, options);
    });
  program
    .command("update")
    .description("update specified files to newest version from GSM")
    .option(
      "-b, --branch <branch>",
      "specify a branch for template repository",
      "master"
    )
    .action(options => {
      update(options);
    });

  // 监听 --help 指令
  program.on("--help", () => {
    console.log(`
        ${figlet.textSync("FED", {
          font: "Flower Power",
          width: 80,
          whitespaceBreak: true,
        })}
    `);
    // 新增说明信息
    console.log(
      `\r\nRun ${chalk.cyan(
        "digital <command> --help"
      )} for detailed usage of given command\r\n`
    );
  });

  program.version(`v${VERSION}`).usage("<command> [option]");

  // 解析用户执行命令传入参数
  program.parse(process.argv);
}

module.exports = {
  runner,
};
