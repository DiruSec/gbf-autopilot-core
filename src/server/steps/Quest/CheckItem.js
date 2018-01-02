import forEach from "lodash/forEach";
import Step from "../Step";
import Ajax from "../Ajax";

export default function(id) {
  return Step("Battle.CheckItem", function({manager}) {
    return manager.process([
      Ajax("/item/article_list_by_filter_mode"),
      function getItem(_, data) {
        var count = 0;
        forEach(data, (item) => {
          if (item.item_id == id) {
            count = Number(item.number);
            return false;
          }
        });
        return count;
      }
    ]);
  });
}
