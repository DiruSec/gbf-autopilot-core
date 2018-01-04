export default function() {
  return function onStart(context) {
    const container = context.container;
    const process = container.resolve("process");
    const env = container.resolve("env");
    process(env.pipeline).then(context.finish, context.error);
  };
}
