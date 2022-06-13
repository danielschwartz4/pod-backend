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
const SingleTask_1 = require("../entities/SingleTask");
const type_graphql_1 = require("type-graphql");
const types_1 = require("../types/types");
const SingleTaskInput_1 = require("../types/SingleTaskInput");
const sortTasksByDate_1 = require("../utils/sortTasksByDate");
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
    __param(0, (0, type_graphql_1.Arg)("singleTaskOptions")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SingleTaskInput_1.SingleTaskInput]),
    __metadata("design:returntype", Promise)
], SingleTasksResolver.prototype, "addSingleTask", null);
SingleTasksResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], SingleTasksResolver);
exports.SingleTasksResolver = SingleTasksResolver;
//# sourceMappingURL=singleTask.js.map