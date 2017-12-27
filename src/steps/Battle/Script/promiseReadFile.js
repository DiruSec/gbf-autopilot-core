import fs from "fs";

export default function(path, encoding) {
  encoding = encoding || "utf-8";
  return new Promise((resolve, reject) => {
    fs.readFile(path, {encoding}, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}
