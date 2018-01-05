import assign from "lodash/assign";
import forEach from "lodash/forEach";

const wrap = (func) => {
  return function() {
    const args = [this.valueOf()];
    forEach(arguments, (arg) => args.push(arg));
    return func.apply(func, args);
  };
};

exports = module.exports = (env, server, logger, context, config, require) => (state, extras) => {
  const Battle = require("steps/Battle");
  const Combat = require("steps/Combat");
  const Timeout = require("steps/Timeout");
  const Stop = require("steps/Stop");

  return assign(env.scriptEnv, {
    vars: env.scriptVars,
    characters: {},

    _running: true,
    _state: state,
    _context: context, 
    _config: config,
    logger: logger,
    script: {
      path: extras.scriptPath,
      done: extras.done, 
      fail: extras.fail
    },
    steps: {
      Battle, Combat, Timeout, Stop
    },

    error_handler: wrap(::server.defaultErrorHandler),
  });
};

exports["@require"] = ["env", "server", "logger", "context", "config", "inject"];
