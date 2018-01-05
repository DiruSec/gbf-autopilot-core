import path from "canonical-path";
import Step from "../../Step";
import State from "../State";
import Script from "../Script";

exports = module.exports = function(env, server, process, scriptPath) {
  return Step(async function runScript() {
    // run script when defined
    if (scriptPath) {
      const rootDir = server.rootDir;
      const absoluteScriptPath = path.resolve(rootDir, scriptPath);
      return await process([
        [State],
        [Script, absoluteScriptPath]
      ]);
    } else {
      return null;
    }
  });
};

exports["@require"] = ["env", "server", "process"];
