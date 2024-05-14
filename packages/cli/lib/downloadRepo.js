const { removeSync, existsSync } = require("fs-extra");
const { join } = require("path");
const config = require("../config");
const { wrapLoading } = require("../shared/utils");
const download = require("../shared/download");

const TEMPLATE_REPO_URL = config.templateURL;

async function downloadRepo(targetDir, branch) {
  // 存放模板的缓存目录
  const templateDir = join(targetDir, config.templatePath);

  const removeRepo = () => {
    removeSync(templateDir);
  };

  if (existsSync(templateDir)) {
    removeRepo();
  }

  await wrapLoading(
    download,
    {
      loading: `Downloading template from ${TEMPLATE_REPO_URL}`,
      success: `Downloaded template from ${TEMPLATE_REPO_URL}.`,
      fail: `Download template from ${TEMPLATE_REPO_URL} failed.`,
    },
    TEMPLATE_REPO_URL,
    templateDir,
    { branch }
  );
  return removeRepo;
}

module.exports = downloadRepo;
