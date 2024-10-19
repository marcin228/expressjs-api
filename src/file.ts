type FileWriteFlags = "w" | "a";

interface File {
  write: (data:string, fileName:string, fileExtension:string, flags:FileWriteFlags) => Promise<string>,
  read: (fileName:string, fileExtension:string) => Promise<string>,
}

import fs from "fs";
import path from "path";

const file: File = {
  write: (
    data: string,
    fileName: string,
    fileExtension: string,
    flags: FileWriteFlags = "a"
  ): Promise<string> => {
    const filePath = path.join(__dirname, `${fileName}.${fileExtension}`);

    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(filePath, { flags: flags });
      writeStream.write(data, (err: unknown) => {
        if (err instanceof Error) reject(err);
        else resolve("File written successfully.");
      });
      writeStream.end();
    });
  },
  read: (fileName: string, fileExtension: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      let data = "";
      const filePath = path.join(__dirname, `${fileName}.${fileExtension}`);
      const readStream = fs.createReadStream(filePath, { encoding: "utf8" });

      readStream.on("data", (part: string) => {
        data += part;
      });

      readStream.on("close", () => {
        resolve(data);
      });

      readStream.on("error", (err: unknown) => {
        if (err instanceof Error) reject(err);
      });
    });
  },
};

module.exports = file;
