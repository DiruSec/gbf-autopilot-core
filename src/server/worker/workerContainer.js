import forEach from "lodash/forEach";
import {Container} from "electrolyte";

export default class WorkerContainer {
  constructor(context) {
    this.context = context;
    this.registers = {};
    this.container = new Container;
    this.container.use(::this.resolve);
    this.setup();
  }

  setup() {
    forEach(this.context, ::this.register);
    this.register("inject", ::this.inject);
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
      return this.container.create(name);
    });
    return object.bind.apply(object, components);
  }

  process(steps) {
    return this.context.process(steps.map((args) => {
      if (!Array.isArray(args)) args = [args];
      const step = args.shift();
      const injected = this.inject(step);
      return injected.apply(injected, args);
    }));
  }

  run() {
    const args = [].slice.call(arguments, 0);
    const step = args.shift();
    const injected = this.inject(step);
    return this.context.run(injected.apply(injected, args));
  }
}
