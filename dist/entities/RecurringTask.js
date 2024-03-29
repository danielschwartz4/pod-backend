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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecurringTask = void 0;
const graphql_type_json_1 = require("graphql-type-json");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Message_1 = require("./Message");
const SingleTask_1 = require("./SingleTask");
const User_1 = require("./User");
let RecurringTask = class RecurringTask extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RecurringTask.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    (0, typeorm_1.Column)({ nullable: true, default: 0 }),
    __metadata("design:type", Number)
], RecurringTask.prototype, "podId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RecurringTask.prototype, "userId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ default: "Unnamed task" }),
    __metadata("design:type", String)
], RecurringTask.prototype, "taskName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ["exercise", "study", "other"],
        default: "other",
    }),
    __metadata("design:type", String)
], RecurringTask.prototype, "taskType", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RecurringTask.prototype, "overview", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_type_json_1.GraphQLJSONObject),
    (0, typeorm_1.Column)("jsonb"),
    __metadata("design:type", Object)
], RecurringTask.prototype, "days", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], RecurringTask.prototype, "startDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_type_json_1.GraphQLJSONObject),
    (0, typeorm_1.Column)("jsonb"),
    __metadata("design:type", Object)
], RecurringTask.prototype, "endOptions", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date, { nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], RecurringTask.prototype, "cursorDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => graphql_type_json_1.GraphQLJSONObject),
    (0, typeorm_1.Column)("jsonb", {
        default: {
            allTime: 0,
            week: 0,
        },
    }),
    __metadata("design:type", Object)
], RecurringTask.prototype, "completedCount", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    (0, typeorm_1.Column)("text", { array: true, nullable: true }),
    __metadata("design:type", Array)
], RecurringTask.prototype, "friendProposals", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RecurringTask.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], RecurringTask.prototype, "updatedAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.recurringTasks, { nullable: true }),
    __metadata("design:type", User_1.User)
], RecurringTask.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [SingleTask_1.SingleTask], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => SingleTask_1.SingleTask, (st) => st.recurringTask),
    __metadata("design:type", Array)
], RecurringTask.prototype, "singleTasks", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Message_1.Message], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => Message_1.Message, (message) => message.task),
    __metadata("design:type", Array)
], RecurringTask.prototype, "messages", void 0);
RecurringTask = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], RecurringTask);
exports.RecurringTask = RecurringTask;
//# sourceMappingURL=RecurringTask.js.map