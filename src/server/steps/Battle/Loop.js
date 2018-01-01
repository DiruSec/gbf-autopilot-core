import path from "path";
import noop from "lodash/noop";

import {createProcess} from "../Helper";
import * as Location from "../Location";
import * as Combat from "../Combat";
import * as Click from "../Click";

import State from "./State";
import Script from "./Script";
import Check from "../Check";
import Wait from "../Wait";

export default function Loop(scriptPath, env, count) {
  env = env || {};
  count = count || 0;
  return createProcess("Battle.Loop", function({manager}, $, done, fail) {
    const config = this.config;
    const rootDir = this.server.rootDir;
    scriptPath = scriptPath || config.Combat.LuaScript;

    function runScript({manager}) {
      // run script when defined
      if (scriptPath) {
        const absoluteScriptPath = path.resolve(rootDir, scriptPath);
        return manager.process([
          State(),
          Script(absoluteScriptPath, env)
        ]);
      } else {
        return null;
      }
    }

    function clickNextButton(context) {
      return new Promise((resolve, reject) => {
        var hasChanged = false;
        Location.Wait()
          .call(this, context)
          .then(() => {
            hasChanged = true;
            resolve();
          }, reject);
        Click.Condition(".btn-result", () => hasChanged)
          .call(this, context)
          .then(noop, reject);
      });
    }

    function checkNextButton(context) {
      return Check(".btn-result")
        .call(this, context)
        .then(() => [
          clickNextButton,
        ], () => [
          runScript,
          Combat.Attack()
        ]).then((pipeline) => {
          pipeline.push(Loop(scriptPath, env, ++count));
          return context.manager.process(pipeline);
        });
    }

    function checkLocation(context, location) {
      return location.hash.startsWith("#raid") ?
        checkNextButton(context) : false;
    }

    manager.process([
      Wait(".btn-attack-start.display-on,.btn-result,.cnt-result"),
      Location.Get(),
      checkLocation
    ]).then(done, fail);
  }, {
    doNotTimeout: true
  });
}
