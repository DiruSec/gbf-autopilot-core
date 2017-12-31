import {createProcess} from "./Helper";

export default function PipelineLoop(pipeline, env) {
  return createProcess("PipelineLoop", ({manager}) => {
    return manager.process(pipeline.call(this, env));
  }, {
    doNotTimeout: true
  });
}
