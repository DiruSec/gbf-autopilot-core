import * as Battle from "~/server/steps/Battle";
import * as Location from "~/server/steps/Location";
import PipelineLoop from "~/server/steps/PipelineLoop";

export default function TrialPipeline(env) {
  return [
    Location.Get(),
    ({manager}, location) => {
      const pipeline = [];

      if (location.hash.startsWith("#raid")) {
        pipeline.push(Battle.Loop(env));
      } else {
        this.logger.info("Waiting for trial battle page...");
        pipeline.push(Location.Wait("#raid"));
      }

      pipeline.push(PipelineLoop.call(this, env, TrialPipeline));
      return manager.process(pipeline);
    }
  ];
}

TrialPipeline.test = function() {
  return this.config.Debug.TrialBattleMode; 
};
