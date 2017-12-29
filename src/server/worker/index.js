import workerHandler from "./WorkerHandler";

export default function worker() {
  workerHandler.call(this);
  return {};
}
