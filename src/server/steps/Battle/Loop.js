import noop from "lodash/noop";
import {createProcess} from "../Helper";
import State from "./State";
import Script from "./Script";
import Location from "../Location";
import Click from "../Click";
import Wait from "../Wait";

export default function Loop(scriptPath, count) {
  count = count || 0;
  return createProcess("Battle.Loop", function(context, _, done, fail) {
    const manager = context.manager;
    const doLoop = () => {
      this.logger.debug("Battle loop:", count);
      manager.process([
        State(),
        Script(scriptPath),
        // consider making its own process for attack
        Click(".btn-attack-start"),
        Loop(scriptPath, ++count)
      ]).then(done, fail);
    };

    manager.process([
      Wait(".btn-attack-start.display-on"),
      Location(),
      (_, location) => {
        location.hash.startsWith("#raid") ? doLoop() : done(false);
      }
    ]).then(noop, fail);
  }, {
    doNotTimeout: true
  });
}
