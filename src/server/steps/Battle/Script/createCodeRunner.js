import {lua, lauxlib, to_luastring, to_jsstring} from "fengari";

exports = module.exports = (logger) => (L) => {
  return function executeCode(code) {
    const result = lauxlib.luaL_dostring(L, to_luastring(code));

    if (result > 0) {
      const top = lua.lua_gettop(L);
      for (var i = -1; i <= top; i++) {
        if (i === 0) continue;
        const value = lua.lua_tostring(L, i);
        if (!value) continue;
        const msg = to_jsstring(value);
        logger.error(msg);
      }
    }
  };
};

exports["@require"] = ["logger"];
