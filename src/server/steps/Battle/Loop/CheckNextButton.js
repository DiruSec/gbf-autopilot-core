import Check from "../../Check";
import Step from "../../Step";
import ClickNextButton from "./ClickNextButton";

export default function(next, stop) {
  return Step(function checkNextButton(context) {
    next = next.bind(this);
    stop = stop.bind(this);

    return Check(".btn-result")
      .call(this, context)
      .then(() => {
        return ClickNextButton()
          .call(this, context)
          .then(stop);
      }, next);
  });
}
