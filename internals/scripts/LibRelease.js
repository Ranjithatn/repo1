// @flow
import chalk from "chalk";
const fs = require("fs");
// import { execSync } from "child_process";
const path = require("path");
const ncp = require("ncp").ncp;

const nonNativeModulesPath = path.normalize(
  path.join(__dirname, "../../", "node_modules")
);
const nativeModulesPath = path.normalize(
  path.join(__dirname, "../../", "app", "node_modules")
);
const libPath = path.normalize(path.join(__dirname, "../../", "lib/"));
const releasePath = path.normalize(
  path.join(__dirname, "../../", "release/win-ia32-unpacked/")
);
const cardConfigPath = path.normalize(
  path.join(
    __dirname,
    "../../",
    "app/hardwareSDK/cardscan/awscan_fbi_criminal_full.xml"
  )
);

const nonNativeModules = [
  "font-awesome",
  "source-map-support",
  "electron-settings"
];

const nativeModules = [
  "array-index",
  "bindings",
  "debug",
  "es6-symbol",
  "ffi",
  "ms",
  "nan",
  "ref",
  "ref-array",
  "ref-struct"
];

copyDlls(libPath, releasePath).then(done => {
  if (done) {
    copyNonNativeModules(nonNativeModules, nonNativeModulesPath, releasePath);
    copyNativeModules(nativeModules, nativeModulesPath, releasePath);
    copyCardConfig(cardConfigPath, releasePath);
  }
});

function copyNonNativeModules(modules, pathToNonNativeModules, pathToRelease) {
  try {
    modules.forEach(module => {
      const src = path.normalize(pathToNonNativeModules + "/" + module);
      let dest = path.normalize(pathToRelease + "/node_modules/" + module);
      if (module === "electron-settings") {
        dest = path.normalize(pathToRelease + "/resources/node_modules");
        if (!fs.existsSync(dest)){
          fs.mkdirSync(dest);
          dest = dest + "/" + module;
        }
      }
      console.log(
        chalk.white(`
          copying ${src}
          to
          ${dest}
        `)
      );
      ncp(src, dest, err => {
        if (err) {
          console.log(chalk.red("failed to copy non native module " + err));
        } else {
          console.log(
            chalk.green(`
              copied ${src}
              to
              ${dest}
          `)
          );
        }
      });
    });
  } catch (e) {
    console.log(chalk.red("failed to copy non native module " + e));
  }
}

function copyNativeModules(modules, pathToNativeModules, pathToRelease) {
  try {
    modules.forEach(module => {
      const src = path.normalize(pathToNativeModules + "/" + module);
      const dest = path.normalize(pathToRelease + "/node_modules/" + module);
      console.log(
        chalk.white(`
          copying ${src}
          to
          ${dest}
        `)
      );
      ncp(src, dest, err => {
        if (err) {
          console.log(chalk.red("failed to copy native module " + err));
        } else {
          console.log(
            chalk.green(`
              copied ${src}
              to
              ${dest}
          `)
          );
        }
      });
    });
  } catch (e) {
    console.log(chalk.red("failed to copy native modules " + e));
  }
}

function copyDlls(pathToLib, pathToRelease) {
  return new Promise((resolve, reject) => {
    console.log(chalk.white("copying " + libPath + " to " + pathToRelease));
    try {
      ncp(pathToLib, pathToRelease, function(err) {
        if (err) {
          console.log(
            chalk.red("failed to copy " + pathToLib + " to " + pathToRelease)
          );
          reject(false);
        } else {
          console.log(
            chalk.green("copied " + pathToLib + " to " + pathToRelease)
          );
          resolve(true);
        }
      });
    } catch (e) {
      console.log(chalk.red("failed to copy dlls", e));
      reject(false);
    }
  });
}

function copyCardConfig(pathToCardConfig, pathToRelease) {
  console.log(
    chalk.white(`
      copying ${pathToCardConfig}
      to
      ${pathToRelease}
    `)
  );
  try {
    pathToRelease = path.normalize(pathToRelease + "awscan_fbi_criminal_full.xml")
    ncp(pathToCardConfig, pathToRelease, err => {
      if (err) {
        console.log(
          chalk.red("failed to copy cardscan config")
        );
      } else {
        console.log(
          chalk.green("copied cardscan config successfully")
        );
      }
    })
  } catch (e) {
    console.log(
      chalk.red("failed to copy cardscan config")
    );
  }
}