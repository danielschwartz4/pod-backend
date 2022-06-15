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
exports.RecurringTaskResolver = void 0;
const RecurringTask_1 = require("../entities/RecurringTask");
const RecurringTaskInput_1 = require("../types/RecurringTaskInput");
const type_graphql_1 = require("type-graphql");
const types_1 = require("../types/types");
const validateTask_1 = require("../utils/validateTask");
const SingleTask_1 = require("../entities/SingleTask");
let RecurringTaskResolver = class RecurringTaskResolver {
    async recurringTask(id) {
        const task = await RecurringTask_1.RecurringTask.findOne({ where: { id: id } });
        if (!task) {
            return { errors: [{ field: "id", message: "Task not found" }] };
        }
        return { task };
    }
    async recurringTasks({ req }) {
        const userId = req.session.userId;
        const tasks = await RecurringTask_1.RecurringTask.find({ where: { userId: userId } });
        return tasks;
    }
    async podTasks(podId) {
        const tasks = await RecurringTask_1.RecurringTask.find({ where: { podId: podId } });
        return tasks;
    }
    async createRecurringTask(recurringTaskOptions) {
        const errors = (0, validateTask_1.validateTask)(recurringTaskOptions);
        if (errors) {
            return { errors };
        }
        let task;
        task = await RecurringTask_1.RecurringTask.create(Object.assign({}, recurringTaskOptions)).save();
        return { task };
    }
    async updateTaskName(id, taskName) {
        const task = await RecurringTask_1.RecurringTask.findOne(id);
        if (!task) {
            console.log("task does not exist");
            return { errors: "task does not exist" };
        }
        await RecurringTask_1.RecurringTask.update({ id }, { taskName });
        return { task };
    }
    async deleteRecurringTask(id) {
        SingleTask_1.SingleTask.delete({ taskId: id });
        RecurringTask_1.RecurringTask.delete(id);
        return true;
    }
    async updateTaskPod(id, podId) {
        const task = await RecurringTask_1.RecurringTask.findOne(id);
        if (!task) {
            console.log("task does not exist");
            return { errors: "task does not exist" };
        }
        await RecurringTask_1.RecurringTask.update({ id }, { podId });
        return { task };
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => types_1.RecurringTaskResponse, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RecurringTaskResolver.prototype, "recurringTask", null);
__decorate([
    (0, type_graphql_1.Query)(() => [RecurringTask_1.RecurringTask], { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RecurringTaskResolver.prototype, "recurringTasks", null);
__decorate([
    (0, type_graphql_1.Query)(() => [RecurringTask_1.RecurringTask], { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("podId", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RecurringTaskResolver.prototype, "podTasks", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.RecurringTaskResponse),
    __param(0, (0, type_graphql_1.Arg)("recurringTaskOptions")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RecurringTaskInput_1.RecurringTaskInput]),
    __metadata("design:returntype", Promise)
], RecurringTaskResolver.prototype, "createRecurringTask", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.RecurringTaskResponse),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("taskName", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], RecurringTaskResolver.prototype, "updateTaskName", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RecurringTaskResolver.prototype, "deleteRecurringTask", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => types_1.RecurringTaskResponse),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("podId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], RecurringTaskResolver.prototype, "updateTaskPod", null);
RecurringTaskResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], RecurringTaskResolver);
exports.RecurringTaskResolver = RecurringTaskResolver;
//# sourceMappingURL=recurringTask.js.map