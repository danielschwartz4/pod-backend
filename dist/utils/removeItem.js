"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function removeItem(arr, value) {
    const index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    console.log("ARR");
    console.log(arr);
    return arr;
}
exports.default = removeItem;
//# sourceMappingURL=removeItem.js.map