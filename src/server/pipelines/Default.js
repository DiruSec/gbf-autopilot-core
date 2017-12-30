import * as Battle from "~/server/steps/Battle";
import * as Location from "~/server/steps/Location";

export default function DefaultPipeline(context) {
  return [
    Location.Get(),
    (_, location) => {
      const pipeline = [];

      if (location.hash.startsWith("#raid")) {
        pipeline.push(Battle.Loop());
      } else if (location.hash.startsWith("#quest/supporter")) {
        context.questUrl = location.toString();
        pipeline.push(Battle.Supporter());
      } else {
        if (context.questUrl) {
          this.logger.info("Using previous quest page:", context.questUrl);
          pipeline.push(Location.Change(context.questUrl));
        } else {
          this.logger.info("Waiting for supporter page...");
          pipeline.push(Location.Wait("#quest/supporter"));
        }
      }

      pipeline.push.apply(pipeline, DefaultPipeline.call(this, context));
      return _.manager.process(pipeline);
    }
  ];
}
