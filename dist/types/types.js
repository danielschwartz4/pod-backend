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
exports.PodResponse = exports.ProjectInfoResponse = exports.SingleTaskResponse = exports.SingleTasksResponse = exports.RecurringTaskResponse = exports.RecurringTaskFieldResponse = exports.ProjectResponse = exports.UserResponse = exports.FieldError = void 0;
const type_graphql_1 = require("type-graphql");
const Pod_1 = require("../entities/Pod");
const Project_1 = require("../entities/Project");
const User_1 = require("../entities/User");
const RecurringTask_1 = require("../entities/RecurringTask");
const SingleTask_1 = require("../entities/SingleTask");
let FieldError = class FieldError {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], FieldError);
exports.FieldError = FieldError;
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
exports.UserResponse = UserResponse;
let ProjectResponse = class ProjectResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], ProjectResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Project_1.Project, { nullable: true }),
    __metadata("design:type", Project_1.Project)
], ProjectResponse.prototype, "project", void 0);
ProjectResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], ProjectResponse);
exports.ProjectResponse = ProjectResponse;
let RecurringTaskFieldResponse = class RecurringTaskFieldResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], RecurringTaskFieldResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => RecurringTask_1.RecurringTask, { nullable: true }),
    __metadata("design:type", RecurringTask_1.RecurringTask)
], RecurringTaskFieldResponse.prototype, "task", void 0);
RecurringTaskFieldResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], RecurringTaskFieldResponse);
exports.RecurringTaskFieldResponse = RecurringTaskFieldResponse;
let RecurringTaskResponse = class RecurringTaskResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], RecurringTaskResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => RecurringTask_1.RecurringTask, { nullable: true }),
    __metadata("design:type", RecurringTask_1.RecurringTask)
], RecurringTaskResponse.prototype, "task", void 0);
RecurringTaskResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], RecurringTaskResponse);
exports.RecurringTaskResponse = RecurringTaskResponse;
let SingleTasksResponse = class SingleTasksResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], SingleTasksResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [SingleTask_1.SingleTask], { nullable: true }),
    __metadata("design:type", Array)
], SingleTasksResponse.prototype, "singleTasks", void 0);
SingleTasksResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], SingleTasksResponse);
exports.SingleTasksResponse = SingleTasksResponse;
let SingleTaskResponse = class SingleTaskResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], SingleTaskResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => SingleTask_1.SingleTask, { nullable: true }),
    __metadata("design:type", SingleTask_1.SingleTask)
], SingleTaskResponse.prototype, "singleTask", void 0);
SingleTaskResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], SingleTaskResponse);
exports.SingleTaskResponse = SingleTaskResponse;
let ProjectInfoResponse = class ProjectInfoResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], ProjectInfoResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Project_1.Project, { nullable: true }),
    __metadata("design:type", Project_1.Project)
], ProjectInfoResponse.prototype, "project", void 0);
ProjectInfoResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], ProjectInfoResponse);
exports.ProjectInfoResponse = ProjectInfoResponse;
let PodResponse = class PodResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], PodResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Pod_1.Pod, { nullable: true }),
    __metadata("design:type", Pod_1.Pod)
], PodResponse.prototype, "pod", void 0);
PodResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], PodResponse);
exports.PodResponse = PodResponse;
//# sourceMappingURL=types.js.map