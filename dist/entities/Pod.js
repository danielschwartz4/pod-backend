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
exports.Pod = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Project_1 = require("./Project");
const RecurringTask_1 = require("./RecurringTask");
const User_1 = require("./User");
let Pod = class Pod extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Pod.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [type_graphql_1.Int]),
    (0, typeorm_1.Column)("integer", { array: true, nullable: true }),
    __metadata("design:type", Array)
], Pod.prototype, "projectIds", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [type_graphql_1.Int]),
    (0, typeorm_1.Column)("integer", { array: true, nullable: true }),
    __metadata("design:type", Array)
], Pod.prototype, "userIds", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Pod.prototype, "cap", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ["exercise", "study", "other"],
        default: "other",
    }),
    __metadata("design:type", String)
], Pod.prototype, "taskType", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => User_1.User),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Pod.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Project_1.Project),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Pod.prototype, "projects", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => RecurringTask_1.RecurringTask),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Pod.prototype, "recurringTasks", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)("boolean", { nullable: true, default: false }),
    __metadata("design:type", Boolean)
], Pod.prototype, "isPrivate", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ["project", "task"],
        default: "project",
    }),
    __metadata("design:type", String)
], Pod.prototype, "sessionType", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Pod.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Pod.prototype, "updatedAt", void 0);
Pod = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], Pod);
exports.Pod = Pod;
//# sourceMappingURL=Pod.js.map