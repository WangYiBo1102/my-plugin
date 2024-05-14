/* eslint-disable */
const { join } = require("path");
const { Generator } = require("digital-lotus-cli");
const { requireESM } = require("./util");
const { mergeRoutes } = require("./routes-helper");

// 获取静态路由
const getStaticRoutes = routesPath => {
  try {
    const routesModule = requireESM(routesPath);
    return routesModule.default;
  } catch (error) {
    console.warn(error);
    return [];
  }
};

/**
 * @param {import('umi').IApi} api
 */
module.exports = api => {
  // 注册插件
  api.describe({
    key: "digital",
    config: {
      schema(joi) {
        return joi.object({
          workspace: joi.string(),
          mergeRoute: joi.boolean(),
          skipSyncTemplate: joi.boolean(),
          branch: joi.string(),
          // alias: [joi.boolean(), joi.string()],
        });
      },
    },
    enableBy: api.EnableBy.config,
  });

  const cwd = api.cwd;
  const digitalConfig = api.userConfig.digital || {};
  const {
    mergeRoute,
    skipSyncTemplate = false,
    branch = "master",
    workspace = join(cwd, "./.digital"),
  } = digitalConfig;

  if (mergeRoute) {
    api.modifyRoutes(memo => {
      // 获取静态路由
      const staticRoutes = getStaticRoutes(join(workspace, "routes.js"));
      // 合并静态路由和自定义路由
      memo = mergeRoutes(memo, staticRoutes);
      return memo;
    });
  }
  if (!skipSyncTemplate && !api.args.skipSyncTemplate) {
    api.onStart(async ({ name, args }) => {
      // 0.0.3: build 时暂时不更新，除非添加命令行参数 --sync-template
      if (name !== "build" || args.syncTemplate) {
        api.logger.info("fetch template from SCM.");
        await new Generator(cwd, { branch }).update();
        api.logger.info("directory src/digital has become latest.\r\n");
      }
    });
  }
};
