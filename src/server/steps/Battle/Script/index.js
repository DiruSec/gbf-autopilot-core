import path from "path";
import {lua, lauxlib, lualib} from "fengari";
import jslib from "fengari-interop";
import assign from "lodash/assign";

import config from "~/config";
import {createProcess} from "../../Helper";

import createCodeRunner from "./createCodeRunner";
import createGlobalVars from "./createGlobalVars";
import setGlobalVars from "./setGlobalVars";

export default function(scriptPath) {
  return createProcess("Battle.Script", (context, state, done, fail) => {
    const L = lauxlib.luaL_newstate();
    const executeCode = createCodeRunner(L, context);
    lualib.luaL_openlibs(L);
    lauxlib.luaL_requiref(L, lua.to_luastring("js"), jslib.luaopen_js, 0);

    const globalVars = createGlobalVars.call(this, context, state, {
      scriptPath,
      done, fail
    });
    setGlobalVars(L, globalVars);

    config.scripts.forEach((script) => {
      const escapedScriptPath = path.resolve(config.scriptDir, script).replace(/\\/g, "\\\\");
      executeCode(`dofile('${escapedScriptPath}')`);
    });
  });
}
