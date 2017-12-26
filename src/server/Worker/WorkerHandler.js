import TreasureEventPipeline from "~/server/Pipelines/TreasureEventPipeline";

export default function(server) {
  const config = server.config;
  return function({manager}) {
    var pipeline = manager.pipeline;
    if (config.TreasureEventMode.Enabled) {
      pipeline = TreasureEventPipeline(server);
    }
    manager.setPipeline(pipeline);
  };
}
