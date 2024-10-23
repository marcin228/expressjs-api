"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const file = {
  write: (data, fileName, fileExtension, flags = "a") => {
    const filePath = path_1.default.join(
      __dirname,
      `${fileName}.${fileExtension}`
    );
    return new Promise((resolve, reject) => {
      const writeStream = fs_1.default.createWriteStream(filePath, {
        flags: flags,
      });
      writeStream.write(data, (err) => {
        if (err instanceof Error) reject(err);
        else resolve("File written successfully.");
      });
      writeStream.end();
    });
  },
  read: (fileName, fileExtension) => {
    return new Promise((resolve, reject) => {
      let data = "";
      const filePath = path_1.default.join(
        __dirname,
        `${fileName}.${fileExtension}`
      );
      const readStream = fs_1.default.createReadStream(filePath, {
        encoding: "utf8",
      });
      readStream.on("data", (part) => {
        data += part;
      });
      readStream.on("close", () => {
        resolve(data);
      });
      readStream.on("error", (err) => {
        if (err instanceof Error) reject(err);
      });
    });
  },
};
module.exports = file;
