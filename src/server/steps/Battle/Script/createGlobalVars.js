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
  const {done, fail, env, scriptPath} = extras;
  const server = context.server;

  return {
    env,
    characters: {},

    _state: state,
    _context: context, 
    logger: server.logger,
    script: {
      path: scriptPath,
      done, fail
    },
    steps: {
      Battle, Combat, Timeout, Stop
    },

    error_handler: wrap(::server.defaultErrorHandler),
  };
}
