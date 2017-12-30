import path from "path";
import * as Battle from "~/server/steps/Battle";
import Stop from "~/server/steps/Stop";

export default function TreasureEventBattlePipeline() {
  const config = this.config;
  const rootDir = this.rootDir;
  if (!config.TreasureEventMode.Enabled) return false;

  const scriptPath = config.TreasureEventMode.TreasureEventModeScript;
  const fullScriptPath = path.resolve(rootDir, scriptPath);
  return [
    Battle.Loop(fullScriptPath),
    Stop()
  ];
}
