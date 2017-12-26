import Worker from "./Worker";

export default function(server) {
  return Object.assign(Worker(server));
}
