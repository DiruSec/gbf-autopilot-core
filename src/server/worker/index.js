import workerHandler from "./workerHandler";

export default function worker(extension) {
  workerHandler.call(this, extension);
}
