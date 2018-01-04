import * as Battle from "~/server/steps/Battle";
import * as Location from "~/server/steps/Location";
import PipelineLoop from "~/server/steps/PipelineLoop";
import { testjs } from "fengari-interop";

export default function DefaultPipeline(env) {
  if (!env.questCount) {
    env.questCount = 0;
  }
  return [
    Location.Get(),
    ({manager}, location) => {
      const pipeline = [];

      if (location.hash.startsWith("#raid")) {
        env.questCount++;
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

      pipeline.push(() => {
        if (env.maxQuest && env.questCount >= env.maxQuest) {
          return true;
        }
        const nextPipeline = DefaultPipeline.call(this, env);
        return manager.process(nextPipeline);
      });
      return manager.process(pipeline);
    }
  ];
}
