import assign from "lodash/assign";

// TODO: make the wrap function reusable (eg: making helper library for Lua)
const wrap = (func) => function(...args) {
  args.unshift(this.valueOf());
  return func.apply(func, args);
};

exports = module.exports = (env, server, logger, context, config, require) => (state, extras) => {
  const Battle = require("steps/Battle");
  const Combat = require("steps/Combat");
  const Timeout = require("steps/Timeout");
  const Stop = require("steps/Stop");
  const Location = require("steps/Location");
  const Wait = require("steps/Wait");

  return assign(env.scriptEnv, {
    vars: env.scriptVars,
    characters: {},

    _running: true,
    _state: state,
    _context: context, 
    _config: config,
    logger: logger,
    script: {
      dir: extras.scriptDir,
      path: extras.scriptPath,
      done: extras.done, 
      fail: extras.fail
    },
    steps: {
      Battle, Combat, Timeout, Stop,
      Location, Wait
    },

    error_handler: wrap(::server.defaultErrorHandler),
  });
};

exports["@require"] = ["env", "server", "logger", "context", "config", "require"];
