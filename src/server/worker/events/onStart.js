export default function() {
  return function onStart(context) {
    const container = context.container;
    container.inject((env, process) => {
      process(env.pipeline).then(context.finish, context.error);
    }, "env", "process");
  };
}
