const gitclone = require("git-clone/promise");

const download = async (url, targetDir, options = { branch: "master" }) => {
  const { branch = "master" } = options;
  try {
    await gitclone(url, targetDir, {
      checkout: branch,
    });
  } catch (error) {
    console.warn(error);
    throw error;
  }
};

module.exports = download;
