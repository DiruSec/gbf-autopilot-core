import Refill from "./Refill";

const factory = Refill("AP", 2);
factory.on("beforeRefill", (container) => {
  const logger = container.resolve("logger");
  const env = container.resolve("env");
  env.potUsed = env.potUsed || 0;
  logger.debug("Refilling AP...");
});
factory.on("afterRefill", (container, itemId, num) => {
  const logger = container.resolve("logger");
  const env = container.resolve("env");
  env.potUsed += num;
  logger.debug("Pot used:", env.potUsed);
});
module.exports = factory;
