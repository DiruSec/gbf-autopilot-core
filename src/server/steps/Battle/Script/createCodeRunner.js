import {lua, lauxlib} from "fengari";

export default function createCodeRunner(context, L) {
  const logger = context.server.logger;
  return function executeCode(code) {
    const result = lauxlib.luaL_dostring(L, lua.to_luastring(code));

    if (result > 0) {
      const top = lua.lua_gettop(L);
      for (var i = -1; i != 0 && i <= top; i++) {
        const msg = lua.to_jsstring(lua.lua_tostring(L, i));
        logger.error(msg);
      }
    }
  };
}
