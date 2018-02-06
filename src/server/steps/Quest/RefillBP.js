import Refill from "./Refill";

const factory = Refill("BP", 5);
factory.on("beforeRefill", (container) => {
  const logger = container.resolve("logger");
  const env = container.resolve("env");
  env.berryUsed = env.berryUsed || 0;
  logger.debug("Refilling BP...");
});
factory.on("afterRefill", (container, itemId, num) => {
  const logger = container.resolve("logger");
  const env = container.resolve("env");
  env.berryUsed += num;
  logger.debug("Berry used:", env.potUsed);
});
module.exports = factory;
