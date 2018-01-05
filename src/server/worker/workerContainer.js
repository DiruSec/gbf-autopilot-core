import path from "canonical-path";
import forEach from "lodash/forEach";

export default class WorkerContainer {
  constructor(context) {
    this.context = context;
    this.registers = {};
    this.components = {};
    this.setup();
  }

  setup() {
    forEach(this.context, (value, name) => this.register(name, value));
    this.register("container", this);
    this.register("context", this.context);
    this.register("inject", ::this.inject);
    this.register("require", ::this.require);
    this.register("process", ::this.process);
    this.register("run", ::this.run);
  }

  resolve(name) {
    return this.registers[name];
  }

  register(name, value) {
    this.registers[name] = value;
    return this;
  }

  inject(object) {
    const components = (object["@require"] || []).map((name) => {
      return this.resolve(name);
    });
    return object.apply(object, components);
  }

  process(steps) {
    return this.context.process(steps);
  }

  run(step) {
    return this.context.run(step);
  }

  require(obj) {
    if (typeof obj === "string") {
      const id = path.normalize(path.join("..", obj));
      if (this.components[id]) {
        return this.components[id];
      }

      const component = this.require(require(id));
      return this.components[id] = component;
    }

    if (typeof obj !== "function" || !obj["@require"]) {
      return obj;
    }

    obj = this.inject(obj);
    Object.keys(obj).forEach((attr) => {
      obj[attr] = this.require(obj[attr]);
    });
    return obj;
  }
}
