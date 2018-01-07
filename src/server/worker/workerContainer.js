import path from "canonical-path";
import forEach from "lodash/forEach";
import toArray from "lodash/toArray";

const injectTypes = ["object", "function"];
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

  inject(...args) {
    const object = args.shift();
    const components = (object["@require"] || args).map((name) => {
      return this.resolve(name);
    });
    return object.apply(object, components);
  }

  process(steps, lastResult) {
    return this.context.process(steps.slice(), lastResult);
  }

  run(step, lastResult) {
    return this.context.run(step, lastResult);
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

    const props = {};
    Object.keys(obj).forEach((name) => {
      if (name.startsWith("@")) return;
      const value = obj[name];
      if (injectTypes.indexOf(typeof value) >= 0) {
        props[name] = this.require(value);
      } else {
        props[name] = value;
      }
    });

    if (typeof obj === "function") {
      if (obj["@require"]) {
        obj = this.inject(obj);
      } else {
        obj = obj.bind(obj);
      }
      Object.assign(obj, props);
    } else if (typeof obj === "object") {
      obj = Object.assign({}, obj, props);
    }

    return obj;
  }
}
