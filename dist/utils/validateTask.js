"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTask = void 0;
const validateTask = (options) => {
    if (!options.taskName) {
        return [
            {
                field: "taskName",
                message: "task name is required",
            },
        ];
    }
    if (!options.taskType) {
        return [
            {
                field: "taskType",
                message: "task type is required",
            },
        ];
    }
    if (!options.overview) {
        return [
            {
                field: "overview",
                message: "Overview is required",
            },
        ];
    }
    if (!options.startDate) {
        return [
            {
                field: "startDate",
                message: "Start date is required",
            },
        ];
    }
    if (!options.endOptions.date &&
        !options.endOptions.repetitions &&
        !options.endOptions.neverEnds) {
        return [
            {
                field: "endOptions",
                message: "Must specify an end date, repetitions, or never ends",
            },
        ];
    }
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    if (options.startDate && options.startDate < yesterday) {
        return [
            {
                field: "startDate",
                message: "Start date must be in the future",
            },
        ];
    }
    if (options.endOptions.date &&
        options.startDate &&
        new Date(options.endOptions.date).getTime() <
            new Date(options.startDate).getTime()) {
        return [
            {
                field: "endOptions",
                message: "End date must be after start date",
            },
        ];
    }
    if (options.endOptions.repetitions &&
        options.startDate &&
        options.endOptions.repetitions < 1) {
        return [
            {
                field: "endOptions",
                message: "Repetitions must be greater than 0",
            },
        ];
    }
    if (Object.values(options.days).every((x) => x.isSelected === false)) {
        return [
            {
                field: "days",
                message: "Must select at least one day",
            },
        ];
    }
    return null;
};
exports.validateTask = validateTask;
//# sourceMappingURL=validateTask.js.map