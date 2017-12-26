import fs from "fs";
import glua from "glua";
import {createProcess} from "../Helper";

const promiseReadFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, {encoding: "utf-8"}, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

const createScriptGlobals = ({server}, state) => {
  const scriptGlobals = {
    characters: {}
  };

  return scriptGlobals;
};

export default function(scriptPath) {
  return createProcess("Battle.Script", (ctx, state, done, fail) => {
    const scriptGlobals = createScriptGlobals(ctx, state);
    promiseReadFile(scriptPath).then((data) => {
      glua.runWithGlobals(scriptGlobals, data);
      done(data);
    }, fail);
  });
}
