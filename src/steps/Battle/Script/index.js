import fs from "fs";

import {lua, lauxlib, lualib} from "fengari";
import jslib from "fengari-interop";
import forEach from "lodash/forEach";

import config from "~/config";
import {createProcess} from "~/steps/Helper";
import UseSkill from "~/steps/Combat/UseSkill";

const runnerScriptPath = config.rootDir + "/scripts/Runner.lua";

const readScript = (path) => fs.readFileSync(path, {encoding: "utf-8"});

const createCodeRunner = (context) => {
  const logger = context.server.logger;
  return function executeCode(L, code) {
    const result = lauxlib.luaL_dostring(L, lua.to_luastring(code));

    if (result > 0) {
      const top = lua.lua_gettop(L);
      for (var i = -1; i != 0 && i <= top; i++) {
        const msg = lua.to_jsstring(lua.lua_tostring(L, i));
        logger.error(msg);
      }
    }
  };
};

const createScriptRunner = (context, executeCode) => {
  executeCode = executeCode || createCodeRunner(context);

  const logger = context.server.logger;
  return function executeScript(L, path) {
    logger.debug("Executing script:", path);
    executeCode(L, readScript(path));
  };
};

const setGlobalVars = (L, globalVars) => {
  forEach(globalVars, (val, name) => {
    jslib.push(L, val);
    lua.lua_setglobal(L, lua.to_luastring(name));
  });
};

export default function(scriptPath) {
  return createProcess("Battle.Script", (context, state, done, fail) => {
    const executeCode = createCodeRunner(context);
    const executeScript = createScriptRunner(context, executeCode);

    const server = context.server;

    const L = lauxlib.luaL_newstate();
    lualib.luaL_openlibs(L);
    jslib.luaopen_js(L);

    setGlobalVars(L, {
      context, state,

      logger: server.logger,
      script_done: done,
      script_fail: fail,
      error_handler: ::server.defaultErrorHandler,

      steps: {
        Combat: {
          UseSkill
        }
      },
    });

    const scriptCode = readScript(scriptPath);
    executeCode(L, "function main()\n" + scriptCode + "\nend");
    executeScript(L, runnerScriptPath);
  });
}
