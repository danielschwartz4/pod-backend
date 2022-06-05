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
let RecurringTaskResolver = class RecurringTaskResolver {
    async recurringTask(id) {
        const task = await RecurringTask_1.RecurringTask.findOne({ where: { id: id } });
        if (!task) {
            return { errors: "No task with this ID" };
        }
        return { task };
    }
    async createRecurringTask(recurringTaskOptions) {
        let task;
        try {
            task = await RecurringTask_1.RecurringTask.create(Object.assign({}, recurringTaskOptions)).save();
        }
        catch (err) {
            return {
                errors: "cannot create task",
            };
        }
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
    (0, type_graphql_1.Mutation)(() => types_1.RecurringTaskResponse),
    __param(0, (0, type_graphql_1.Arg)("recurringTaskOptions")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RecurringTaskInput_1.RecurringTaskInput]),
    __metadata("design:returntype", Promise)
], RecurringTaskResolver.prototype, "createRecurringTask", null);
RecurringTaskResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], RecurringTaskResolver);
exports.RecurringTaskResolver = RecurringTaskResolver;
//# sourceMappingURL=recurringTask.js.map