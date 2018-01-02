import {lua, lauxlib, lualib} from "fengari";
import jslib from "fengari-interop";

import config from "~/config";
import {createProcess} from "../../Helper";

import createCodeRunner from "./createCodeRunner";
import createGlobalVars from "./createGlobalVars";
import setGlobalVars from "./setGlobalVars";

export default function(env, scriptPath) {
  return createProcess("Battle.Script", function(context, state, done, fail) {
    const plugin = config.getPlugin(this.server);
    const globalVars = createGlobalVars.call(this, context, state, {
      env,
      scriptPath,
      done, fail,
      config: this.config
    });
    const runScript = (script) => {
      const escapedScriptPath = script.replace(/\\/g, "\\\\");
      executeCode(`dofile('${escapedScriptPath}')`);
    };

    const L = lauxlib.luaL_newstate();
    const executeCode = createCodeRunner(L, context);
    lualib.luaL_openlibs(L);
    lauxlib.luaL_requiref(L, lua.to_luastring("js"), jslib.luaopen_js, 0);
    setGlobalVars(L, globalVars);
    
    plugin.scripts.forEach(runScript);
    runScript(plugin.mainScript);
  });
}
