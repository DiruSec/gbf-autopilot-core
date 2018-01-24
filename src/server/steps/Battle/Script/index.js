import {lua, lauxlib, lualib} from "fengari";
import jslib from "fengari-interop";
import Step2 from "../../Step2";

exports = module.exports = (extension, require, coreConfig) => (scriptPath, setupScripts, mainScript) => {
  const createGlobalVars = require("steps/Battle/Script/createGlobalVars");
  const createCodeRunner = require("steps/Battle/Script/createCodeRunner");
  const setGlobalVars = require("steps/Battle/Script/setGlobalVars");

  return Step2("Battle", function Script(state, resolve, reject) {
    const L = lauxlib.luaL_newstate();
    const closeLua = () => {
      lua.lua_settop(L, 0);
      // lua.lua_close(L);
    };
    lualib.luaL_openlibs(L);
    lauxlib.luaL_requiref(L, lua.to_luastring("js"), jslib.luaopen_js, 0);

    const executeCode = createCodeRunner(L);
    const globalVars = createGlobalVars(state, {
      scriptDir: coreConfig.scriptDir,
      scriptPath,
      done(result) {
        closeLua();
        return resolve(result);
      },
      fail(err) {
        closeLua();
        return reject(err);
      }
    });
    const runScript = (script) => {
      const escapedScriptPath = script.replace(/\\/g, "\\\\");
      executeCode(`dofile('${escapedScriptPath}')`);
    };

    setGlobalVars(L, globalVars);
    (setupScripts || extension.scripts || []).forEach(runScript);
    runScript(mainScript || extension.mainScript);
  });
};

exports["@require"] = ["extension", "require", "coreConfig"];
