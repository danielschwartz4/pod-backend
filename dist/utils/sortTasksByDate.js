"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortTasksByDate = void 0;
function sortTasksByDate(dates) {
    dates.sort(function (a, b) {
        const aDate = a.actionDate;
        const bDate = b.actionDate;
        return aDate.getTime() < bDate.getTime()
            ? -1
            : aDate.getTime() == bDate.getTime()
                ? 0
                : 1;
    });
    return dates;
}
exports.sortTasksByDate = sortTasksByDate;
//# sourceMappingURL=sortTasksByDate.js.map