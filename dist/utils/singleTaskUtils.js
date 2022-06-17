"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.daysEqual = exports.minDate = exports.addDays = exports.extractDaysIdxs = exports.convertToSingleTasks = void 0;
function convertToSingleTasks(recurringTask, selectedDaysIdxs, startDate, endDate) {
    if (recurringTask == undefined) {
        return;
    }
    const singleTasksData = dataBetweenTwoDates(startDate, endDate, selectedDaysIdxs);
    return singleTasksData;
}
exports.convertToSingleTasks = convertToSingleTasks;
function dataBetweenTwoDates(start, end, dayIdxs) {
    let dayDict = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
    };
    for (var d = start; d <= end; d.setDate(d.getDate() + 1)) {
        const dayIdx = d.getDay();
        if (dayIdxs.has(dayIdx)) {
            let currDay = dayDict[dayIdx];
            let prev = currDay[currDay.length - 1];
            let newCount = prev == undefined ? 1 : prev["idx"] + 1;
            let newDate = new Date(d);
            let entry = {
                idx: newCount,
                actionDate: newDate,
                actionDay: dayIdx,
            };
            currDay.push(entry);
            dayDict[dayIdx] = currDay;
        }
    }
    return dayDict;
}
function extractDaysIdxs(days) {
    let idxs = new Set();
    Object.keys(days).forEach((day) => {
        if (days[day].isSelected) {
            idxs.add(parseInt(day));
        }
    });
    return idxs;
}
exports.extractDaysIdxs = extractDaysIdxs;
function addDays(days, startDate) {
    const newDate = new Date(startDate);
    return new Date(+newDate + 1000 * 60 * 60 * 24 * days);
}
exports.addDays = addDays;
function minDate(date1, date2) {
    if (date1.setHours(0, 0, 0, 0) < date2.setHours(0, 0, 0, 0)) {
        return date1;
    }
    return date2;
}
exports.minDate = minDate;
const daysEqual = (date1, date2) => {
    let isEqual = false;
    isEqual =
        date1.getDate() == date2.getDate() &&
            date1.getMonth() == date2.getMonth() &&
            date1.getFullYear() == date2.getFullYear();
    return isEqual;
};
exports.daysEqual = daysEqual;
//# sourceMappingURL=singleTaskUtils.js.map