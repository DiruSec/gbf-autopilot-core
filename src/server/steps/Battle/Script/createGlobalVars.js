import forEach from "lodash/forEach";
import * as Battle from "../../Battle";
import * as Combat from "../../Combat";
import Timeout from "../../Timeout";

const wrap = (func) => {
  return function() {
    const args = [this.valueOf()];
    forEach(arguments, (arg) => args.push(arg));
    return func.apply(func, args);
  };
};

export default function createGlobalVars(context, state, {done, fail, scriptPath}) {
  const server = context.server;

  return {
    context,
    characters: {},

    _state: state,
    logger: server.logger,
    script: {
      path: scriptPath,
      done, fail
    },
    steps: {
      Battle, Combat, Timeout
    },

    error_handler: wrap(::server.defaultErrorHandler),
  };
}
