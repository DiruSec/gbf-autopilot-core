import {lauxlib, lualib} from "fengari";
import jslib from "fengari-interop";

import config from "~/config";
import {createProcess} from "~/steps/Helper";
import Timeout from "~/steps/Timeout";
import * as Battle from "~/steps/Battle";
import * as Combat from "~/steps/Combat";

import createCodeRunner from "./createCodeRunner";
import setGlobalVars from "./setGlobalVars";

const runnerScriptPath = config.rootDir + "/scripts/Runner.lua";

export default function(scriptPath) {
  return createProcess("Battle.Script", (context, state, done, fail) => {
    const executeCode = createCodeRunner(context);
    const server = context.server;

    const L = lauxlib.luaL_newstate();
    lualib.luaL_openlibs(L);
    jslib.luaopen_js(L);

    setGlobalVars(L, {
      context, state,

      logger: server.logger,
      script_path: scriptPath,
      script_done: done,
      script_fail: fail,
      error_handler: ::server.defaultErrorHandler,

      steps: {
        Battle, Combat, Timeout
      },
    });

    const escapedRunnerScriptPath = runnerScriptPath.replace(/\\/g, "\\\\");
    executeCode(L, `dofile('${escapedRunnerScriptPath}')`);
  });
}
