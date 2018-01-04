import {lua, lauxlib, lualib} from "fengari";
import jslib from "fengari-interop";

import config from "~/config";
import Step from "../../Step";

import createCodeRunner from "./createCodeRunner";
import createGlobalVars from "./createGlobalVars";
import setGlobalVars from "./setGlobalVars";

export default function(env, scriptPath, setupScripts, mainScript) {
  return Step("Battle.Script", function(context, state, done, fail) {
    const extension = config.getExtension(this.server);
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
    
    (setupScripts || extension.scripts || []).forEach(runScript);
    runScript(mainScript || extension.mainScript);
  });
}
