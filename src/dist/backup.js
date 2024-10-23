"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const backup = {
  write: (fileName, fileExtension) => {
    const sourceFilePath = path_1.default.join(
      __dirname,
      `${fileName}.${fileExtension}`
    );
    const destinationFilePath = path_1.default.join(
      __dirname,
      `${fileName}.bak`
    );
    const readStream = fs_1.default.createReadStream(sourceFilePath);
    const writeStream = fs_1.default.createWriteStream(destinationFilePath);
    readStream.pipe(writeStream);
    writeStream.on("finish", () => {});
    writeStream.on("error", (err) => {
      console.log(err);
    });
  },
};
module.exports = backup;
