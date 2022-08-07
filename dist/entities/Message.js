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
exports.Message = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const RecurringTask_1 = require("./RecurringTask");
const User_1 = require("./User");
let Message = class Message extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Message.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Message.prototype, "userId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, typeorm_1.Column)({ default: -1 }),
    __metadata("design:type", Number)
], Message.prototype, "taskId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Message.prototype, "message", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Message.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Message.prototype, "updatedAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => User_1.User, (u) => u.singleTasks, { nullable: true }),
    __metadata("design:type", User_1.User)
], Message.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => RecurringTask_1.RecurringTask, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => RecurringTask_1.RecurringTask, (rt) => rt.messages, { nullable: true }),
    __metadata("design:type", RecurringTask_1.RecurringTask)
], Message.prototype, "task", void 0);
Message = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], Message);
exports.Message = Message;
//# sourceMappingURL=Message.js.map