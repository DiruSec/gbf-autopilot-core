import { lua, to_luastring } from "fengari";
import jslib from "fengari-interop";
import forEach from "lodash/forEach";

exports = module.exports = () => (L, globalVars) => {
  forEach(globalVars, (val, name) => {
    jslib.push(L, val);
    lua.lua_setglobal(L, to_luastring(name));
  });
};

exports["@require"] = [];
