export default function() {
  return function onStop({container}) {
    const logger = container.resolve("logger");
    const env = container.resolve("env") || {};
    logger.info("AP potion used:", env.potUsed || 0);
  };
}
