import * as Location from "~/server/steps/Location";
import * as Battle from "~/server/steps/Battle";
import PipelineLoop from "~/server/steps/PipelineLoop";
import Timeout from "~/server/steps/Timeout";

export default function EventPipeline(env) {
  const config = this.config;
  if (!config.EventMode.Enabled) return false;

  return [
    Location.Change(config.EventMode.EventPageUrl),
    // TODO: check for nightmare stage
    Timeout(3000),
    Location.Change(config.EventMode.EventRaidUrl),
    Battle.Supporter(),
    Battle.Loop(config.EventMode.EventRaidScript, env),
    PipelineLoop.call(this, EventPipeline, env)
  ];
}
