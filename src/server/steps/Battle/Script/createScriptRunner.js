import fs from "fs";
import createCodeRunner from "./createCodeRunner";

export const readScript = (path) => fs.readFileSync(path);

export default function createScriptRunner(context, L, executeCode) {
  executeCode = executeCode || createCodeRunner(context);

  const logger = context.server.logger;
  return function executeScript(path) {
    logger.debug("Executing script:", path);
    executeCode(L, readScript(path));
  };
}
