import assign from "lodash/assign";
import forEach from "lodash/forEach";
import * as Battle from "../../Battle";
import * as Combat from "../../Combat";
import Timeout from "../../Timeout";
import Stop from "../../Stop";

const wrap = (func) => {
  return function() {
    const args = [this.valueOf()];
    forEach(arguments, (arg) => args.push(arg));
    return func.apply(func, args);
  };
};

export default function createGlobalVars(context, state, extras) {
  const server = context.server;
  return assign(extras.env.scriptEnv, {
    vars: extras.env.scriptVars,
    characters: {},

    _running: true,
    _state: state,
    _context: context, 
    _config: extras.config,
    logger: server.logger,
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
}
