interface Backup {
  write: (fileName: string, fileExtension: string) => void;
}

import fs from "fs";
import path from "path";

const backup:Backup = {
  write: (fileName: string, fileExtension: string): void => {
    const sourceFilePath = path.join(__dirname, `${fileName}.${fileExtension}`);
    const destinationFilePath = path.join(__dirname, `${fileName}.bak`);
    const readStream = fs.createReadStream(sourceFilePath);
    const writeStream = fs.createWriteStream(destinationFilePath);

    readStream.pipe(writeStream);

    writeStream.on("finish", () => {});
    writeStream.on("error", (err: any) => {
      console.log(err);
    });
  },
};

module.exports = backup;
