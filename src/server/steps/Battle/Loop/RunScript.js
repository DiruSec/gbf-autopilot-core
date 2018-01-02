import path from "path";
import Step from "../../Step";
import State from "../State";
import Script from "../Script";

export default function(env, scriptPath) {
  return Step(function runScript({manager}) {
    // run script when defined
    if (scriptPath) {
      const rootDir = this.server.rootDir;
      const absoluteScriptPath = path.resolve(rootDir, scriptPath);
      return manager.process([
        State(),
        Script(env, absoluteScriptPath)
      ]);
    } else {
      return null;
    }
  });
}
