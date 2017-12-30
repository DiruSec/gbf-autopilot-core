import path from "path";
import noop from "lodash/noop";
import {createProcess} from "../Helper";
import State from "./State";
import Script from "./Script";
import Location from "../Location";
import Click from "../Click";
import Check from "../Check";
import Wait from "../Wait";

export default function Loop(scriptPath, count) {
  count = count || 0;
  return createProcess("Battle.Loop", function(_, $, done, fail) {
    const config = this.config;
    const rootDir = this.server.rootDir;
    scriptPath = scriptPath || path.resolve(rootDir, config.Combat.LuaScript);

    const checkNextButton = createProcess("CheckNextButton", function(_, $, done, fail) {
      Check(".btn-result").call(this, _).then(() => {
        _.manager.process([
          Click(".btn-result"),
          Loop(scriptPath, ++count)
        ]).then(done, fail);
      }, done);
    });

    const checkLocation = createProcess("CheckLocation", function(_, location, done, fail) {
      !location.hash.startsWith("#raid") ? done(false) : _.manager.process([
        State(),
        Script(scriptPath),
        // consider making its own process for attack
        Click(".btn-attack-start"),
        Loop(scriptPath, ++count)
      ]).then(done, fail);
    });

    _.manager.process([
      Wait(".btn-attack-start.display-on,.btn-result"),
      checkNextButton,
      Location(),
      checkLocation
    ]).then(done, fail);
  }, {
    doNotTimeout: true
  });
}
