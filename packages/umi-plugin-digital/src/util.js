/* eslint-disable */
const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

// 读取 ESM 文件模块
requireESM = file => {
  const cwd = process.cwd();
  const outputFile = path.join(cwd, "temp");
  let cmodule;
  try {
    esbuild.buildSync({
      format: "cjs",
      platform: "browser",
      target: "esnext",
      loader: {
        ".ts": "ts",
      },
      bundle: true,
      logLevel: "error",
      entryPoints: [file],
      outfile: outputFile,
    });
    cmodule = require(outputFile);
  } catch (error) {
    console.warn(error);
    cmodule = {};
  } finally {
    fs.rmSync(outputFile);
  }
  return cmodule;
};

module.exports = {
  requireESM,
};
