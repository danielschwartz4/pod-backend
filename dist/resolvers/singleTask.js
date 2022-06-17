"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleTasksResolver = void 0;
const RecurringTask_1 = require("../entities/RecurringTask");
const type_graphql_1 = require("type-graphql");
const SingleTask_1 = require("../entities/SingleTask");
const SingleTaskInput_1 = require("../types/SingleTaskInput");
const types_1 = require("../types/types");
const sortTasksByDate_1 = require("../utils/sortTasksByDate");
const singleTaskUtils_1 = require("../utils/singleTaskUtils");
let SingleTasksResolver = class SingleTasksResolver {
    async singleTasks(taskId) {
        const tasks = await SingleTask_1.SingleTask.find({
            where: { taskId: taskId },
        });
        if (!tasks) {
            return { errors: "Can't find any tasks" };
        }
        const sortedTasks = (0, sortTasksByDate_1.sortTasksByDate)(tasks);
        return { singleTasks: sortedTasks };
    }
    async singleTask(id) {
        const task = await SingleTask_1.SingleTask.findOne({ id });
        if (!task) {
            return { errors: "Task does not exist" };
        }
        return { singleTask: task };
    }
    async updateSingleTaskCompletionStatus(status, id) {
        const task = await SingleTask_1.SingleTask.findOne(id);
        if (!task) {
            console.log("task does not exist");
        }
        await SingleTask_1.SingleTask.update({ id }, { status });
        return { task };
    }
    async updateSingleTaskNotes(notes, id) {
        const task = await SingleTask_1.SingleTask.findOne(id);
        if (!task) {
            console.log("task does not exist");
        }
        await SingleTask_1.SingleTask.update({ id }, { notes });
        return { task };
    }
    async addSingleTask(singleTaskOptions) {
        let task;
        try {
            task = await SingleTask_1.SingleTask.create(Object.assign({}, singleTaskOptions)).save();
        }
        catch (_a) {
            return {
                errors: "cannot add task",
            };
        }
        return { task };
    }
    async addSingleTasksChunk(recTaskId, limit) {
        var _a, _b, _c, _d;
        const recurringTask = await RecurringTask_1.RecurringTask.findOne({
            where: { id: recTaskId },
        });
        if (!recurringTask) {
            return { errors: "must provide a recurring task as argument" };
        }
        if ((recurringTask === null || recurringTask === void 0 ? void 0 : recurringTask.startDate) == undefined) {
            return { errors: "must provide start date" };
        }
        let cursorDate = recurringTask === null || recurringTask === void 0 ? void 0 : recurringTask.cursorDate;
        let endDate;
        let realEndDate;
        if (cursorDate == undefined) {
            cursorDate = recurringTask === null || recurringTask === void 0 ? void 0 : recurringTask.startDate;
        }
        if (((_a = recurringTask === null || recurringTask === void 0 ? void 0 : recurringTask.endOptions) === null || _a === void 0 ? void 0 : _a.date) != null) {
            realEndDate = new Date((_b = recurringTask === null || recurringTask === void 0 ? void 0 : recurringTask.endOptions) === null || _b === void 0 ? void 0 : _b.date);
            endDate = (0, singleTaskUtils_1.minDate)((0, singleTaskUtils_1.addDays)(limit, cursorDate), realEndDate);
        }
        else if (((_c = recurringTask === null || recurringTask === void 0 ? void 0 : recurringTask.endOptions) === null || _c === void 0 ? void 0 : _c.repetitions) != null) {
            realEndDate = (0, singleTaskUtils_1.addDays)(((_d = recurringTask === null || recurringTask === void 0 ? void 0 : recurringTask.endOptions) === null || _d === void 0 ? void 0 : _d.repetitions) * 7, recurringTask.startDate);
            endDate = (0, singleTaskUtils_1.minDate)((0, singleTaskUtils_1.addDays)(limit, cursorDate), realEndDate);
        }
        else {
            endDate = (0, singleTaskUtils_1.addDays)(limit, cursorDate);
            realEndDate = endDate;
        }
        const selectedDays = recurringTask === null || recurringTask === void 0 ? void 0 : recurringTask.days;
        const selectedDaysIdxs = (0, singleTaskUtils_1.extractDaysIdxs)(selectedDays);
        const singleTasksByDay = (0, singleTaskUtils_1.convertToSingleTasks)(recurringTask, selectedDaysIdxs, cursorDate, endDate);
        const nextDay = (0, singleTaskUtils_1.addDays)(1, endDate);
        if ((0, singleTaskUtils_1.daysEqual)((0, singleTaskUtils_1.minDate)(realEndDate, nextDay), nextDay)) {
            await RecurringTask_1.RecurringTask.update({ id: recTaskId }, { cursorDate: (0, singleTaskUtils_1.addDays)(1, endDate) });
            console.log(singleTasksByDay);
        }
        else if ((0, singleTaskUtils_1.daysEqual)(realEndDate, endDate)) {
            console.log(singleTasksByDay);
            return { errors: "reached end date" };
        }
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => types_1.SingleTasksResponse, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("taskId", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SingleTasksResolver.prototype, "singleTasks", null);
__decorate([
    (0, type_graphql_1.Query)(() => types_1.SingleTaskResponse, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SingleTasksResolver.prototype, "singleTask", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.SingleTaskResponse),
    __param(0, (0, type_graphql_1.Arg)("status")),
    __param(1, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], SingleTasksResolver.prototype, "updateSingleTaskCompletionStatus", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.SingleTaskResponse),
    __param(0, (0, type_graphql_1.Arg)("notes")),
    __param(1, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], SingleTasksResolver.prototype, "updateSingleTaskNotes", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.SingleTaskResponse),
    __param(0, (0, type_graphql_1.Arg)("singleTaskOptions")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SingleTaskInput_1.SingleTaskInput]),
    __metadata("design:returntype", Promise)
], SingleTasksResolver.prototype, "addSingleTask", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.SingleTasksResponse),
    __param(0, (0, type_graphql_1.Arg)("recTaskId")),
    __param(1, (0, type_graphql_1.Arg)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], SingleTasksResolver.prototype, "addSingleTasksChunk", null);
SingleTasksResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], SingleTasksResolver);
exports.SingleTasksResolver = SingleTasksResolver;
//# sourceMappingURL=singleTask.js.map