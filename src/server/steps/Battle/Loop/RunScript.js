import path from "canonical-path";
import Step from "../../Step";

exports = module.exports = (env, server, process, require) => (scriptPath) => {
  const State = require("steps/Battle/State");
  const Script = require("steps/Battle/Script");
  return Step(async function runScript() {
    // run script when defined
    if (scriptPath) {
      const rootDir = server.rootDir;
      const absoluteScriptPath = path.resolve(rootDir, scriptPath);
      return await process([
        State(),
        Script(absoluteScriptPath)
      ]);
    } else {
      return null;
    }
  });
};

exports["@require"] = ["env", "server", "process", "require"];
