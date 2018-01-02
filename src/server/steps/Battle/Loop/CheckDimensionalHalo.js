import Step from "../../Step";
import State from "../State";

export default function(next, stop) {
  return Step(function checkDimensionalHalo(context) {
    next = next.bind(this, context);
    stop = stop.bind(this, context);

    if (!this.config.DimensionalHalo.RetreatWhenNoDimensionalHaloTransformation) {
      return next();
    }

    return State()
      .call(this, context)
      .then((state) => {
        // Not non-transforming dimensional halo
        return state.enemies[0].id != 6005070 ?
          next() : stop();
      });
  });
}
