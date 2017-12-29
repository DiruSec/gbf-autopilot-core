import {lua} from "fengari";
import jslib from "fengari-interop";
import forEach from "lodash/forEach";

export default function setGlobalVars(L, globalVars) {
  forEach(globalVars, (val, name) => {
    jslib.push(L, val);
    lua.lua_setglobal(L, lua.to_luastring(name));
  });
}
