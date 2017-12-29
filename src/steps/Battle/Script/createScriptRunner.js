import fs from "fs";
import createCodeRunner from "./createCodeRunner";

export const readScript = (path) => fs.readFileSync(path, {encoding: "utf-8"});

export default function createScriptRunner(context, executeCode) {
  executeCode = executeCode || createCodeRunner(context);

  const logger = context.server.logger;
  return function executeScript(L, path) {
    logger.debug("Executing script:", path);
    executeCode(L, readScript(path));
  };
}
