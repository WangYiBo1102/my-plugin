const { dirname, resolve } = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const template = require("@babel/template").default;
const { readFileSync } = require("fs-extra");
const prettier = require("prettier");

async function mergeConfigFile(filePath, options = {}) {
  const codes = readFileSync(filePath, { encoding: "utf-8" });
  const ast = parser.parse(codes, {
    sourceType: "unambiguous",
  });

  // 遍历 AST
  traverse(ast, {
    CallExpression(path) {
      if (path.node.callee.name !== "defineConfig") return;

      const properties = path.node.arguments[0].properties;
      if (!Array.isArray(properties)) return;

      const extraConfigItems =
        plainObj2AST({
          digital: {},
        }).properties || [];
      Array.prototype.push.apply(properties, extraConfigItems);
    },
  });
  // 生成代码
  const { code } = generator(ast);

  // 格式化
  return prettier
    .resolveConfig(
      resolve(dirname(__filename), `../${options.appName}/.prettierrc`)
    )
    .then((options = {}) => {
      const formattedCodes = prettier.format(code, {
        ...options,
        parser: "babel",
      });
      return formattedCodes;
    });
}

function plainObj2AST(pObj) {
  return template.expression(JSON.stringify(pObj))();
}

module.exports = mergeConfigFile;
