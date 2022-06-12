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
exports.SingleTask = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let SingleTask = class SingleTask extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SingleTask.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SingleTask.prototype, "userId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SingleTask.prototype, "taskId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date, { nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], SingleTask.prototype, "actionDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)("boolean", { nullable: true, default: false }),
    __metadata("design:type", Boolean)
], SingleTask.prototype, "completed", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SingleTask.prototype, "notes", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SingleTask.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SingleTask.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.singleTasks),
    __metadata("design:type", User_1.User)
], SingleTask.prototype, "user", void 0);
SingleTask = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], SingleTask);
exports.SingleTask = SingleTask;
//# sourceMappingURL=SingleTask.js.map