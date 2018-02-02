import {lua, lauxlib, to_luastring} from "fengari";

exports = module.exports = (logger) => (L) => {
  return function executeCode(code) {
    const result = lauxlib.luaL_dostring(L, to_luastring(code));

    if (result > 0) {
      const top = lua.lua_gettop(L);
      for (var i = -1; i != 0 && i <= top; i++) {
        const msg = lua.to_jsstring(lua.lua_tostring(L, i));
        logger.error(msg);
      }
    }
  };
};

exports["@require"] = ["logger"];
