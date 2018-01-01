import {createProcess} from "../Helper";

export default function UseItem(item_id, num) {
  num = num || 1;
  return createProcess("Quest.UseItem", function() {
    const options = {
      url: "/item/use_normal_item",
      method: "POST",
      data: JSON.stringify({
        item_id, num,
        special_token: null
      }),
    };
    return this.sendAction("ajax", options);
  });
}
