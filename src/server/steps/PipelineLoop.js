import {createProcess} from "./Helper";

export default function PipelineLoop(env, pipeline) {
  return createProcess("PipelineLoop", ({manager}) => {
    return manager.process(pipeline.call(this, env));
  }, {
    doNotTimeout: true
  });
}
