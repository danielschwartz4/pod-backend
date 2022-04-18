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
exports.PodResponse = exports.ProjectInfoResponse = exports.ProjectResponse = exports.UserResponse = exports.FieldError = void 0;
const type_graphql_1 = require("type-graphql");
const Pod_1 = require("./entities/Pod");
const Project_1 = require("./entities/Project");
const User_1 = require("./entities/User");
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