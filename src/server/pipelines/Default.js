import * as Battle from "~/server/steps/Battle";
import * as Location from "~/server/steps/Location";
import PipelineLoop from "~/server/steps/PipelineLoop";

export default function DefaultPipeline(env) {
  return [
    Location.Get(),
    ({manager}, location) => {
      const pipeline = [];

      if (location.hash.startsWith("#raid")) {
        pipeline.push(Battle.Loop(env, null));
      } else if (location.hash.startsWith("#quest/supporter")) {
        env.questUrl = location.hash;
        pipeline.push(Battle.Supporter(env));
      } else {
        if (env.questUrl) {
          this.logger.info("Using previous quest page:", env.questUrl);
          pipeline.push(Location.Change(env.questUrl));
        } else {
          this.logger.info("Waiting for supporter page...");
          pipeline.push(Location.Wait("#quest/supporter"));
        }
      }

      pipeline.push(PipelineLoop.call(this, env, DefaultPipeline));
      return manager.process(pipeline);
    }
  ];
}
