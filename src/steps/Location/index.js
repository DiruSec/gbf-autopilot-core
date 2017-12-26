import {createProcess} from "./Helper";
import Change from "./Change";

function Location() {
  return createProcess("Location", ({worker}) => {
    return worker.sendAction("location");
  });
}

Location.prototype = {
  Change
};

export default Location;
