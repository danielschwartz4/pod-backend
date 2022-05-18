"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeItemByValue = void 0;
function removeItemByValue(arr, value) {
    const index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}
exports.removeItemByValue = removeItemByValue;
//# sourceMappingURL=removeItem.js.map