import path from "path";

import {createProcess} from "../Helper";
import * as Location from "../Location";

import State from "./State";
import Script from "./Script";
import Click from "../Click";
import Check from "../Check";
import Wait from "../Wait";

export default function Loop(scriptPath, env, count) {
  env = env || {};
  count = count || 0;
  return createProcess("Battle.Loop", function({manager}, $, done, fail) {
    const config = this.config;
    const rootDir = this.server.rootDir;

    scriptPath = scriptPath || config.Combat.LuaScript;

    const checkNextButton = createProcess("CheckNextButton", function(_, $, done, fail) {
      Check(".btn-result").call(this, _).then(() => {
        _.manager.process([
          Click(".btn-result"),
          Location.Wait(),
          Loop(scriptPath, env, ++count)
        ]).then(done, fail);
      }, done);
    });

    const checkLocation = createProcess("CheckLocation", function(_, location, done, fail) {
      location.hash.startsWith("#raid") ? manager.process([
        State(),
        function RunScript(_, state) {
          // run script when defined
          if (scriptPath) {
            const absoluteScriptPath = path.resolve(rootDir, scriptPath);
            return Script(absoluteScriptPath, env).call(this, _, state);
          } else {
            return null;
          }
        },
        // consider making its own process for attack
        Click(".btn-attack-start"),
        Loop(scriptPath, ++count)
      ]).then(done, fail) : done(false);
    });

    manager.process([
      Wait(".btn-attack-start.display-on,.btn-result,.cnt-result"),
      checkNextButton,
      Location.Get(),
      checkLocation,
    ]).then(done, fail);
  }, {
    doNotTimeout: true
  });
}
